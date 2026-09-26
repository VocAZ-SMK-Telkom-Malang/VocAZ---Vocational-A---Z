'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

type DataPoint = {
  date: string
  new: number
  total: number
}

type Props = {
  data: DataPoint[]
}

export function UserGrowthChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-on-surface-variant">
        Belum ada data user.
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e6bdb8',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#dc2626"
            strokeWidth={2}
            fill="url(#colorTotal)"
            name="Total User"
          />
          <Line
            type="monotone"
            dataKey="new"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            name="User Baru"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}