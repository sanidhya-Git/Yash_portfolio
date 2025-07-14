import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    // Admin endpoint returns all designs including drafts
    const allDesigns = await designs.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(allDesigns)
  } catch (error) {
    console.error("Error fetching designs:", error)
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  } finally {
    await client.close()
  }
}
