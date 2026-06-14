import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.jsx'
import TrustBadge, { GradeChip } from '../components/TrustBadge.jsx'
import { fetchSeller } from '../utils/api.js'

const GRADE_COLORS = {
  'Like New': '#007600',
  'Minor Damage': '#FF9900',
  'Major Damage': '#CC0C39',
}

export default function SellerProfile() {
  const { sellerId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchSeller(sellerId)
      .then(setProfile)
      .catch(() => {
        setProfile(null)
        setError('Could not load seller dashboard. Start the backend on port 8000.')
      })
      .finally(() => setLoading(false))
  }, [sellerId])

  const routeCounts = (profile?.listing_history || []).reduce((acc, row) => {
    acc[row.route] = (acc[row.route] || 0) + 1
    return acc
  }, {})

  const gradeCounts = (profile?.listing_history || []).reduce((acc, row) => {
    acc[row.grade] = (acc[row.grade] || 0) + 1
    return acc
  }, {})

  return (
    <main className="max-w-[1500px] mx-auto px-4 pb-12">
      <Breadcrumb
        items={[
          { label: 'Amazon', to: '/marketplace' },
          { label: 'Seller Tools', to: '/' },
          { label: 'Seller Dashboard', current: true },
        ]}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="amazon-spinner" style={{ width: '28px', height: '28px' }} />
        </div>
      ) : error || !profile ? (
        <div className="bg-white border border-[#DDD] text-center py-16" style={{ borderRadius: '4px' }}>
          <p className="text-sm text-[#565959]">{error || 'Seller not found.'}</p>
          <Link to="/" className="text-[#007185] text-sm hover:underline mt-2 inline-block">
            Back to Grade & Sell
          </Link>
        </div>
      ) : (
        <>
          <div
            className="bg-white border border-[#DDD] p-5 mb-5 flex flex-col md:flex-row md:items-center gap-5"
            style={{ borderRadius: '4px' }}
          >
            <div className="flex-1">
              <h1 className="text-2xl text-[#0f1111] mb-2" style={{ fontWeight: 400 }}>
                {profile.seller_id}
              </h1>
              <TrustBadge badge={profile.trust_badge} score={profile.trust_score} />
              <p className="text-sm text-[#565959] mt-3">
                {profile.total_listings} items graded through SecondLife
              </p>
            </div>
            <div
              className="text-center px-6 py-4 border border-[#DDD]"
              style={{ borderRadius: '4px', backgroundColor: '#F0F2F2' }}
            >
              <p className="text-3xl font-bold text-[#007185]">{Math.round(profile.trust_score)}</p>
              <p className="text-xs text-[#565959] uppercase tracking-wide">Trust Score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="bg-white border border-[#DDD] p-5" style={{ borderRadius: '4px' }}>
              <h2 className="text-sm font-bold text-[#0f1111] mb-4 pb-2 border-b border-[#DDD]">
                Routing Breakdown
              </h2>
              {Object.keys(routeCounts).length === 0 ? (
                <p className="text-sm text-[#565959]">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(routeCounts).map(([route, count]) => {
                    const pct = Math.round((count / profile.total_listings) * 100)
                    return (
                      <div key={route}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#0f1111]">{route}</span>
                          <span className="text-[#565959]">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-[#F0F2F2] border border-[#DDD]" style={{ borderRadius: '2px' }}>
                          <div
                            className="h-full bg-[#007185]"
                            style={{ width: `${pct}%`, borderRadius: '1px' }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#DDD] p-5" style={{ borderRadius: '4px' }}>
              <h2 className="text-sm font-bold text-[#0f1111] mb-4 pb-2 border-b border-[#DDD]">
                Grade Distribution
              </h2>
              {Object.keys(gradeCounts).length === 0 ? (
                <p className="text-sm text-[#565959]">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(gradeCounts).map(([grade, count]) => {
                    const pct = Math.round((count / profile.total_listings) * 100)
                    return (
                      <div key={grade}>
                        <div className="flex justify-between text-xs mb-1">
                          <GradeChip grade={grade} />
                          <span className="text-[#565959]">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 bg-[#F0F2F2] border border-[#DDD]" style={{ borderRadius: '2px' }}>
                          <div
                            className="h-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: GRADE_COLORS[grade] || '#888',
                              borderRadius: '1px',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-[#DDD] overflow-hidden" style={{ borderRadius: '4px' }}>
            <div className="px-5 py-3 border-b border-[#DDD] flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0f1111]">Listing History</h2>
              <Link to="/returns" className="text-xs text-[#007185] hover:underline">
                View as Returns →
              </Link>
            </div>
            {profile.listing_history.length === 0 ? (
              <p className="text-sm text-[#565959] text-center py-10">No listings yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F0F2F2] text-left">
                    {['Item', 'Grade', 'Route', 'Price', 'Date'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs text-[#565959] font-normal border-b border-[#DDD]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profile.listing_history.map((row, index) => (
                    <tr key={index} className="border-b border-[#DDD] last:border-b-0">
                      <td className="px-4 py-3 text-[#0f1111]">{row.item}</td>
                      <td className="px-4 py-3">
                        <GradeChip grade={row.grade} />
                      </td>
                      <td className="px-4 py-3 text-[#565959]">{row.route}</td>
                      <td className="px-4 py-3 text-[#0f1111]">
                        ₹{Number(row.price).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-[#565959] text-xs">
                        {row.date ? new Date(row.date).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </main>
  )
}
