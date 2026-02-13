import { db } from "@/db";
import { matches } from "@/db/schema";
import { getMatchStatus } from "@/utils/match-status";
import { createMatchSchema, listMatchesQuerySchema } from "@/validations/matches";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


const MAX_LIMIT = 100;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createMatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid Payload", details: parsed.error.issues }, { status: 400 });
  }

  const { startTime, endTime, homeScore, awayScore } = parsed.data;
  try {

    const [event] = await db.insert(matches).values(
      {
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime)
      }
    ).returning();

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsed = listMatchesQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid Query Parameters", details: parsed.error.issues }, { status: 400 });
  }

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
  try {
    const events = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);
    return NextResponse.json({ events }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}