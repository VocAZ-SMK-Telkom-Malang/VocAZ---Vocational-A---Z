// app/showcase/loading.tsx
export default function Loading() {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-xs text-white/70 font-semibold">
          Memuat video...
        </p>
      </div>
    </div>
  )
}