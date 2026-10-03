// components/company/analytics/skill-coverage-radar.tsx
'use client'

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts'
import { Award } from 'lucide-react'

type Props = {
  data: {
    category: string
    value: number
    fullMark: number
  }[]
}

export function SkillCoverageRadar({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="h-72 flex flex-col items-center justify-center text-center gap-2">
          <Award className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm font-bold text-on-surface">
            Belum ada data kategori skill
          </p>
          <p className="text-xs text-on-surface-variant">
            Posting job dengan skill untuk melihat coverage
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Skill Coverage
        </h3>
        <p className="text-[11px] text-on-surface-variant mt-0.5">
          Distribusi kategori skill di lowongan kamu
        </p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="#e6bdb8" opacity={0.4} />

            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#141b2b', fontWeight: 600 }}
            />

            <PolarRadiusAxis
              angle={90}
              tick={{ fontSize: 9, fill: '#5c403c' }}
              stroke="#e6bdb8"
              opacity={0.4}
            />

            <Radar
              name="Job"
              dataKey="value"
              stroke="#b70011"
              strokeWidth={2}
              fill="#b70011"
              fillOpacity={0.25}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e6bdb8',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 16px rgba(183,0,17,0.10)',
              }}
              labelStyle={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#141b2b',
                marginBottom: '4px',
              }}
              formatter={(value) => [
                `${Number(value ?? 0)} lowongan`,
                'Demand',
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}