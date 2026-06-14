export const MOCK_GRADE_RESULT = {
  grade: 'Minor Damage',
  stars: 3,
  confidence: 91,
  defects: ['Superficial', 'Scuff mark'],
  routing: 'Send to SecondLife Refurbishment Center',
  estimatedResaleValue: 1850,
  originalPrice: 2499,
  recommendedAction: 'Route to SecondLife',
  gradedBy: 'SecondLife AI Grader v2.1',
}

export const GRADE_TOOLTIPS = {
  'Like New': 'Item shows no visible wear. Eligible for resale as new condition.',
  'Minor Damage': 'Superficial wear or minor cosmetic issues. Route to refurbishment.',
  'Major Damage': 'Significant damage detected. Recycle or dispose responsibly.',
}

export const GRADE_COLORS = {
  'Like New': '#007600',
  'Minor Damage': '#FF9900',
  'Major Damage': '#CC0C39',
}

export function buildGradeResult(formData) {
  const originalPrice = parseFloat(formData.originalPrice) || MOCK_GRADE_RESULT.originalPrice

  return {
    ...MOCK_GRADE_RESULT,
    itemName: formData.itemName || 'Untitled Item',
    asin: formData.asin || '—',
    category: formData.category || 'Other',
    sellerId: formData.sellerId || 'seller_001',
    originalPrice,
    estimatedResaleValue: MOCK_GRADE_RESULT.estimatedResaleValue,
    timestamp: new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  }
}
