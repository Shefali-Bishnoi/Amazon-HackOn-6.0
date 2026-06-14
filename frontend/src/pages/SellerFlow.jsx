import React, { useState, useRef, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Upload, Image as ImageIcon, Loader2, Recycle,
  ChevronDown, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react'
import GradeResult from '../components/GradeResult.jsx'
import HealthCard from '../components/HealthCard.jsx'

const MATERIALS = [
  { value: 'other',             label: 'Other / Unknown' },
  { value: 'plastic_hard',      label: 'Hard Plastic' },
  { value: 'plastic_tight_wrap',label: 'Soft Plastic / Wrap' },
  { value: 'metal',             label: 'Metal / Alloy' },
  { value: 'fabric',            label: 'Fabric / Textile' },
  { value: 'glass',             label: 'Glass' },
  { value: 'electronics',       label: 'Electronics' },
  { value: 'wood',              label: 'Wood / MDF' },
]

function DropZone({ onFile, preview }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFile(file)
    else toast.error('Please upload an image file')
  }, [onFile])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group
        ${dragging ? 'border-amazon-orange bg-amazon-orange/5 scale-[1.01]' : 'border-[#263545] hover:border-amazon-teal hover:bg-amazon-teal/5'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 mx-auto rounded-xl object-contain shadow-2xl"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
            <p className="text-white font-medium flex items-center gap-2">
              <Upload className="w-5 h-5" /> Change Image
            </p>
          </div>
        </div>
      ) : (
        <div className="py-6">
          <div className="w-16 h-16 bg-[#1A2633] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#263545] group-hover:border-amazon-teal transition-colors">
            <ImageIcon className="w-8 h-8 text-gray-500 group-hover:text-amazon-teal transition-colors" />
          </div>
          <p className="text-gray-300 font-medium mb-1">Drop product image here</p>
          <p className="text-gray-600 text-sm">PNG, JPG, WEBP — up to 10MB</p>
        </div>
      )}
    </div>
  )
}

export default function SellerFlow() {
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [itemName, setItemName]   = useState('')
  const [price, setPrice]         = useState('')
  const [material, setMaterial]   = useState('other')
  const [sellerId, setSellerId]   = useState('seller_001')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)

  const handleFile = (f) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
  }

  const handleSubmit = async () => {
    if (!file || !itemName || !price) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('item_name', itemName)
      fd.append('original_price', parseFloat(price))
      fd.append('material', material)
      fd.append('seller_id', sellerId)

      const { data } = await axios.post('/api/grade', fd)
      setResult(data)
      toast.success('Item graded successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Grading failed — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero strip */}
      <div className="bg-gradient-to-r from-amazon-dark via-amazon-mid to-amazon-dark border-b border-[#263545]">
        <div className="max-w-7xl mx-auto px-4 py-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amazon-orange" />
              <span className="text-amazon-orange text-sm font-mono uppercase tracking-widest">
                AI Grading Engine
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Give your product a <span className="text-amazon-orange">Second Life</span>
            </h1>
            <p className="text-gray-400 max-w-xl">
              Upload a photo — our MobileNetV3 model grades it instantly, routes it to the
              best channel, and generates a tamper-proof Health Card.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-center">
            {[
              { val: '2.4s', label: 'Avg. grade time' },
              { val: '3',    label: 'Grade tiers'     },
              { val: '4',    label: 'Route options'   },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-amazon-orange font-mono">{val}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── LEFT: Form ── */}
        <div className="space-y-6">
          <DropZone onFile={handleFile} preview={preview} />

          <div className="card space-y-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Recycle className="w-4 h-4 text-amazon-teal" />
              Item Details
            </h2>

            {/* Item name */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Noise Cancelling Headphones"
                className="w-full bg-[#0F1923] border border-[#263545] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amazon-teal focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Original Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 2499"
                className="w-full bg-[#0F1923] border border-[#263545] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amazon-teal focus:outline-none transition-colors text-sm"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Material
              </label>
              <div className="relative">
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-[#0F1923] border border-[#263545] rounded-xl px-4 py-3 text-white focus:border-amazon-teal focus:outline-none transition-colors text-sm appearance-none cursor-pointer"
                >
                  {MATERIALS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Seller ID */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Seller ID
              </label>
              <input
                type="text"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-full bg-[#0F1923] border border-[#263545] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-amazon-teal focus:outline-none transition-colors text-sm font-mono"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !file || !itemName || !price}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Grading with AI...
                </>
              ) : (
                <>
                  Grade This Item
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* How it works */}
          <div className="card">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">How it works</p>
            <ol className="space-y-2">
              {[
                'Upload a clear product photo',
                'AI grades condition (Like New / Minor / Major)',
                'Smart router picks best channel',
                'Health Card generated instantly',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <span className="w-5 h-5 rounded-full bg-amazon-orange/20 text-amazon-orange text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="space-y-6">
          {!result && (
            <div className="card border-dashed border-[#263545] flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-[#0F1923] rounded-2xl flex items-center justify-center mb-4 border border-[#263545]">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium mb-1">Results will appear here</p>
              <p className="text-gray-700 text-sm">Upload an image and submit to grade</p>
            </div>
          )}

          {result && (
            <>
              <GradeResult gradeData={result.grade} />
              <HealthCard
                card={result.health_card}
                routing={result.routing}
                grade={result.grade}
              />
              {result.listing_id && (
                <div className="text-center text-xs text-gray-600 font-mono">
                  Listing ID #{result.listing_id} saved to database
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
