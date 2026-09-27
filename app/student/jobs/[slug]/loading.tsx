// app/student/jobs/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-5 w-48 bg-surface-container rounded animate-pulse" />

      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden">
        <div className="h-20 bg-surface-container animate-pulse" />
        <div className="p-6 sm:p-8">
          <div className="w-20 h-20 rounded-2xl bg-surface-container -mt-10 mb-4 animate-pulse" />
          <div className="h-8 w-2/3 bg-surface-container rounded animate-pulse mb-2" />
          <div className="h-4 w-1/3 bg-surface-container rounded animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-surface-container rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-12 w-40 bg-surface-container rounded-full animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-surface-container rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div>
          <div className="h-64 bg-surface-container rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}