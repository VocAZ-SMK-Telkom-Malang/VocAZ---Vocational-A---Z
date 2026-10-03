// components/company/analytics/demographics-charts.tsx
'use client'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { Users } from 'lucide-react'

type DemographicItem = {
  label: string
  value: number
  color: string
}

type Props = {
  gender: DemographicItem[]
  city: DemographicItem[]
}

export function DemographicsCharts({ gender, city }: Props) {
  const totalGender = gender.reduce((s, g) => s + g.value, 0)
  const totalCity = city.reduce((s, c) => s + c.value, 0)

  if (totalGender === 0 && totalCity === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="h-72 flex flex-col items-center justify-center text-center gap-2">
          <Users className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm font-bold text-on-surface">
            Belum ada data demografi
          </p>
          <p className="text-xs text-on-surface-variant">
            Data muncul setelah ada pelamar
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Pie Chart */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Gender Pelamar
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Distribusi gender · {totalGender} pelamar
          </p>
        </div>

        {totalGender === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-on-surface-variant">
            Tidak ada data
          </div>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gender}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {gender.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e6bdb8',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 16px rgba(183,0,17,0.10)',
                  }}
                  formatter={(value) => {
                    const numericValue = Array.isArray(value)
                      ? Number(value[0] ?? 0)
                      : Number(value ?? 0)
                    const percent = Math.round((numericValue / totalGender) * 100)
                    return [`${numericValue} (${percent}%)`, 'Pelamar']
                  }}
                />

                <Legend
                  wrapperStyle={{ fontSize: '11px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* City Pie Chart */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <Users className="w-4 h-4 text-tertiary" />
            Lokasi Pelamar
          </h3>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Distribusi kota · {totalCity} pelamar
          </p>
        </div>

        {totalCity === 0 ? (
          <div className="h-56 flex items-center justify-center text-xs text-on-surface-variant">
            Tidak ada data
          </div>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={city}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {city.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e6bdb8',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 16px rgba(183,0,17,0.10)',
                  }}
                  formatter={(value) => {
                    const numericValue = Array.isArray(value)
                      ? Number(value[0] ?? 0)
                      : Number(value ?? 0)
                    const percent = Math.round((numericValue / totalCity) * 100)
                    return [`${numericValue} (${percent}%)`, 'Pelamar']
                  }}
                />

                <Legend
                  wrapperStyle={{ fontSize: '11px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}