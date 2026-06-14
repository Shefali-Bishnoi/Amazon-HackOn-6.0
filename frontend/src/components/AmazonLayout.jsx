import React from 'react'
import { Outlet } from 'react-router-dom'
import AmazonNav from './AmazonNav.jsx'
import SecondaryNav from './SecondaryNav.jsx'

export default function AmazonLayout() {
  return (
    <div className="min-h-screen font-amazon" style={{ backgroundColor: '#F0F2F2' }}>
      <AmazonNav />
      <SecondaryNav />
      <Outlet />
    </div>
  )
}
