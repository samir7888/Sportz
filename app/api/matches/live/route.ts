import { db } from "@/db"
import { matches } from "@/db/schema"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

//to fetch live matches from starttime and current time
export const GET = async () => {
    const now = new Date()
    const events = await db
    .select()
    .from(matches)
    .orderBy(desc(matches.createdAt))
    .limit(10)


    const liveMatches = events.filter(event => {    
        const startTime = new Date(event.startTime)
        const endTime = new Date(event.endTime)
        return startTime <= now && endTime >= now
    })
    return NextResponse.json({ events: liveMatches }, { status: 200 })
}