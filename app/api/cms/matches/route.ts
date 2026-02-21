import { auth } from "@/utils/auth";
import { db } from "@/db";
import { matches } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = session.user;
    try {
        const events = await db
            .select()
            .from(matches)
            .where(eq(matches.userId, id))
            .orderBy(desc(matches.createdAt))
            .limit(100);
        return NextResponse.json({ events }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
    }
}