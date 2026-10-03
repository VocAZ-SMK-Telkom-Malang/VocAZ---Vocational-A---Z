// components/company/analytics/top-skills-chart.tsx
'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { Zap } from 'lucide-react'
import type { SkillDemand } from '@/lib/queries/company-analytics'

type Props = {
  data: SkillDemand[]
}

export function TopSkillsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="h-72 flex flex-col items-center justify-center text-center gap-2">
          <Zap className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm font-bold text-on-surface">
            Belum ada data skill
          </p>
          <p className="text-xs text-on-surface-variant">
            Posting job dengan skill untuk melihat demand
          </p>
        </div>
      </div>
    )
  }

  const COLORS = [
    '#b70011',
    '#dc2626',
    '#ad5d00',
    '#d97706',
    '#4059aa',
    '#7c3aed',
    '#0891b2',
    '#10b981',
  ]

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Zap className="w-4 h-4 text-tertiary" />
          Top Skills Demand
        </h3>
        <p className="text-[11px] text-on-surface-variant mt-0.5">
          Skill paling sering diminta di lowongan kamu
        </p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e6bdb8"
              opacity={0.3}
              vertical={false}
            />

            <XAxis
              dataKey="skillName"
              tick={{ fontSize: 10, fill: '#141b2b', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#e6bdb8', opacity: 0.4 }}
              angle={-35}
              textAnchor="end"
              height={60}
              interval={0}
            />

            <YAxis
              tick={{ fontSize: 10, fill: '#5c403c' }}
              tickLine={false}
              axisLine={false}
              width={30}
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
              formatter={(value, name, props) => {
                const numericValue = Array.isArray(value)
                  ? Number(value[0] ?? 0)
                  : Number(value ?? 0)

                if (name === 'jobCount') {
                  return [
                    `${numericValue}× diposting · ${props.payload.applicantCount} pelamar`,
                    'Demand',
                  ] as [string, string]
                }

                return [value ?? 0, name] as [number | string, string | number]
              }}
              cursor={{ fill: 'rgba(183,0,17,0.04)' }}
            />

            <Bar dataKey="jobCount" radius={[8, 8, 0, 0]} name="Demand">
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}