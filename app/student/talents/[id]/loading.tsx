// app/student/talents/[id]/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-48 bg-surface-container rounded" />
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <div className="h-40 bg-surface-container" />
        <div className="p-6 -mt-16">
          <div className="w-28 h-28 rounded-3xl bg-surface-container mb-4" />
          <div className="h-8 w-64 bg-surface-container rounded mb-2" />
          <div className="h-4 w-96 bg-surface-container rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-64 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl" />
        <div className="h-64 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl" />
      </div>
    </div>
  )
}