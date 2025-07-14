import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    await client.connect()
    const db = client.db("designer_portfolio")
    const bookings = db.collection("bookings")

    const booking = {
      ...body,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await bookings.insertOne(booking)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function GET() {
  try {
    await client.connect()
    const db = client.db("designer_portfolio")
    const bookings = db.collection("bookings")

    const allBookings = await bookings.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(allBookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  } finally {
    await client.close()
  }
}
