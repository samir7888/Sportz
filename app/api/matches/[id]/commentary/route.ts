import { db } from "@/db";
import { commentary } from "@/db/schema";
import { matchIdParamSchema } from "@/validations/matches";
import { createCommentarySchema, listCommentaryQuerySchema } from "@/validations/commentary";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { eq, asc, desc } from "drizzle-orm";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate match ID from params
    const paramsParsed = matchIdParamSchema.safeParse({ id: (await params).id });
    if (!paramsParsed.success) {
        return NextResponse.json(
            { error: "Invalid match ID", details: paramsParsed.error.issues },
            { status: 400 }
        );
    }

    // Validate request body
    const body = await request.json();
    const bodyParsed = createCommentarySchema.safeParse(body);
    if (!bodyParsed.success) {
        return NextResponse.json(
            { error: "Invalid payload", details: bodyParsed.error.issues },
            { status: 400 }
        );
    }

    const { id: matchId } = paramsParsed.data;
    const commentaryData = bodyParsed.data;

    try {
        // Insert commentary into database
        const [newCommentary] = await db
            .insert(commentary)
            .values({
                matchId,
                ...commentaryData,
            })
            .returning();

        // Trigger real-time update via Pusher
        await pusherServer.trigger(`match-${matchId}`, "commentary-added", newCommentary);
        // Also trigger a general match update event if you want the dashboard to know there's new commentary
        await pusherServer.trigger("matches", "match-updated", { id: matchId });

        return NextResponse.json({ data: newCommentary }, { status: 201 });
    } catch (error) {
        console.error("Error creating commentary:", error);
        return NextResponse.json(
            { error: "Failed to create commentary" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Validate match ID from params
    const paramsParsed = matchIdParamSchema.safeParse({ id: (await params).id });
    if (!paramsParsed.success) {
        return NextResponse.json(
            { error: "Invalid match ID", details: paramsParsed.error.issues },
            { status: 400 }
        );
    }

    // Validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryParsed = listCommentaryQuerySchema.safeParse({
        limit: searchParams.get("limit"),
    });
    if (!queryParsed.success) {
        return NextResponse.json(
            { error: "Invalid query parameters", details: queryParsed.error.issues },
            { status: 400 }
        );
    }

    const { id: matchId } = paramsParsed.data;
    const limit = queryParsed.data.limit ?? 100;

    try {
        // Fetch commentary for the match
        const commentaryList = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, matchId))
            .orderBy(desc(commentary.createdAt))
            .limit(limit);

        return NextResponse.json({ data: commentaryList }, { status: 200 });
    } catch (error) {
        console.error("Error fetching commentary:", error);
        return NextResponse.json(
            { error: "Failed to fetch commentary" },
            { status: 500 }
        );
    }
}

