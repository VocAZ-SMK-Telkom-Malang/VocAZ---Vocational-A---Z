// app/student/talents/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div className="h-6 w-32 bg-surface-container rounded mb-3" />
        <div className="h-10 w-72 bg-surface-container rounded mb-3" />
        <div className="h-4 w-96 bg-surface-container rounded mb-6" />
        <div className="h-14 w-full bg-surface-container rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-72 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl"
          />
        ))}
      </div>
    </div>
  )
}