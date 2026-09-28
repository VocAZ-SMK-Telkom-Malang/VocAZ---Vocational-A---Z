// app/showcase/loading.tsx
export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-surface pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-on-surface-variant font-semibold">
          Memuat showcase...
        </p>
      </div>
    </div>
  )
}