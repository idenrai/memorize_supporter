import Link from "next/link"
import { Brain, ArrowRight, Library, Settings } from "lucide-react"
import DeckCard from "@/components/cards/DeckCard"
import prisma from "@/lib/prisma"

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export default async function Home() {
  // Fetch available decks dynamically using Next.js Server Components
  const decks = await prisma.deck.findMany({
    include: {
      _count: {
        select: { cards: true }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 px-4 sm:px-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between mb-24">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Brain className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Memorize<span className="text-blue-500">Supporter</span></h1>
        </div>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Welcome back, <br className="sm:hidden"/> Ready to learn?
          </h2>
          <p className="text-lg text-gray-400 max-w-xl">
            Focus-driven active recall to supercharge your memory retention.
          </p>
        </div>

        {/* Decks Grid */}
        <div className="flex items-center gap-2 mb-6 text-gray-300 font-medium">
          <Library size={20} className="text-blue-500" />
          <h3>Your Decks</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <DeckCard 
              key={deck.id} 
              deck={deck.id} 
              count={deck._count.cards} 
              deckName={deck.title} 
              description={deck.description}
              type={deck.type}
            />
          ))}

          {decks.length === 0 && (
            <div className="col-span-full text-center p-12 sm:p-16 bg-gray-900/40 border border-gray-800/60 rounded-3xl mt-4">
              <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Library size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Welcome to Memorize Supporter!</h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                You don&apos;t have any flashcards or quizzes yet. It&apos;s time to add your learning data!
              </p>
              
              <div className="bg-gray-800/50 rounded-xl p-6 text-left max-w-2xl mx-auto border border-gray-700/50">
                <h4 className="text-gray-200 font-semibold mb-4">How to add decks:</h4>
                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-400">
                  <li>Create a JSON file containing your flashcards or quizzes.</li>
                  <li>Place the file in <code className="bg-gray-900 px-2 py-1 rounded text-blue-400">input/private</code> or <code className="bg-gray-900 px-2 py-1 rounded text-blue-400">input/public</code> directory.</li>
                  <li>Run <code className="bg-gray-900 px-2 py-1 rounded text-green-400 font-mono">npm run etl</code> in your terminal to load the data.</li>
                  <li>Refresh this page and start studying!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
