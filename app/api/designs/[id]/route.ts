import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    await client.connect()
    const db = client.db("designer_portfolio")
    const designs = db.collection("designs")

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    await designs.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating design:", error)
    return NextResponse.json({ error: "Failed to update design" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

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
