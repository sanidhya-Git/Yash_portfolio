import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

// Add response caching headers
const CACHE_DURATION = 60 // 1 minute

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    const design = {
      ...body,
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await designs.insertOne(design)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating design:", error)
    return NextResponse.json({ error: "Failed to create design" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function GET() {
  try {
    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    const allDesigns = await designs
      .find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(50) // Limit results for better performance
      .toArray()

    const response = NextResponse.json(allDesigns)

    // Add caching headers
    response.headers.set("Cache-Control", `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=300`)

    return response
  } catch (error) {
    console.error("Error fetching designs:", error)
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Design ID is required" }, { status: 400 })
    }

    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    await designs.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting design:", error)
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 })
  } finally {
    await client.close()
  }
}
