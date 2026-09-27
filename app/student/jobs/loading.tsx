// app/student/jobs/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-48 bg-surface-container rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-surface-container rounded animate-pulse" />
      </div>

      {/* Search skeleton */}
      <div className="h-12 bg-surface-container rounded-xl animate-pulse" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="h-64 bg-surface-container rounded-2xl animate-pulse" />
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-surface-container rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}