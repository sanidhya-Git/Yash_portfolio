import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { action } = await request.json()
    const { id } = params

    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    // Get current design
    const design = await designs.findOne({ _id: new ObjectId(id) })
    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    // Update likes based on action
    const increment = action === "like" ? 1 : -1
    const newLikes = Math.max(0, (design.likes || 0) + increment)

    await designs.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          likes: newLikes,
          updatedAt: new Date(),
        },
      },
    )

    // Log the interaction for analytics
    const interactions = db.collection("interactions")
    await interactions.insertOne({
      designId: new ObjectId(id),
      type: action,
      timestamp: new Date(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    return NextResponse.json({
      success: true,
      likes: newLikes,
      action,
    })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  } finally {
    await client.close()
  }
}
