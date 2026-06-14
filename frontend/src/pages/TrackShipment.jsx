import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.jsx'
import { GradeChip } from '../components/TrustBadge.jsx'
import { fetchMarketplace } from '../utils/api.js'

const STATUS_BY_ROUTE = {
  'Resell As-Is': { label: 'Ready to list', step: 3, color: '#007600' },
  Refurbish: { label: 'In transit to SecondLife', step: 2, color: '#FF9900' },
  Donate: { label: 'Scheduled for donation', step: 2, color: '#007185' },
  Recycle: { label: 'Pickup scheduled', step: 2, color: '#CC0C39' },
}

function TrackingRow({ item }) {
  const status = STATUS_BY_ROUTE[item.route] || {
    label: 'Processing',
    step: 1,
    color: '#565959',
  }
  const trackingId = `SL-${String(item.id).padStart(6, '0')}`

  return (
    <div className="bg-white border border-[#DDD] p-4" style={{ borderRadius: '4px' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-bold text-[#0f1111]">{item.item_name}</p>
          <p className="text-xs text-[#565959]">
            Tracking ID: <span className="text-[#007185]">{trackingId}</span>
          </p>
        </div>
        <GradeChip grade={item.grade} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className="w-3 h-3 rounded-full border"
              style={{
                backgroundColor: step <= status.step ? status.color : '#fff',
                borderColor: step <= status.step ? status.color : '#888',
              }}
            />
            {step < 3 && (
              <div
                className="flex-1 h-0.5"
                style={{ backgroundColor: step < status.step ? status.color : '#DDD' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-wrap justify-between gap-2 text-xs">
        <span style={{ color: status.color }}>{status.label}</span>
        <span className="text-[#565959]">Route: {item.route}</span>
        <span className="text-[#565959]">
          {item.listed_at
            ? new Date(item.listed_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
              })
            : '—'}
        </span>
      </div>
    </div>
  )
}

export default function TrackShipment() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMarketplace()
      .then(setListings)
      .catch(() => {
        setListings([])
        setError('Could not load shipments. Start the backend on port 8000.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-[1500px] mx-auto px-4 pb-12">
      <Breadcrumb
        items={[
          { label: 'Amazon', to: '/marketplace' },
          { label: 'SecondLife', to: '/track' },
          { label: 'Track Shipment', current: true },
        ]}
      />

      <h1 className="text-2xl text-[#0f1111] mb-1" style={{ fontWeight: 400 }}>
        Track Shipment
      </h1>
      <p className="text-sm text-[#565959] mb-5">
        Monitor routed returns after AI grading — refurb center, resale, or recycle pickup.
      </p>

      {error && (
        <div
          className="mb-4 px-4 py-3 text-sm border"
          style={{ backgroundColor: '#FFF4F4', borderColor: '#CC0C39', color: '#CC0C39', borderRadius: '4px' }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="amazon-spinner" style={{ width: '28px', height: '28px' }} />
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white border border-[#DDD] text-center py-16" style={{ borderRadius: '4px' }}>
          <p className="text-sm text-[#565959] mb-2">No shipments to track yet.</p>
          <Link to="/" className="text-[#007185] text-sm hover:underline">
            Grade and route a return first
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((item) => (
            <TrackingRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  )
}
