export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      {/* Title & Subtitle Skeleton */}
      <div className="mb-8 sm:mb-10 text-center flex flex-col items-center">
        <div className="h-10 sm:h-12 w-72 sm:w-96 bg-zinc-800/80 rounded-2xl animate-pulse mb-3" />
        <div className="h-5 w-64 sm:w-80 bg-zinc-800/60 rounded-xl animate-pulse" />
      </div>

      {/* Filter / Control Bar Skeleton */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-3 w-full">
        <div className="h-13 w-full md:flex-1 bg-zinc-900/60 border border-white/5 rounded-2xl animate-pulse" />
        <div className="h-13 w-full md:w-64 bg-zinc-900/60 border border-white/5 rounded-2xl animate-pulse shrink-0" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl p-px bg-zinc-800/40 border border-white/5 overflow-hidden animate-pulse"
          >
            <div className="bg-zinc-950/80 rounded-[23px] p-6 h-56 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="h-5 w-20 bg-zinc-800 rounded-full" />
                  <div className="h-5 w-16 bg-zinc-800 rounded-full" />
                </div>
                <div className="h-7 w-3/4 bg-zinc-700/80 rounded-xl mb-3 mt-4" />
                <div className="h-4 w-full bg-zinc-800/60 rounded mb-2" />
                <div className="h-4 w-2/3 bg-zinc-800/60 rounded" />
              </div>
              <div className="pt-4 border-t border-zinc-800/50 flex justify-end">
                <div className="h-8 w-24 bg-zinc-800 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
