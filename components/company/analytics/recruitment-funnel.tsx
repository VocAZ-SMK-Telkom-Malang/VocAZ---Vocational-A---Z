// components/company/analytics/recruitment-funnel.tsx
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
import { Filter } from 'lucide-react'
import type { FunnelStage } from '@/lib/queries/company-analytics'

type Props = {
  data: FunnelStage[]
}

const BAR_COLORS = [
  '#b70011',
  '#4059aa',
  '#7c3aed',
  '#4f46e5',
  '#d97706',
  '#10b981',
]

export function RecruitmentFunnel({ data }: Props) {
  const total = data[0]?.count ?? 0

  if (total === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="h-72 flex flex-col items-center justify-center text-center gap-2">
          <Filter className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm font-bold text-on-surface">
            Belum ada data funnel
          </p>
          <p className="text-xs text-on-surface-variant">
            Data muncul setelah ada pelamar masuk
          </p>
        </div>
      </div>
    )
  }

  // Reverse untuk tampilan horizontal (stage teratas di atas)
  const chartData = [...data].reverse().map((stage, idx) => ({
    ...stage,
    color: BAR_COLORS[data.length - 1 - idx] ?? BAR_COLORS[0],
  }))

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            Recruitment Funnel
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Drop-off per stage recruitment
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">
            Total
          </div>
          <div className="font-display text-lg font-black text-on-surface">
            {total}
          </div>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e6bdb8"
              opacity={0.3}
              horizontal={false}
            />

            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#5c403c' }}
              tickLine={false}
              axisLine={{ stroke: '#e6bdb8', opacity: 0.4 }}
            />

            <YAxis
              type="category"
              dataKey="label"
              tick={{ fontSize: 11, fill: '#141b2b', fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={110}
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
              formatter={(value) => {
                const numericValue = Number(
                  Array.isArray(value) ? value[0] ?? 0 : value ?? 0,
                )
                const stage = chartData.find((d) => d.count === numericValue)

                return [
                  `${numericValue} pelamar (${stage?.percent ?? 0}%)`,
                  'Jumlah',
                ]
              }}
              cursor={{ fill: 'rgba(183,0,17,0.04)' }}
            />

            <Bar dataKey="count" radius={[0, 8, 8, 0]} name="Jumlah">
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-outline-variant/30">
        {data.map((stage, idx) => (
          <div key={stage.key} className="flex items-center gap-2 text-[11px]">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: BAR_COLORS[idx] }}
            />
            <span className="text-on-surface-variant truncate">
              {stage.label}
            </span>
            <span className="font-mono font-bold text-on-surface ml-auto">
              {stage.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}