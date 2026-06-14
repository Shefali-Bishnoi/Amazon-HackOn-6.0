import React from 'react'

const GRADE_COLORS = {
  'Like New': '#007600',
  'Minor Damage': '#FF9900',
  'Major Damage': '#CC0C39',
}

export function GradeChip({ grade }) {
  return (
    <span
      className="inline-block text-xs px-2 py-0.5 border"
      style={{
        color: GRADE_COLORS[grade] || '#565959',
        borderColor: GRADE_COLORS[grade] || '#888',
        borderRadius: '3px',
        backgroundColor: '#fff',
      }}
    >
      {grade}
    </span>
  )
}

export default function TrustBadge({ badge, score, size = 'md' }) {
  const label = badge?.replace(/^[^\w\s]+/, '').trim() || 'New Seller'

  if (size === 'sm') {
    return (
      <span
        className="inline-block text-xs px-2 py-0.5 border border-[#007185] text-[#007185]"
        style={{ borderRadius: '3px', backgroundColor: '#F0F2F2' }}
      >
        {label}
        {score != null && ` · ${Math.round(score)}`}
      </span>
    )
  }

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-2 border border-[#DDD] bg-white"
      style={{ borderRadius: '4px' }}
    >
      <span className="text-sm font-bold text-[#007185]">{label}</span>
      {score != null && (
        <span className="text-xs text-[#565959]">Trust Score: {Math.round(score)}</span>
      )}
    </div>
  )
}
