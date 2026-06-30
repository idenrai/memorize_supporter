import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ParsedDeck {
  deckName: string
  title: string
  description: string | null
  type: string
  cards: any[]
}

async function processJson(filePath: string, deckId: string): Promise<ParsedDeck | null> {
  const content = fs.readFileSync(filePath, 'utf-8')
  let data;
  try {
    data = JSON.parse(content)
  } catch (e) {
    console.error(`Invalid JSON in ${filePath}`)
    return null
  }
  
  let title = deckId
  let description = null
  let type = 'flashcard'
  let rawCards = []

  if (Array.isArray(data)) {
    // Backward compatibility for old format
    rawCards = data
  } else if (data && data.cards && Array.isArray(data.cards)) {
    // New format
    title = data.title || deckId
    description = data.description || null
    type = data.type || 'flashcard'
    rawCards = data.cards
  } else {
    return null
  }

  const cards = []
  for (const item of rawCards) {
    // Allow card-level type override, fallback to deck type
    const cardType = item.type || type

    if (cardType === 'vocabulary' || (item.word && item.meaning)) {
      const stableId = item.id ? String(item.id) : crypto.createHash('md5').update(`${deckId}_vocabulary_${item.word}`).digest('hex')
      cards.push({
        id: stableId,
        deck: deckId,
        type: 'vocabulary',
        content: JSON.stringify({
          word: item.word,
          meaning: item.meaning,
          example: item.example
        })
      })
    } else if (cardType === 'practice_quiz' || cardType === 'multiple_choice' || (item.question && item.options)) {
      const stableId = item.id ? String(item.id) : crypto.createHash('md5').update(`${deckId}_quiz_${item.question}`).digest('hex')
      cards.push({
        id: stableId,
        deck: deckId,
        type: 'practice_quiz',
        content: JSON.stringify({
          question: item.question,
          options: item.options,
          answers: item.answers || (item.answer !== undefined ? [item.answer] : []),
          explanation: item.explanation
        })
      })
    } else if (cardType === 'flashcard' || cardType === 'tip' || (item.front && item.back)) {
      const stableId = item.id ? String(item.id) : crypto.createHash('md5').update(`${deckId}_flashcard_${item.front}`).digest('hex')
      cards.push({
        id: stableId,
        deck: deckId,
        type: 'flashcard',
        content: JSON.stringify({
          front: item.front,
          back: item.back,
          category: item.category
        })
      })
    }
  }

  return {
    deckName: deckId,
    title,
    description,
    type,
    cards
  }
}

async function main() {
  console.log('Starting ETL process...')
  
  const inputDir = path.join(process.cwd(), 'input')
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(inputDir, { recursive: true }) as string[]
  let totalInserted = 0

  for (const file of files) {
    const fileName = path.basename(file)
    if (fileName.startsWith('_') || fileName.toLowerCase() === 'readme.md') {
      continue 
    }

    const filePath = path.join(inputDir, file)
    const ext = path.extname(file).toLowerCase()
    if (ext !== '.json') {
      continue
    }

    const deckId = path.basename(file, ext)
    
    try {
      const parsed = await processJson(filePath, deckId)

      if (parsed && parsed.cards.length > 0) {
        // Upsert Deck metadata first
        await prisma.deck.upsert({
          where: { id: deckId },
          update: {
            title: parsed.title,
            description: parsed.description,
            type: parsed.type
          },
          create: {
            id: deckId,
            title: parsed.title,
            description: parsed.description,
            type: parsed.type
          }
        })

        // targeted deletion: delete cards that are no longer in the JSON
        const existingCards = await prisma.card.findMany({ where: { deck: deckId } })
        const existingCardIds = new Set(existingCards.map(c => c.id))
        const newCardIds = new Set(parsed.cards.map((c: any) => c.id))

        const cardsToDelete = [...existingCardIds].filter(id => !newCardIds.has(id))
        if (cardsToDelete.length > 0) {
          await prisma.learningProgress.deleteMany({
            where: { cardId: { in: cardsToDelete } }
          })
          await prisma.card.deleteMany({
            where: { id: { in: cardsToDelete } }
          })
        }

        // Upsert new/existing cards
        for (const card of parsed.cards) {
          await prisma.card.upsert({
            where: { id: card.id },
            update: {
              type: card.type,
              content: card.content
            },
            create: card
          })
        }

        console.log(`[${deckId}] Successfully processed and upserted ${parsed.cards.length} cards.`)
        totalInserted += parsed.cards.length
      }
    } catch (e) {
      console.error(`Error processing file ${file}:`, e)
    }
  }

  console.log(`ETL Complete! Inserted a total of ${totalInserted} cards across all decks.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
