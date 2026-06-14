import React from 'react'
import { Link } from 'react-router-dom'

function CartIcon() {
  return (
    <svg width="38" height="26" viewBox="0 0 38 26" fill="none" aria-hidden="true">
      <path
        d="M7 2h2l2.5 13h13l2.5-9H9"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="15" cy="20" r="1.5" fill="white" />
      <circle cx="24" cy="20" r="1.5" fill="white" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#333" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function AmazonNav() {
  return (
    <header style={{ backgroundColor: '#131921' }}>
      <div
        className="max-w-[1500px] mx-auto px-3 flex items-center gap-3"
        style={{ height: '60px' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-end gap-2 shrink-0 cursor-pointer no-underline">
          <div className="flex flex-col leading-none">
            <span
              className="text-white text-[22px] tracking-tight"
              style={{ fontWeight: 400, letterSpacing: '-0.5px' }}
            >
              amazon
            </span>
            <svg width="76" height="8" viewBox="0 0 76 8" className="-mt-0.5" aria-hidden="true">
              <path
                d="M2 4 C20 8, 56 8, 74 4"
                stroke="#FF9900"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M70 2 L74 4 L70 6" fill="#FF9900" />
            </svg>
          </div>
          <span
            className="text-[11px] uppercase mb-0.5 px-1.5 py-0.5"
            style={{ color: '#FF9900', borderLeft: '1px solid #555', fontWeight: 700 }}
          >
            secondlife
          </span>
        </Link>

        {/* Search bar */}
        <div className="hidden sm:flex flex-1 items-stretch max-w-3xl mx-2">
          <input
            type="text"
            placeholder="Search Amazon"
            readOnly
            className="flex-1 px-3 text-sm text-[#0f1111] outline-none"
            style={{ border: 'none', borderRadius: '4px 0 0 4px' }}
          />
          <button
            type="button"
            className="flex items-center justify-center px-4"
            style={{ backgroundColor: '#FF9900', borderRadius: '0 4px 4px 0', minWidth: '45px' }}
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-4 ml-auto text-white text-xs shrink-0">
          <div className="hidden md:block cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1">
            <span className="block text-[11px] text-[#ccc]">Returns</span>
            <span className="block text-sm font-bold">& Orders</span>
          </div>
          <div className="flex items-end gap-1 cursor-pointer hover:outline hover:outline-1 hover:outline-white p-1">
            <CartIcon />
            <span className="text-sm font-bold mb-0.5 hidden sm:inline">Cart</span>
          </div>
        </div>
      </div>
    </header>
  )
}
