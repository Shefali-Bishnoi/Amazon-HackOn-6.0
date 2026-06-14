import React, { useState, useCallback } from 'react'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ImageUploader from '../components/ImageUploader.jsx'
import ItemDetailsForm from '../components/ItemDetailsForm.jsx'
import GradeResultBox from '../components/GradeResultBox.jsx'
import { gradeItem } from '../utils/api.js'

const INITIAL_FORM = {
  itemName: '',
  asin: '',
  originalPrice: '',
  category: 'Electronics',
  sellerId: 'seller_001',
}

export default function GraderPage() {
  const [image, setImage] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = useCallback((img) => {
    setImage(img)
    setShowResults(false)
    setResult(null)
    setError('')
  }, [])

  const handleGrade = async () => {
    if (!image?.file || !formData.itemName.trim() || !formData.originalPrice) return

    setLoading(true)
    setShowResults(false)
    setResult(null)
    setError('')

    try {
      const data = await gradeItem(image.file, formData)
      setResult(data)
      setShowResults(true)
    } catch (err) {
      setError(err.message || 'Grading failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-[1500px] mx-auto px-4 pb-12">
      <Breadcrumb />

      <h1 className="text-2xl text-[#0f1111] mb-5" style={{ fontWeight: 400 }}>
        SecondLife Item Grader
      </h1>

      {error && (
        <div
          className="mb-4 px-4 py-3 text-sm border"
          style={{
            backgroundColor: '#FFF4F4',
            borderColor: '#CC0C39',
            color: '#CC0C39',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[60%]">
          <ImageUploader image={image} onImageChange={handleImageChange} />
          <ItemDetailsForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleGrade}
            loading={loading}
            hasImage={Boolean(image?.file)}
          />
        </div>

        <div className="w-full lg:w-[40%]">
          <GradeResultBox result={result} loading={loading} showResults={showResults} />
        </div>
      </div>
    </main>
  )
}
