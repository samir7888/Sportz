import { db } from "@/db"
import { matches } from "@/db/schema"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

//to fetch upcoming matches from starttime and current time
export const GET = async () => {
    const now = new Date()
    const events = await db
    .select()
    .from(matches)
    .orderBy(desc(matches.createdAt))
    .limit(10)


    const upcomingMatches = events.filter(event => {    
        const startTime = new Date(event.startTime)
        return startTime >= now
    })
    return NextResponse.json({ events: upcomingMatches }, { status: 200 })
}