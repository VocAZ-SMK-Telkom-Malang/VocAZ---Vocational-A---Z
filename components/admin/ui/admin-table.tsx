type Column<T> = {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

type AdminTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Tidak ada data.',
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
        <p className="text-on-surface-variant text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-on-surface ${col.className || ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}