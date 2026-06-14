import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb.jsx'
import TrustBadge, { GradeChip } from '../components/TrustBadge.jsx'
import { fetchMarketplace } from '../utils/api.js'

const ROUTE_LABELS = {
  'Resell As-Is': 'Resell as New',
  Refurbish: 'SecondLife Refurb',
  Donate: 'Donate',
  Recycle: 'Recycle',
}

function ListingCard({ item }) {
  return (
    <div
      className="bg-white border border-[#DDD] p-4 hover:border-[#007185] transition-colors"
      style={{ borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#0f1111] truncate">{item.item_name}</h3>
          <Link
            to={`/seller/${item.seller_id}`}
            className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline"
          >
            Seller: {item.seller_id}
          </Link>
        </div>
        <p className="text-lg text-[#0f1111] shrink-0">
          ₹{Number(item.price).toLocaleString('en-IN')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <GradeChip grade={item.grade} />
        <span className="text-xs text-[#565959] border border-[#888] px-2 py-0.5" style={{ borderRadius: '3px' }}>
          {ROUTE_LABELS[item.route] || item.route}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#DDD]">
        <TrustBadge badge={item.trust_badge} score={item.trust_score} size="sm" />
        <span className="text-[11px] text-[#565959]">
          {item.listed_at
            ? new Date(item.listed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            : '—'}
        </span>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const loadListings = async () => {
    setLoading(true)
    setError('')
    try {
      setListings(await fetchMarketplace())
    } catch {
      setListings([])
      setError('Could not load listings. Start the backend on port 8000, then grade an item.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [])

  const filtered = listings
    .filter((item) => filter === 'all' || item.grade === filter)
    .filter(
      (item) =>
        search === '' ||
        item.item_name.toLowerCase().includes(search.toLowerCase()) ||
        item.seller_id.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <main className="max-w-[1500px] mx-auto px-4 pb-12">
      <Breadcrumb
        items={[
          { label: 'Amazon', to: '/marketplace' },
          { label: 'SecondLife', to: '/marketplace' },
          { label: 'Marketplace', current: true },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl text-[#0f1111]" style={{ fontWeight: 400 }}>
            SecondLife Marketplace
          </h1>
          <p className="text-sm text-[#565959] mt-1">
            AI-graded listings from warehouse returns. Every item verified with a Health Card.
          </p>
        </div>
        <Link to="/" className="amazon-btn-yellow text-sm px-4 py-2 inline-block text-center no-underline">
          Grade a New Item →
        </Link>
      </div>

      {error && (
        <div
          className="mb-4 px-4 py-3 text-sm border"
          style={{ backgroundColor: '#FFF4F4', borderColor: '#CC0C39', color: '#CC0C39', borderRadius: '4px' }}
        >
          {error}
        </div>
      )}

      <div className="bg-white border border-[#DDD] p-4 mb-5 flex flex-wrap gap-3 items-center" style={{ borderRadius: '4px' }}>
        <input
          type="text"
          placeholder="Search items or sellers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="amazon-input flex-1 min-w-[200px]"
        />
        <div className="flex flex-wrap gap-2">
          {['all', 'Like New', 'Minor Damage', 'Major Damage'].map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setFilter(grade)}
              className="text-xs px-3 py-1.5 border"
              style={{
                borderRadius: '3px',
                borderColor: filter === grade ? '#FF9900' : '#888',
                backgroundColor: filter === grade ? '#FF9900' : '#fff',
                color: filter === grade ? '#111' : '#0f1111',
              }}
            >
              {grade === 'all' ? 'All' : grade}
            </button>
          ))}
        </div>
        <button type="button" onClick={loadListings} className="amazon-btn-teal" style={{ width: 'auto' }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="amazon-spinner" style={{ width: '28px', height: '28px' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="bg-white border border-[#DDD] text-center py-16 px-4"
          style={{ borderRadius: '4px' }}
        >
          <p className="text-sm text-[#565959] mb-2">No listings yet</p>
          <p className="text-xs text-[#565959] mb-4">
            Grade a returned item on the Grade & Sell page to create the first listing.
          </p>
          <Link to="/" className="text-[#007185] hover:underline text-sm">
            Go to Grade & Sell
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  )
}
