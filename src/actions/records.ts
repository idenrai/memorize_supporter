"use server"

import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import type { CardData } from "@/types/card"
import { parseCardData } from "@/lib/card-parser"

export async function getExamRecords(deckId?: string) {
  try {
    const records = await prisma.examResult.findMany({
      where: deckId ? { deckId } : undefined,
      include: {
        deck: {
          select: {
            title: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    let deckTitle: string | undefined = undefined;
    if (deckId) {
       if (records.length > 0) {
         deckTitle = records[0].deck.title;
       } else {
         const deck = await prisma.deck.findUnique({ where: { id: deckId }, select: { title: true } });
         if (deck) deckTitle = deck.title;
       }
    }
    
    return { success: true, records, deckTitle }
  } catch (error) {
    console.error("Failed to fetch exam records:", error)
    return { success: false, error: "Failed to fetch exam records" }
  }
}

export async function getExamResultDetails(examId: string) {
  try {
    const record = await prisma.examResult.findUnique({
      where: { id: examId },
      include: {
        deck: {
          select: {
            title: true,
          }
        },
        details: true
      }
    })
    
    if (!record) {
      return { success: false, error: "Record not found" }
    }
    
    let playingCards: CardData[] = []
    let sessionResults: { cardId: string; isCorrect: boolean; selectedIndices?: number[] }[] = []

    if (record.details && record.details.length > 0) {
      sessionResults = record.details.map(d => ({
        cardId: d.cardId,
        isCorrect: d.isCorrect,
        selectedIndices: d.selectedIndices ? JSON.parse(d.selectedIndices) : undefined
      }))

      // Fetch from DB
      const cardIds = sessionResults.map(r => r.cardId)
      const fetchedCards = await prisma.card.findMany({
        where: { id: { in: cardIds } }
      })
      
      const cardMap = new Map<string, CardData>()
      for (const c of fetchedCards) {
        const parsed = parseCardData(c)
        if (parsed) {
          cardMap.set(c.id, parsed)
        }
      }
      
      playingCards = sessionResults
        .map(r => cardMap.get(r.cardId))
        .filter((c): c is CardData => c !== undefined)
    }
    
    return { success: true, record, playingCards, sessionResults }
  } catch (error) {
    console.error("Failed to fetch exam result details:", error)
    return { success: false, error: "Failed to fetch exam result details" }
  }
}

const DeleteExamResultSchema = z.object({
  id: z.string().min(1)
})

export const deleteExamResult = actionClient(DeleteExamResultSchema, async ({ id }) => {
  try {
    await prisma.examResult.delete({
      where: { id }
    })
    revalidatePath('/[lang]/records', 'page')
    return { success: true, message: "Record deleted successfully" }
  } catch (error) {
    console.error("Failed to delete exam result:", error)
    return { success: false, message: "Failed to delete exam result" }
  }
})
