import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const db = client.db("designer_portfolio")
    const interactions = db.collection("interactions")

    // Get analytics data for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const analytics = await interactions
      .aggregate([
        {
          $match: {
            timestamp: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              designId: "$designId",
              type: "$type",
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$timestamp",
                },
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.designId",
            interactions: {
              $push: {
                type: "$_id.type",
                date: "$_id.date",
                count: "$count",
              },
            },
            totalLikes: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "like"] }, "$count", 0],
              },
            },
            totalViews: {
              $sum: {
                $cond: [{ $eq: ["$_id.type", "view"] }, "$count", 0],
              },
            },
          },
        },
        {
          $sort: { totalViews: -1 },
        },
      ])
      .toArray()

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  } finally {
    await client.close()
  }
}
