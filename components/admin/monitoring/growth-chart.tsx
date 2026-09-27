'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

type DataPoint = {
  date: string
  users: number
  jobs: number
  applications: number
}

type Props = {
  data: DataPoint[]
}

const RANGES = [
  { label: '7 hari', days: 7 },
  { label: '30 hari', days: 30 },
  { label: '90 hari', days: 90 },
]

export function GrowthChart({ data }: Props) {
  const [range, setRange] = useState(30)

  // Filter data berdasarkan range
  const filteredData = data.slice(-range)

  return (
    <div>
      {/* Range tabs */}
      <div className="flex items-center gap-1 mb-4 bg-surface-container-low rounded-full p-1 w-fit">
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => setRange(r.days)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              range === r.days
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        {filteredData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-on-surface-variant">
            Belum ada data untuk range ini.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#5c403c' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#5c403c' }}
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e6bdb8',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="User Baru"
              />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="Lowongan Baru"
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Lamaran"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}