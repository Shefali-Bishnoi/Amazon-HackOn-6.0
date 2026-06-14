import React from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { label: 'All', path: '/marketplace', end: false },
  { label: 'Grade & Sell', path: '/', end: true },
  { label: 'Marketplace', path: '/marketplace', end: false },
  { label: 'My Returns', path: '/returns', end: true },
  { label: 'Seller Dashboard', path: '/seller/seller_001', end: true },
  { label: 'Track Shipment', path: '/track', end: true },
]

export default function SecondaryNav() {
  return (
    <nav style={{ backgroundColor: '#232F3E' }} className="text-white text-sm">
      <div className="max-w-[1500px] mx-auto px-3 flex items-center gap-0 overflow-x-auto">
        {LINKS.map((link) => (
          <NavLink
            key={link.path + link.label}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-2 hover:outline hover:outline-1 hover:outline-white ${
                isActive ? 'font-bold' : 'font-normal'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? '#FF9900' : '#fff',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
