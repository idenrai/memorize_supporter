'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { z } from 'zod'

const prisma = new PrismaClient()

import { DeckSchema } from '@/schemas/deck'

export async function uploadDeck(jsonData: string, fileName: string) {
  try {
    // Server-side payload size validation (5MB limit)
    // 1 char is roughly 1 byte in standard ASCII JSON, taking a safe margin.
    if (jsonData.length > 5 * 1024 * 1024) {
      return { success: false, message: 'Payload too large (exceeds 5MB limit)' }
    }

    const parsedData = JSON.parse(jsonData)
    const deckId = fileName.replace(/\.json$/i, '')
    
    let rawData;
    if (Array.isArray(parsedData)) {
      rawData = {
        title: deckId,
        type: 'flashcard',
        cards: parsedData
      }
    } else {
      rawData = {
        title: parsedData.title || deckId,
        description: parsedData.description,
        type: parsedData.type || 'flashcard',
        series: parsedData.series,
        cards: parsedData.cards || []
      }
    }

    const validatedData = DeckSchema.parse(rawData)

    const cardsToInsert: { id: string; type: string; content: string }[] = []
    for (const item of validatedData.cards) {
      const cardType = item.type || validatedData.type

      if (cardType === 'vocabulary' || (item.word && item.meaning)) {
        const stableId = item.id ? String(item.id) : crypto.createHash('sha256').update(`${deckId}_vocabulary_${item.word}`).digest('hex').substring(0, 32)
        cardsToInsert.push({
          id: stableId,
          type: 'vocabulary',
          content: JSON.stringify({
            word: item.word,
            meaning: item.meaning,
            example: item.example
          })
        })
      } else if (cardType === 'practice_quiz' || cardType === 'multiple_choice' || (item.question && item.options)) {
        const stableId = item.id ? String(item.id) : crypto.createHash('sha256').update(`${deckId}_quiz_${item.question}`).digest('hex').substring(0, 32)
        cardsToInsert.push({
          id: stableId,
          type: 'practice_quiz',
          content: JSON.stringify({
            category: typeof item.category === 'string' ? item.category.trim() : item.category,
            question: item.question,
            options: item.options,
            answers: item.answers || (item.answer !== undefined ? [item.answer] : []),
            explanation: item.explanation
          })
        })
      } else {
        const stableId = item.id ? String(item.id) : crypto.createHash('sha256').update(`${deckId}_flashcard_${item.front}`).digest('hex').substring(0, 32)
        cardsToInsert.push({
          id: stableId,
          type: 'flashcard',
          content: JSON.stringify({
            front: item.front,
            back: item.back,
            category: typeof item.category === 'string' ? item.category.trim() : item.category
          })
        })
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.deck.upsert({
        where: { id: deckId },
        update: {
          title: validatedData.title,
          description: validatedData.description,
          type: validatedData.type,
          series: validatedData.series,
          isSystem: false
        },
        create: {
          id: deckId,
          title: validatedData.title,
          description: validatedData.description,
          type: validatedData.type,
          series: validatedData.series,
          isSystem: false
        }
      })

      for (const card of cardsToInsert) {
        await tx.card.upsert({
          where: { id: card.id },
          update: {
            deck: deckId,
            type: card.type,
            content: card.content
          },
          create: {
            id: card.id,
            deck: deckId,
            type: card.type,
            content: card.content
          }
        })
      }
    })

    revalidatePath('/')
    revalidatePath('/data-management')
    return { success: true, message: 'Data uploaded successfully!' }
  } catch (error) {
    console.error('Upload Error:', error)
    if (error instanceof SyntaxError) {
      return { success: false, message: 'Invalid JSON format: Please check for syntax errors in your file.' }
    }
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Invalid data format: ' + (error as any).errors.map((e: any) => e.message).join(', ') }
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

export async function getDecks(includeHidden = false) {
  try {
    const decks = await prisma.deck.findMany({
      where: includeHidden ? undefined : { isHidden: false },
      include: {
        _count: {
          select: { cards: true }
        }
      },
      orderBy: [
        { isSystem: 'desc' },
        { createdAt: 'desc' }
      ]
    })
    return decks
  } catch (error) {
    console.error('Failed to get decks:', error)
    return []
  }
}

export async function toggleDeckVisibility(deckId: string, currentHidden: boolean) {
  try {
    await prisma.deck.update({
      where: { id: deckId },
      data: { isHidden: !currentHidden }
    })
    revalidatePath('/')
    revalidatePath('/data-management')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle visibility:', error)
    return { success: false, message: 'Failed to update visibility' }
  }
}
export async function updateDeckDetails(deckId: string, data: { title: string, series: string }) {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId }
    })

    if (!deck) {
      return { success: false, message: 'Deck not found' }
    }

    if (deck.isSystem) {
      return { success: false, message: 'System data cannot be modified' }
    }

    if (!data.title || data.title.trim() === '') {
      return { success: false, message: 'Title cannot be empty' }
    }

    if (data.title.length > 100) {
      return { success: false, message: 'Title is too long (maximum 100 characters)' }
    }

    if (data.series && data.series.length > 50) {
      return { success: false, message: 'Series name is too long (maximum 50 characters)' }
    }

    await prisma.deck.update({
      where: { id: deckId },
      data: {
        title: data.title.trim(),
        series: data.series ? data.series.trim() : ''
      }
    })

    revalidatePath('/')
    revalidatePath('/data-management')
    return { success: true }
  } catch (error) {
    console.error('Failed to update deck details:', error)
    return { success: false, message: 'Failed to update data' }
  }
}

export async function deleteDeck(deckId: string) {
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId }
    })

    if (!deck) {
      return { success: false, message: 'Deck not found' }
    }

    if (deck.isSystem) {
      return { success: false, message: 'System data cannot be deleted' }
    }

    await prisma.$transaction(async (tx) => {
      const cards = await tx.card.findMany({ where: { deck: deckId } })
      const cardIds = cards.map(c => c.id)

      if (cardIds.length > 0) {
        await tx.learningProgress.deleteMany({
          where: { cardId: { in: cardIds } }
        })
        await tx.card.deleteMany({
          where: { deck: deckId }
        })
      }

      await tx.deck.delete({
        where: { id: deckId }
      })
    })

    revalidatePath('/')
    revalidatePath('/data-management')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete deck:', error)
    return { success: false, message: 'Failed to delete data' }
  }
}
