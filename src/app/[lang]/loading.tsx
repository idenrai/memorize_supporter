export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 md:pt-12 pb-16">
      {/* Title & Subtitle Skeleton */}
      <div className="mb-8 sm:mb-10 text-center flex flex-col items-center">
        <div className="h-8 sm:h-10 w-64 sm:w-80 bg-zinc-800/80 rounded-xl animate-pulse mb-3" />
        <div className="h-4 w-52 sm:w-64 bg-zinc-800/60 rounded-lg animate-pulse" />
      </div>

      {/* Filter / Control Bar Skeleton */}
      <div className="mb-8 flex flex-col md:flex-row items-center gap-3 w-full">
        <div className="h-10 w-full md:flex-1 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
        <div className="h-10 w-full md:w-56 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse shrink-0" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="card-precision p-5 sm:p-6 h-56 flex flex-col justify-between animate-pulse"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="h-5 w-20 bg-zinc-800 rounded-md" />
                <div className="h-5 w-16 bg-zinc-800 rounded-md" />
              </div>
              <div className="h-6 w-3/4 bg-zinc-700/80 rounded-lg mb-2 mt-3" />
              <div className="h-3.5 w-full bg-zinc-800/60 rounded mb-1.5" />
              <div className="h-3.5 w-2/3 bg-zinc-800/60 rounded" />
            </div>
            <div className="pt-4 border-t border-zinc-800/60 flex justify-between items-center">
              <div className="h-4 w-20 bg-zinc-800/60 rounded" />
              <div className="h-7 w-20 bg-zinc-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
