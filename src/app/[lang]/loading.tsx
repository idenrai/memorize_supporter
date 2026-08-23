import { Brain, Library } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-24 px-4 sm:px-8">
      {/* Header Skeleton */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-24">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center animate-pulse">
            <Brain className="text-zinc-600 w-6 h-6" aria-hidden="true" />
          </div>
          <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-24 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="w-full max-w-5xl">
        <div className="mb-12">
          <div className="h-12 w-64 bg-zinc-800 rounded animate-pulse mb-4"></div>
          <div className="h-6 w-96 bg-zinc-800 rounded animate-pulse"></div>
        </div>

        {/* Decks Grid Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Library size={20} className="text-zinc-600" aria-hidden="true" />
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-48 flex flex-col animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-24 bg-zinc-800 rounded"></div>
                <div className="h-6 w-16 bg-zinc-800 rounded"></div>
              </div>
              <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-zinc-800 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-zinc-800 rounded"></div>
              <div className="mt-auto flex justify-end pt-4 border-t border-zinc-800/50">
                <div className="h-8 w-24 bg-zinc-800 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
