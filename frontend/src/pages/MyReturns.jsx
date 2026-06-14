import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.jsx'
import { GradeChip } from '../components/TrustBadge.jsx'
import { fetchSeller } from '../utils/api.js'

const DEFAULT_SELLER = 'seller_001'

export default function MyReturns() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchSeller(DEFAULT_SELLER)
      .then(setProfile)
      .catch(() => {
        setProfile(null)
        setError('Could not load returns. Start the backend on port 8000.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-[1500px] mx-auto px-4 pb-12">
      <Breadcrumb
        items={[
          { label: 'Amazon', to: '/marketplace' },
          { label: 'Returns', to: '/returns' },
          { label: 'My Returns', current: true },
        ]}
      />

      <h1 className="text-2xl text-[#0f1111] mb-1" style={{ fontWeight: 400 }}>
        My Returns
      </h1>
      <p className="text-sm text-[#565959] mb-5">
        Returns processed through SecondLife AI grading for warehouse {DEFAULT_SELLER}.
      </p>

      {error && (
        <div
          className="mb-4 px-4 py-3 text-sm border"
          style={{ backgroundColor: '#FFF4F4', borderColor: '#CC0C39', color: '#CC0C39', borderRadius: '4px' }}
        >
          {error}
        </div>
      )}

      <div className="flex gap-3 mb-5">
        <Link to="/" className="amazon-btn-yellow text-sm px-4 py-2 no-underline inline-block">
          Grade New Return →
        </Link>
        <Link
          to={`/seller/${DEFAULT_SELLER}`}
          className="text-sm px-4 py-2 border border-[#888] bg-white text-[#0f1111] no-underline inline-block"
          style={{ borderRadius: '3px' }}
        >
          Seller Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="amazon-spinner" style={{ width: '28px', height: '28px' }} />
        </div>
      ) : !profile || profile.listing_history.length === 0 ? (
        <div className="bg-white border border-[#DDD] text-center py-16" style={{ borderRadius: '4px' }}>
          <p className="text-sm text-[#565959]">No returns graded yet.</p>
          <Link to="/" className="text-[#007185] text-sm hover:underline mt-2 inline-block">
            Upload a return photo to get started
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#DDD] overflow-hidden" style={{ borderRadius: '4px' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F0F2F2] text-left border-b border-[#DDD]">
                {['Return Item', 'Grade', 'Routing', 'Est. Value', 'Date', 'Track'].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs text-[#565959] font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profile.listing_history.map((row, index) => (
                <tr key={index} className="border-b border-[#DDD] last:border-b-0">
                  <td className="px-4 py-3 text-[#0f1111] font-medium">{row.item}</td>
                  <td className="px-4 py-3">
                    <GradeChip grade={row.grade} />
                  </td>
                  <td className="px-4 py-3 text-[#565959]">{row.route}</td>
                  <td className="px-4 py-3 text-[#0f1111]">
                    ₹{Number(row.price).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-[#565959] text-xs">
                    {row.date
                      ? new Date(row.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link to="/track" className="text-[#007185] text-xs hover:underline">
                      Track
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
