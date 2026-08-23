import { QuizHeaderSkeleton } from "@/components/cards/QuizHeader"

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col items-center bg-background w-full">
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8">
        {/* Header / Progress Skeleton */}
        <QuizHeaderSkeleton />

        {/* Card Area Skeleton */}
        <div className="flex-1 flex flex-col items-center py-0 sm:py-2 relative min-h-0">
          <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl min-h-100 flex flex-col justify-center items-center animate-pulse p-8 shadow-2xl mt-2 sm:mt-4 mb-6">
            <div className="h-6 w-1/3 bg-zinc-800 rounded mb-8 self-start"></div>
            <div className="h-10 w-3/4 bg-zinc-800 rounded mb-6"></div>
            <div className="h-6 w-full bg-zinc-800 rounded mb-3"></div>
            <div className="h-6 w-full bg-zinc-800 rounded mb-3"></div>
            <div className="h-6 w-full bg-zinc-800 rounded mb-8"></div>
            <div className="h-10 w-32 bg-zinc-800 rounded-full self-end mt-4"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
