// app/student/showcase/my/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-64 bg-surface-container rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-96 bg-surface-container rounded animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-surface-container rounded-2xl animate-pulse"
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video bg-surface-container rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}   