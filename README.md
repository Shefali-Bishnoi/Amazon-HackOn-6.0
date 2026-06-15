# SecondLife Commerce — AI-Powered Returns & Sustainable Resale

> **Amazon Hack On 2026** · *Every product deserves a meaningful second life.*

## 🚀 Live Demo

| | Link |
|--|------|
| **Frontend** | [secondlife-cadj94oow-shefali-bishnois-projects.vercel.app](https://secondlife-cadj94oow-shefali-bishnois-projects.vercel.app) |
| **Backend API** | [secondlife-backend-dzl6.onrender.com](https://secondlife-backend-dzl6.onrender.com) |
| **Swagger Docs** | [secondlife-backend-dzl6.onrender.com/docs](https://secondlife-backend-dzl6.onrender.com/docs) |


---

SecondLife Commerce is an intelligent returns ecosystem that transforms warehouse returns and unused products into a sustainable resale pipeline — using computer vision, smart routing, and tamper-proof condition certificates.

---

## The Problem

Millions of products bought online are returned, underused, or discarded despite being perfectly usable. Returns are expensive for customers, sellers, and the planet. Buyers also struggle to trust refurbished or second-hand products without verified condition data.

---

## What It Does

| Feature | Description |
|---------|-------------|
| 📸 **AI Condition Grading** | MobileNetV3 fine-tuned on the Kaputt damage dataset grades items by photo in ~50ms |
| 🔀 **Smart Routing** | Rule engine routes each item to: Resell / Refurbish / Donate / Recycle |
| 🩺 **Health Cards** | Tamper-proof AI-signed condition certificates with defect breakdown |
| 🏅 **TrustPass Scores** | Seller reputation built on grading accuracy over time |
| 📦 **Marketplace** | Buyer-facing feed of AI-graded second-hand listings |
| 🚚 **Shipment Tracking** | Real-time routing status for every processed return |

---

## Project Structure

```
SecondLife/
├── backend/
│   ├── app.py               ← FastAPI routes (grade, marketplace, seller, routing)
│   ├── grading.py           ← ONNX / MobileNetV3-Small inference
│   ├── routing.py           ← Smart routing engine
│   ├── health_card.py       ← Product Health Card generator
│   ├── trust_score.py       ← TrustPass seller score
│   ├── database.py          ← SQLite setup
│   └── requirements.txt
│
├── model/
│   ├── train.py             ← MobileNetV3 training script (run on Colab)
│   └── mobilenet_kaputt.onnx   ← Trained model (place here after training)
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── pages/
│       │   ├── GraderPage.jsx       ← Upload + Grade + Result
│       │   ├── Marketplace.jsx      ← AI-graded buyer feed
│       │   ├── MyReturns.jsx        ← Seller's return history
│       │   ├── SellerProfile.jsx    ← Trust score & routing breakdown
│       │   └── TrackShipment.jsx    ← Routing status tracker
│       ├── components/
│       │   ├── AmazonLayout.jsx     ← Shell with nav
│       │   ├── AmazonNav.jsx        ← Top header
│       │   ├── SecondaryNav.jsx     ← Category nav bar
│       │   ├── Breadcrumb.jsx
│       │   ├── ImageUploader.jsx
│       │   ├── ItemDetailsForm.jsx
│       │   ├── GradeResultBox.jsx   ← Condition report panel
│       │   ├── GradeResult.jsx      ← Grade badge + confidence bar
│       │   ├── HealthCard.jsx       ← AI condition certificate + PDF export
│       │   ├── StarRating.jsx
│       │   └── TrustBadge.jsx       ← Platinum / Gold / Silver / New
│       └── utils/
│           ├── api.js               ← fetch wrappers for all endpoints
│           └── mockGrading.js       ← Grade colours & tooltip constants
│
└── README.md
```

---

## Quick Start

### 1. Train the Model *(optional — skip for demo)*

Run on Google Colab with the [Kaputt dataset](https://github.com/antonsteenvoorden/kaputt):

```bash
!pip install torch torchvision pandas pyarrow onnx onnxruntime tqdm
!python model/train.py --root-path ./sample-data --output ./model/mobilenet_kaputt.onnx
```

Download `mobilenet_kaputt.onnx` and place it in `model/`.  
If the file is absent the backend **automatically falls back to heuristic grading** — no retraining needed for a demo.

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

- API: **http://localhost:8000**  
- Swagger docs: **http://localhost:8000/docs**

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173**

> The Vite dev server proxies `/api/*` to `localhost:8000` — no CORS config needed.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/grade` | Upload image → grade + routing decision + Health Card |
| `POST` | `/api/route/{listing_id}` | Confirm routing action for a listing |
| `GET`  | `/api/marketplace` | All listings with trust scores (last 20) |
| `GET`  | `/api/seller/{seller_id}` | Seller profile, history & Trust Score |
| `GET`  | `/api/health` | Backend + model status check |

### `POST /api/grade` — request body (multipart/form-data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | image | ✅ | Product photo (PNG / JPG / WEBP) |
| `item_name` | string | ✅ | Human-readable product name |
| `original_price` | float | ✅ | Purchase price in ₹ |
| `category` | string | | Electronics, Books, Clothing … |
| `asin` | string | | Amazon Standard Identification Number |
| `seller_id` | string | | Defaults to `seller_001` |

### Example response

```json
{
  "listing_id": 42,
  "itemName": "Sony WH-1000XM5",
  "grade": "Minor Damage",
  "stars": 3,
  "confidence": 91,
  "defects": ["Superficial"],
  "damage_type": "superficial",
  "routing": "Send to SecondLife Refurbishment Center",
  "recommendedAction": "Route to SecondLife",
  "estimatedResaleValue": 1874,
  "gradedBy": "SecondLife AI Grader v2.1",
  "timestamp": "14 Jun 2026, 03:45 PM",
  "inference_time_ms": 48.3,
  "health_card": { ... }
}
```

---

## Grading Model

**Architecture:** MobileNetV3-Small (fine-tuned)  
**Dataset:** [Kaputt](https://github.com/antonsteenvoorden/kaputt) — real-world product damage images  
**Inference:** ~50 ms on CPU via ONNX Runtime  

**Output heads:**

| Head | Output | Classes |
|------|--------|---------|
| `grade_logits` | Condition grade | Like New · Minor Damage · Major Damage |
| `defect_logits` | Defect types (multilabel) | actuation · deconstruction · deformation · missing_unit · penetration · spillage · superficial |

**Training setup:**

```
Epochs:      5
Batch size:  64
LR:          1e-4 (CosineAnnealingLR)
Loss:        CrossEntropy (grade) + 0.3 × BCEWithLogits (defects)
AMP:         enabled on CUDA
Export:      ONNX opset 11
```

---

## Routing Logic

| Condition | Price | Material | Route |
|-----------|-------|----------|-------|
| Like New | any | any | **Resell As-Is** (85% recovery) |
| Minor Damage | > ₹500 | any | **Refurbish** (74% recovery) |
| Minor Damage | < ₹200 | any | **Donate** |
| Major Damage | > ₹1000 | any | **Refurbish** |
| Major Damage | any | hard plastic | **Recycle** |
| Major Damage | any | other | **Donate** |

---

## TrustPass Score

```
Score = 60 + (accurate_listings / total_listings) × 40
```

| Score | Badge |
|-------|-------|
| ≥ 90 | ⭐ Platinum Seller |
| ≥ 75 | 🥇 Gold Seller |
| ≥ 60 | 🥈 Silver Seller |
| < 60 | 🥉 New Seller |

---

## Health Card

Every graded item receives a **tamper-proof Health Card** containing:

- Unique card ID (`HC-SELL-DDHHMM`)
- AI grade + confidence percentage
- Defect type breakdown
- Recommended action & estimated resale value
- Grader version + timestamp
- Seller ID

Health Cards are displayed in the UI and can be **exported as PDF** (via jsPDF, loaded from CDN).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| CV Model | MobileNetV3-Small (PyTorch → ONNX) |
| Inference | ONNX Runtime (CPU) |
| Backend | FastAPI + SQLite |
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | Rule engine (LightGBM-ready) |
| PDF Export | jsPDF (CDN) |

---

## Pages at a Glance

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Grade & Sell | Upload photo → grade → route → Health Card |
| `/marketplace` | Marketplace | Browse AI-graded second-hand listings |
| `/returns` | My Returns | View your graded return history |
| `/seller/:id` | Seller Dashboard | Trust score, routing & grade breakdown |
| `/track` | Track Shipment | Real-time routing status per listing |

---

## Deployment

| Layer | Platform | URL |
|-------|----------|-----|
| Frontend | Vercel | [secondlife-cadj94oow-shefali-bishnois-projects.vercel.app](https://secondlife-cadj94oow-shefali-bishnois-projects.vercel.app) |
| Backend | Render | [secondlife-backend-dzl6.onrender.com](https://secondlife-backend-dzl6.onrender.com) |

**How the connection works:** Vercel rewrites all `/api/*` requests to the Render backend via `vercel.json` — no CORS issues in production.

## Environment Notes

- Backend accepts requests from all origins (`allow_origins=["*"]`) — safe for hackathon use.
- SQLite database (`trustpass.db`) is created automatically on first startup.
- The jsPDF library is loaded from cdnjs in `index.html` for PDF Health Card export.
- For local development, the Vite dev server proxies `/api/*` to `http://localhost:8000`.

---

## Team

Built for **Amazon Hack On 2026** — SecondLife track

- Juhi Sahni
- Shefali Bishnoi

*"Every product deserves a meaningful second life."*
