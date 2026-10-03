// app/student/settings/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-9 w-48 bg-surface-container rounded mb-2" />
        <div className="h-4 w-72 bg-surface-container rounded" />
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block w-64 space-y-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-surface-container rounded-xl"
            />
          ))}
        </div>

        <div className="flex-1 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
          <div className="h-6 w-32 bg-surface-container rounded mb-4" />
          <div className="space-y-4">
            <div className="h-16 bg-surface-container rounded-xl" />
            <div className="h-16 bg-surface-container rounded-xl" />
            <div className="h-16 bg-surface-container rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}