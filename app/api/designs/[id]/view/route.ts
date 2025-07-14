import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    // Increment view count
    const result = await designs.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $inc: { views: 1 },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    // Log the view for analytics
    const interactions = db.collection("interactions")
    await interactions.insertOne({
      designId: new ObjectId(id),
      type: "view",
      timestamp: new Date(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    return NextResponse.json({
      success: true,
      views: result.views,
    })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 })
  } finally {
    await client.close()
  }
}
