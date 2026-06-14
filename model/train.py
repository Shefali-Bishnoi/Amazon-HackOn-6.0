"""
SecondLife Commerce — MobileNetV3 Training on Kaputt Dataset
=============================================================
Steps:
  1. Upload your Kaputt data folder to Colab
  2. !pip install torch torchvision pandas pyarrow onnx onnxruntime tqdm
  3. !python train.py --root-path ./data
  4. Download mobilenet_kaputt.onnx
"""

import argparse
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.amp import GradScaler, autocast
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
from pathlib import Path
from tqdm import tqdm
import time

# ── CONFIG ────────────────────────────────────────────────────
EPOCHS      = 5
BATCH_SIZE  = 64
LR          = 1e-4
NUM_CLASSES = 3         # Like New | Minor Damage | Major Damage
NUM_WORKERS = 0         # 0 avoids forked process RAM issues on Colab

DEFECT_TYPES = [
    "actuation", "deconstruction", "deformation",
    "missing_unit", "penetration", "spillage", "superficial"
]

# ── DATASET ───────────────────────────────────────────────────
class KaputtClassifyDataset(Dataset):
    def __init__(self, root_path, split="train", transform=None):
        self.root  = Path(root_path)
        self.transform = transform or transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize(
                [0.485, 0.456, 0.406],
                [0.229, 0.224, 0.225]
            )
        ])

        split_map = {
            "train": "query-train.parquet",
            "val":   "query-validation.parquet",
            "test":  "query-test.parquet",
        }
        parquet_path = self.root / split_map[split]
        if not parquet_path.exists():
            raise FileNotFoundError(f"Not found: {parquet_path}")

        df = pd.read_parquet(parquet_path)

        def get_label(row):
            if not row["defect"]:         return 0
            elif not row["major_defect"]: return 1
            else:                         return 2

        df["label"] = df.apply(get_label, axis=1)

        def get_defect_vec(defect_str):
            vec = [0.0] * len(DEFECT_TYPES)
            if pd.isna(defect_str) or defect_str == "":
                return vec
            for d in str(defect_str).split(","):
                d = d.strip()
                if d in DEFECT_TYPES:
                    vec[DEFECT_TYPES.index(d)] = 1.0
            return vec

        df["defect_vec"] = df["defect_types"].apply(get_defect_vec)
        self.df = df.reset_index(drop=True)
        print(f"  {split}: {len(self.df)} samples")

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]

        img_rel = str(row["query_crop"])
        if img_rel.startswith("data/"):
            img_rel = img_rel[5:]
        img_path = self.root / img_rel
        try:
            img = Image.open(img_path).convert("RGB")
        except Exception:
            img = Image.new("RGB", (224, 224), (128, 128, 128))

        return {
            "image":      self.transform(img),
            "label":      torch.tensor(row["label"],      dtype=torch.long),
            "defect_vec": torch.tensor(row["defect_vec"], dtype=torch.float32),
        }


