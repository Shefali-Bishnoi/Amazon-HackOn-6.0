import React, { useState } from 'react'
import StarRating from './StarRating.jsx'
import HealthCard from './HealthCard.jsx'
import { GRADE_COLORS, GRADE_TOOLTIPS } from '../utils/mockGrading.js'
import { routeItem } from '../utils/api.js'

function ClipboardIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="1" stroke="#888" strokeWidth="1.5" />
      <rect x="8" y="1" width="8" height="4" rx="1" stroke="#888" strokeWidth="1.5" fill="#F0F2F2" />
      <path d="M9 10h6M9 14h6M9 18h4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="#007600" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function GradeBadge({ grade }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const color = GRADE_COLORS[grade] || '#565959'

  return (
    <div className="relative inline-block">
      <span
        className="text-xl font-bold cursor-help"
        style={{ color }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {grade}
      </span>
      {showTooltip && (
        <div
          className="absolute left-0 top-full mt-2 z-10 w-56 p-2 text-xs text-[#0f1111] bg-white border border-[#DDD] shadow-amazon-card"
          style={{ borderRadius: '4px' }}
        >
          {GRADE_TOOLTIPS[grade]}
        </div>
      )}
    </div>
  )
}

function RoutingBox({ result, onRouted }) {
  const { grade, estimatedResaleValue, originalPrice, actionButton, listing_id } = result
  const [routing, setRouting] = useState(false)
  const [routed, setRouted] = useState(false)

  const handleAction = async () => {
    if (!listing_id || routing) return
    setRouting(true)
    try {
      await routeItem(listing_id, actionButton || result.recommendedAction)
      setRouted(true)
      onRouted?.()
    } catch {
      alert('Routing failed. Please try again.')
    } finally {
      setRouting(false)
    }
  }

  if (grade === 'Like New') {
    return (
      <div
        className="p-4 bg-white mt-4"
        style={{ borderLeft: '4px solid #007600', borderRadius: '0 4px 4px 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
      >
        <p className="text-sm font-bold text-[#007600] mb-1">✓ Resell as New</p>
        <p className="text-sm text-[#565959] mb-3">
          Estimated price ₹{estimatedResaleValue.toLocaleString('en-IN')} (original ₹{originalPrice.toLocaleString('en-IN')})
        </p>
        <button type="button" className="amazon-btn-teal" onClick={handleAction} disabled={routing || routed}>
          {routed ? 'Listed on Amazon' : routing ? 'Routing…' : 'List on Amazon'}
        </button>
      </div>
    )
  }

  if (grade === 'Major Damage') {
    return (
      <div
        className="p-4 bg-white mt-4"
        style={{ borderLeft: '4px solid #CC0C39', borderRadius: '0 4px 4px 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
      >
        <p className="text-sm font-bold text-[#CC0C39] mb-1">♻ Recycle / Dispose</p>
        <p className="text-sm text-[#565959] mb-3">
          Item not eligible for resale. Schedule responsible disposal.
        </p>
        <button type="button" className="amazon-btn-teal" onClick={handleAction} disabled={routing || routed}>
          {routed ? 'Pickup Scheduled' : routing ? 'Scheduling…' : 'Schedule Pickup'}
        </button>
      </div>
    )
  }

  return (
    <div
      className="p-4 bg-white mt-4"
      style={{ borderLeft: '4px solid #FF9900', borderRadius: '0 4px 4px 0', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <p className="text-sm font-bold text-[#FF9900] mb-1">🔧 Send to Refurbishment</p>
      <p className="text-sm text-[#565959] mb-1">{result.routing}</p>
      <p className="text-sm text-[#565959] mb-3">
        Estimated value ₹{estimatedResaleValue.toLocaleString('en-IN')} (original ₹{originalPrice.toLocaleString('en-IN')})
      </p>
      <button type="button" className="amazon-btn-teal" onClick={handleAction} disabled={routing || routed}>
        {routed ? 'Routed to SecondLife' : routing ? 'Routing…' : 'Route to SecondLife'}
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-10 px-4">
      <div className="flex justify-center mb-4">
        <ClipboardIcon />
      </div>
      <p className="text-sm mb-4" style={{ color: '#565959' }}>
        Upload an image and grade this item
      </p>
      <ul className="text-left text-xs space-y-2 max-w-[260px] mx-auto" style={{ color: '#565959' }}>
        <li className="flex gap-2">
          <span>•</span>
          <span>Upload a clear photo of the returned item</span>
        </li>
        <li className="flex gap-2">
          <span>•</span>
          <span>AI analyzes condition and detects defects</span>
        </li>
        <li className="flex gap-2">
          <span>•</span>
          <span>Receive routing decision and Health Card</span>
        </li>
      </ul>
    </div>
  )
}

export default function GradeResultBox({ result, loading, showResults }) {
  return (
    <div
      className="bg-white border border-[#DDD] p-5 lg:sticky lg:top-4"
      style={{ borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
    >
      <h2 className="text-lg text-[#0f1111] mb-1 pb-3 border-b border-[#DDD]">
        AI Condition Report
      </h2>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="amazon-spinner" style={{ width: '28px', height: '28px' }} />
          <p className="text-sm text-[#565959]">Analyzing item condition…</p>
        </div>
      )}

      {!loading && !showResults && <EmptyState />}

      {!loading && showResults && result && (
        <div className="fade-in-results">
          {/* Condition Grade */}
          <div className="py-4">
            <p className="text-xs text-[#565959] uppercase tracking-wide mb-2">Condition Grade</p>
            <GradeBadge grade={result.grade} />
            <div className="mt-2">
              <StarRating count={5} filled={result.stars} />
            </div>
            <p className="text-xs text-[#565959] mt-2">
              AI Confidence: {result.confidence}%
              {result.inference_time_ms != null && (
                <span> · {result.inference_time_ms}ms inference</span>
              )}
            </p>
          </div>

          {/* Defects */}
          <div className="py-4 border-t border-[#DDD]">
            <p className="text-xs text-[#565959] uppercase tracking-wide mb-2">Defects Detected</p>
            {(result.defects || []).length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-[#007600]">
                <CheckIcon />
                No defects detected
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(result.defects || []).map((defect) => (
                  <span
                    key={defect}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-[#F0F2F2] border border-[#888] text-[#0f1111]"
                    style={{ borderRadius: '3px' }}
                  >
                    {defect}
                    <span className="text-[#565959] cursor-default">×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Routing */}
          <div className="py-4 border-t border-[#DDD]">
            <p className="text-xs text-[#565959] uppercase tracking-wide mb-1">Routing Decision</p>
            <RoutingBox result={result} />
          </div>

          <HealthCard result={result} />

          {/* Social proof */}
          <p className="text-[11px] text-[#565959] mt-5 pt-3 border-t border-[#DDD] leading-relaxed">
            🔒 Tamper-proof grading | ⚡ 2.4s avg grade time | 📦 3 grade tiers | 🔄 4 routing options
          </p>
        </div>
      )}
    </div>
  )
}
