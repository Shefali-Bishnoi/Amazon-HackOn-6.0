import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AmazonLayout from './components/AmazonLayout.jsx'
import GraderPage from './pages/GraderPage.jsx'
import Marketplace from './pages/Marketplace.jsx'
import MyReturns from './pages/MyReturns.jsx'
import SellerProfile from './pages/SellerProfile.jsx'
import TrackShipment from './pages/TrackShipment.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AmazonLayout />}>
          <Route index element={<GraderPage />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="returns" element={<MyReturns />} />
          <Route path="seller/:sellerId" element={<SellerProfile />} />
          <Route path="track" element={<TrackShipment />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
