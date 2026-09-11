import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "input", "public")
    if (!fs.existsSync(publicDir)) {
      return NextResponse.json({ decks: [] })
    }

    const files = fs.readdirSync(publicDir).filter((f) => f.endsWith(".json"))
    const decks: Array<{ filename: string; content: string }> = []

    for (const file of files) {
      try {
        const filePath = path.join(publicDir, file)
        const content = fs.readFileSync(filePath, "utf-8")
        decks.push({
          filename: file,
          content
        })
      } catch (e) {
        console.warn(`Failed to read sample deck ${file}:`, e)
      }
    }

    return NextResponse.json(
      { decks },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400"
        }
      }
    )
  } catch (err) {
    console.error("Failed to load sample decks:", err)
    return NextResponse.json({ error: "Failed to load sample decks" }, { status: 500 })
  }
}
