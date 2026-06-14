import React from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Clock, BarChart3 } from 'lucide-react'

const GRADE_META = {
  'Like New': {
    Icon: CheckCircle2,
    color: 'text-eco-green',
    bg: 'bg-eco-green/10',
    border: 'border-eco-green/30',
    bar: 'bg-eco-green',
    pct: 100,
  },
  'Minor Damage': {
    Icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    bar: 'bg-yellow-400',
    pct: 55,
  },
  'Major Damage': {
    Icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    bar: 'bg-red-400',
    pct: 20,
  },
}

export default function GradeResult({ gradeData }) {
  if (!gradeData) return null
  const meta = GRADE_META[gradeData.grade] || GRADE_META['Major Damage']
  const { Icon } = meta
  const confidence = Math.round(gradeData.confidence * 100)

  return (
    <div className={`card border ${meta.border} ${meta.bg} animate-fade-up`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${meta.bg} border ${meta.border} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${meta.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">AI Grade</p>
          <h3 className={`text-xl font-bold ${meta.color}`}>{gradeData.grade}</h3>
          {gradeData.damage_type !== 'None' && (
            <p className="text-sm text-gray-400 mt-0.5 capitalize">
              Damage type: <span className="text-gray-300">{gradeData.damage_type}</span>
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Confidence
          </div>
          <p className={`text-2xl font-bold font-mono ${meta.color}`}>{confidence}%</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-[#0F1923] rounded-full overflow-hidden">
          <div
            className={`h-full ${meta.bar} rounded-full transition-all duration-1000`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Inference time */}
      {gradeData.inference_time_ms && (
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-600 font-mono">
          <Clock className="w-3 h-3" />
          Inference: {gradeData.inference_time_ms}ms
        </div>
      )}
    </div>
  )
}
