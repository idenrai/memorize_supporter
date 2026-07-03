import { ArrowLeft } from "lucide-react"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 md:p-8">
        {/* Header / Progress Skeleton */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2 text-gray-500">
            <ArrowLeft size={20} aria-hidden="true" />
            <div className="h-5 w-12 bg-gray-800 rounded animate-pulse hidden md:block"></div>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden animate-pulse"></div>
          </div>
          <div className="h-5 w-16 bg-gray-800 rounded animate-pulse"></div>
        </div>

        {/* Card Area Skeleton */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-full max-w-2xl bg-[#1c1f26] border border-gray-800 rounded-3xl min-h-[400px] flex flex-col justify-center items-center animate-pulse p-8 shadow-2xl">
            <div className="h-10 w-3/4 bg-gray-800 rounded mb-8"></div>
            <div className="h-6 w-1/2 bg-gray-800 rounded mb-4"></div>
            <div className="h-6 w-2/3 bg-gray-800 rounded mb-16"></div>
            
            <div className="h-12 w-full max-w-sm bg-gray-800 rounded-xl mt-auto"></div>
          </div>
        </div>
      </div>
    </main>
  )
}
