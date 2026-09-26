import { prisma } from '@/lib/prisma'

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSetting.findMany({
    orderBy: { key: 'asc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Key</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Value</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">Description</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.id} className="border-b border-gray-100">
                <td className="px-4 py-3 text-sm font-mono">{s.key}</td>
                <td className="px-4 py-3 text-sm">{JSON.stringify(s.value)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}