# ── MODEL ─────────────────────────────────────────────────────
class SecondLifeGrader(nn.Module):
    def __init__(self):
        super().__init__()
        base = models.mobilenet_v3_small(weights="IMAGENET1K_V1")
        self.backbone = base.features
        self.avgpool  = base.avgpool
        self.shared   = nn.Sequential(
            nn.Linear(576, 256),
            nn.Hardswish(),
            nn.Dropout(0.2)
        )
        self.head_grade  = nn.Linear(256, NUM_CLASSES)
        self.head_defect = nn.Linear(256, len(DEFECT_TYPES))

    def forward(self, x):
        x = self.backbone(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.shared(x)
        return self.head_grade(x), self.head_defect(x)


# ── TRAINING LOOP ─────────────────────────────────────────────
def train(root_path: str, output_path: str):
    device  = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    use_amp = device.type == "cuda"
    print(f"\n[Train] device={device}  amp={use_amp}")
    if use_amp:
        print(f"[Train] {torch.cuda.get_device_name(0)}  "
              f"{torch.cuda.get_device_properties(0).total_memory/1e9:.1f} GB VRAM\n")

    scaler = GradScaler("cuda", enabled=use_amp)

    print("Loading datasets...")
    train_ds = KaputtClassifyDataset(root_path, "train")
    val_ds   = KaputtClassifyDataset(root_path, "val")

    train_loader = DataLoader(
        train_ds, batch_size=BATCH_SIZE,
        shuffle=True, num_workers=NUM_WORKERS, pin_memory=use_amp,
    )
    val_loader = DataLoader(
        val_ds, batch_size=BATCH_SIZE * 2,
        shuffle=False, num_workers=NUM_WORKERS, pin_memory=use_amp,
    )

    model     = SecondLifeGrader().to(device)
    criterion_grade  = nn.CrossEntropyLoss()
    criterion_defect = nn.BCEWithLogitsLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LR)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(
        optimizer, T_max=EPOCHS, eta_min=1e-6
    )

    best_val_acc = 0.0
    n_train_batches = len(train_loader)

    for epoch in range(EPOCHS):
        # ── Train ─────────────────────────────────────────────
        model.train()
        train_loss, correct, total = 0.0, 0, 0
        t0 = time.time()

        pbar = tqdm(train_loader,
                    desc=f"Epoch {epoch+1:02d}/{EPOCHS} [train]",
                    ncols=90, leave=False)

        for batch in pbar:
            images      = batch["image"].to(device, non_blocking=True)
            labels      = batch["label"].to(device, non_blocking=True)
            defect_vecs = batch["defect_vec"].to(device, non_blocking=True)

            optimizer.zero_grad(set_to_none=True)

            with autocast("cuda", enabled=use_amp):
                out_grade, out_defect = model(images)
                loss = (criterion_grade(out_grade, labels) +
                        0.3 * criterion_defect(out_defect, defect_vecs))

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            train_loss += loss.item()
            preds    = out_grade.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total   += labels.size(0)

            pbar.set_postfix(loss=f"{loss.item():.3f}",
                             acc=f"{correct/total*100:.1f}%")

        pbar.close()
        train_acc = correct / total * 100

        # ── Validate ──────────────────────────────────────────
        model.eval()
        val_correct, val_total = 0, 0
        with torch.no_grad(), autocast("cuda", enabled=use_amp):
            for batch in tqdm(val_loader,
                              desc=f"Epoch {epoch+1:02d}/{EPOCHS} [val]  ",
                              ncols=90, leave=False):
                images = batch["image"].to(device, non_blocking=True)
                labels = batch["label"].to(device, non_blocking=True)
                out_grade, _ = model(images)
                preds = out_grade.argmax(dim=1)
                val_correct += (preds == labels).sum().item()
                val_total   += labels.size(0)

        val_acc    = val_correct / val_total * 100 if val_total > 0 else 0.0
        current_lr = scheduler.get_last_lr()[0]
        scheduler.step()

        flag = ""
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            state = (model._orig_mod.state_dict()
                     if hasattr(model, "_orig_mod") else model.state_dict())
            torch.save(state, "best_model.pt")
            flag = "  ✅ best"

        print(f"Epoch {epoch+1:02d}/{EPOCHS} | "
              f"loss {train_loss/n_train_batches:.3f} | "
              f"train {train_acc:.1f}% | "
              f"val {val_acc:.1f}% | "
              f"lr {current_lr:.1e} | "
              f"{time.time()-t0:.0f}s{flag}")

    # ── Export to ONNX ────────────────────────────────────────
    print("\n[Export] Converting to ONNX...")
    export_model = SecondLifeGrader().to(device)
    export_model.load_state_dict(
        torch.load("best_model.pt", map_location=device, weights_only=True)
    )
    export_model.eval()

    dummy = torch.randn(1, 3, 224, 224).to(device)
    torch.onnx.export(
        export_model, dummy, output_path,
        input_names=["image"],
        output_names=["grade_logits", "defect_logits"],
        dynamic_axes={"image": {0: "batch_size"}},
        opset_version=11
    )
    print(f"[Export] ✅ saved → {output_path}")
    print(f"[Export] best val acc: {best_val_acc:.1f}%")

    import onnxruntime as ort
    sess     = ort.InferenceSession(output_path)
    dummy_np = np.random.randn(1, 3, 224, 224).astype(np.float32)
    t0 = time.time()
    for _ in range(10):
        sess.run(None, {"image": dummy_np})
    print(f"[Speed]  {(time.time()-t0)/10*1000:.1f}ms per image (CPU ONNX)")


# ── ENTRY POINT ───────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--root-path", default="../data")
    parser.add_argument("--output",    default="mobilenet_kaputt.onnx")
    args = parser.parse_args()
    train(args.root_path, args.output)
