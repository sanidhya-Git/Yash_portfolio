import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    // Get only the stats (likes and views) for all published designs
    const stats = await designs
      .find(
        { status: "published" },
        {
          projection: {
            _id: 1,
            likes: 1,
            views: 1,
          },
        },
      )
      .toArray()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching design stats:", error)
    return NextResponse.json({ error: "Failed to fetch design stats" }, { status: 500 })
  } finally {
    await client.close()
  }
}
