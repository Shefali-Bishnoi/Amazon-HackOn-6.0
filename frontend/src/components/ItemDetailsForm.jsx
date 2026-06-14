import React from 'react'

const CATEGORIES = [
  'Electronics',
  'Clothing & Apparel',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Toys',
  'Other',
]

export default function ItemDetailsForm({ formData, onChange, onSubmit, loading, hasImage }) {
  const update = (field) => (e) => onChange({ ...formData, [field]: e.target.value })

  const canSubmit = formData.itemName.trim() && formData.originalPrice && hasImage

  return (
    <div className="mt-6 bg-white border border-[#DDD] p-5" style={{ borderRadius: '4px' }}>
      <h2 className="text-lg text-[#0f1111] mb-4 pb-3 border-b border-[#DDD]">Item Details</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm text-[#0f1111] mb-1">
            Item Name <span className="text-[#CC0C39]">*</span>
          </label>
          <input
            id="itemName"
            type="text"
            className="amazon-input"
            placeholder="e.g. Sony WH-1000XM5 Headphones"
            value={formData.itemName}
            onChange={update('itemName')}
          />
        </div>

        <div>
          <label htmlFor="asin" className="block text-sm text-[#0f1111] mb-1 flex items-center gap-1">
            ASIN (optional)
            <span
              title="Amazon Standard Identification Number — found on the product detail page"
              className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#007185] text-[#007185] text-[10px] cursor-help"
            >
              i
            </span>
          </label>
          <input
            id="asin"
            type="text"
            className="amazon-input"
            placeholder="e.g. B09XS7JWHH"
            value={formData.asin}
            onChange={update('asin')}
          />
        </div>

        <div>
          <label htmlFor="originalPrice" className="block text-sm text-[#0f1111] mb-1">
            Original Purchase Price (₹) <span className="text-[#CC0C39]">*</span>
          </label>
          <input
            id="originalPrice"
            type="number"
            min="0"
            className="amazon-input"
            placeholder="e.g. 2499"
            value={formData.originalPrice}
            onChange={update('originalPrice')}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm text-[#0f1111] mb-1">
            Category
          </label>
          <select
            id="category"
            className="amazon-input cursor-pointer"
            value={formData.category}
            onChange={update('category')}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sellerId" className="block text-sm text-[#0f1111] mb-1">
            Seller ID
          </label>
          <input
            id="sellerId"
            type="text"
            className="amazon-input"
            value={formData.sellerId}
            disabled
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          className="amazon-btn-yellow w-full py-2.5 text-sm flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <span className="amazon-spinner" />
              Grading item…
            </>
          ) : (
            <>Grade This Item →</>
          )}
        </button>
      </div>
    </div>
  )
}
