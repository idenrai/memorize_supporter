'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { z } from 'zod'

const prisma = new PrismaClient()

import { DeckSchema } from '@/schemas/deck'
import { actionClient } from '@/lib/safe-action'
import { UploadDeckSchema, UpdateDeckDetailsSchema, ToggleVisibilitySchema, DeleteDeckSchema } from '@/lib/schemas'
import { serverConfig } from '@/lib/config.server'

export const uploadDeck = actionClient(UploadDeckSchema, async ({ jsonData, fileName }) => {
  let parsedData;
  try {
    parsedData = JSON.parse(jsonData)
  } catch {
    throw new Error('Invalid JSON format: Please check for syntax errors in your file.')
  }

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

  let validatedData;
  try {
    validatedData = DeckSchema.parse(rawData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error('Invalid data format: ' + error.issues.map((e) => e.message).join(', '))
    }
    throw error;
  }

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

    const CHUNK_SIZE = serverConfig.dbChunkSize;
    for (let i = 0; i < cardsToInsert.length; i += CHUNK_SIZE) {
      const chunk = cardsToInsert.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(card => 
          tx.card.upsert({
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
        )
      )
    }

    const existingCards = await tx.card.findMany({
      where: { deck: deckId },
      select: { id: true }
    });

    const validCardIds = new Set(cardsToInsert.map(c => c.id));
    const ghostsToDelete = existingCards.filter(c => !validCardIds.has(c.id)).map(c => c.id);

    if (ghostsToDelete.length > 0) {
      for (let i = 0; i < ghostsToDelete.length; i += CHUNK_SIZE) {
        const chunk = ghostsToDelete.slice(i, i + CHUNK_SIZE);
        await tx.card.deleteMany({
          where: { id: { in: chunk } }
        });
      }
    }
  })

  revalidatePath('/')
  revalidatePath('/data-management')
  return { success: true, message: 'Data uploaded successfully!' }
})

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

export const toggleDeckVisibility = actionClient(ToggleVisibilitySchema, async ({ deckId, currentHidden }) => {
  await prisma.deck.update({
    where: { id: deckId },
    data: { isHidden: !currentHidden }
  })
  revalidatePath('/')
  revalidatePath('/data-management')
  return { success: true, message: 'Visibility toggled' }
})
export const updateDeckDetails = actionClient(UpdateDeckDetailsSchema, async ({ deckId, title, series }) => {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId }
  })

  if (!deck) {
    throw new Error('Deck not found')
  }

  if (deck.isSystem) {
    throw new Error('System data cannot be modified')
  }

  await prisma.deck.update({
    where: { id: deckId },
    data: {
      title: title.trim(),
      series: series ? series.trim() : ''
    }
  })

  revalidatePath('/')
  revalidatePath('/data-management')
  return { success: true, message: 'Deck updated successfully' }
})

export const deleteDeck = actionClient(DeleteDeckSchema, async ({ deckId }) => {
  const deck = await prisma.deck.findUnique({
    where: { id: deckId }
  })

  if (!deck) {
    throw new Error('Deck not found')
  }

  if (deck.isSystem) {
    throw new Error('System data cannot be deleted')
  }

  // Thanks to onDelete: Cascade in schema.prisma, 
  // this single call will automatically delete all associated Cards and LearningProgress!
  await prisma.deck.delete({
    where: { id: deckId }
  })

  revalidatePath('/')
  revalidatePath('/data-management')
  return { success: true, message: 'Deck deleted successfully' }
})
