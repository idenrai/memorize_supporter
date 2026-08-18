"use server"

import prisma from "@/lib/prisma"

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
