// components/company/analytics/application-trend-chart.tsx
'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { TrendPoint } from '@/lib/queries/company-analytics'

type Props = {
  data: TrendPoint[]
  period: string
}

export function ApplicationTrendChart({ data, period }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="h-72 flex flex-col items-center justify-center text-center gap-2">
          <TrendingUp className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm font-bold text-on-surface">
            Belum ada data trend
          </p>
          <p className="text-xs text-on-surface-variant">
            Posting lowongan untuk melihat trend pelamar
          </p>
        </div>
      </div>
    )
  }

  const totalApps = data.reduce((s, d) => s + d.applications, 0)
  const totalHires = data.reduce((s, d) => s + d.hires, 0)

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Application Trend
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            {period} · {totalApps} lamaran, {totalHires} diterima
          </p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="appColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b70011" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#b70011" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="hireColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e6bdb8"
              opacity={0.3}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#5c403c' }}
              tickLine={false}
              axisLine={{ stroke: '#e6bdb8', opacity: 0.4 }}
              interval="preserveStartEnd"
              minTickGap={24}
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
              cursor={{ stroke: '#b70011', strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            <Area
              type="monotone"
              dataKey="applications"
              stroke="#b70011"
              strokeWidth={2}
              fill="url(#appColor)"
              name="Lamaran"
              dot={{ r: 2, fill: '#b70011' }}
              activeDot={{ r: 5 }}
            />

            <Area
              type="monotone"
              dataKey="hires"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#hireColor)"
              name="Diterima"
              dot={{ r: 2, fill: '#10b981' }}
              activeDot={{ r: 5 }}
            />

            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              iconType="circle"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}