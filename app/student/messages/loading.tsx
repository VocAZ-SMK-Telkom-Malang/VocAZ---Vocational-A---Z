// app/student/messages/loading.tsx
export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-surface-container-low/30 animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 border-r border-outline-variant/30 bg-surface-container-lowest">
        <div className="px-4 py-3.5 border-b border-outline-variant/30">
          <div className="h-6 w-24 bg-surface-container rounded" />
        </div>
        <div className="p-2 space-y-1">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl"
            >
              <div className="w-11 h-11 rounded-full bg-surface-container shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-surface-container rounded" />
                <div className="h-3 w-48 bg-surface-container rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat skeleton */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-surface-container mx-auto mb-4" />
          <div className="h-4 w-32 bg-surface-container rounded mx-auto mb-2" />
          <div className="h-3 w-48 bg-surface-container rounded mx-auto" />
        </div>
      </div>
    </div>
  )
}