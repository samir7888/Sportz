import { db } from "@/db";
import { matches } from "@/db/schema";
import { matchIdParamSchema, updateScoreSchema } from "@/validations/matches";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paramsParsed = matchIdParamSchema.safeParse({ id: (await params).id });
    if (!paramsParsed.success) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        await db.delete(matches).where(eq(matches.id, paramsParsed.data.id));
        return NextResponse.json({ message: "Match deleted" });
    } catch (e) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paramsParsed = matchIdParamSchema.safeParse({ id: (await params).id });
    if (!paramsParsed.success) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateScoreSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Invalid Score Payload" }, { status: 400 });
    }

    try {
        const [updated] = await db
            .update(matches)
            .set(parsed.data)
            .where(eq(matches.id, paramsParsed.data.id))
            .returning();

        return NextResponse.json({ data: updated });
    } catch (e) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
