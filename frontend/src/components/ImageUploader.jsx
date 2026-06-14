import React, { useRef, useState, useCallback } from 'react'

function UploadIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" stroke="#888" strokeWidth="1.5" />
      <circle cx="8.5" cy="10" r="1.5" fill="#888" />
      <path d="M3 16l5-4 4 3 3-2 6 5" stroke="#888" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImageUploader({ image, onImageChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return
      onImageChange({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      })
    },
    [onImageChange]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      handleFile(e.dataTransfer.files[0])
    },
    [handleFile]
  )

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="relative flex items-center justify-center cursor-pointer bg-white"
        style={{
          height: '400px',
          border: `1px ${dragging ? 'solid' : 'dashed'} ${dragging ? '#007185' : '#DDD'}`,
          borderRadius: '4px',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {image?.preview ? (
          <img
            src={image.preview}
            alt="Product preview"
            className="max-w-full max-h-full object-contain p-4"
          />
        ) : (
          <div className="text-center px-4">
            <div className="flex justify-center mb-3">
              <UploadIcon />
            </div>
            <p className="text-sm text-[#0f1111] mb-1">Drop product image here</p>
            <p className="text-xs text-[#565959]">or click to upload · PNG, JPG, WEBP</p>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {image?.preview && (
        <div className="flex gap-2 mt-3">
          <div
            className="border border-[#007185] p-1 bg-white"
            style={{ borderRadius: '4px', boxShadow: '0 0 0 2px #007185 inset' }}
          >
            <img
              src={image.preview}
              alt="Thumbnail"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
      )}

      {image?.name && (
        <p className="text-xs text-[#565959] mt-2">
          {image.name} · {formatFileSize(image.size)}
        </p>
      )}
    </div>
  )
}
