import { db } from "@/db";
import { matches } from "@/db/schema";
import { lt } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    // Optional: Security check using a secret header
    // This prevents unauthorized users from triggering the cleanup
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        // Calculate the threshold time (6 hours ago)
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

        // Delete matches where endTime is older than 6 hours
        // Drizzle's casade delete (if configured in schema) will handle commentary
        const deletedMatches = await db.delete(matches)
            .where(lt(matches.endTime, sixHoursAgo))
            .returning();

        return NextResponse.json({
            success: true,
            message: `Cleanup completed. Deleted ${deletedMatches.length} matches.`,
            count: deletedMatches.length,
            deletedIds: deletedMatches.map(m => m.id),
            threshold: sixHoursAgo.toISOString()
        });
    } catch (error) {
        console.error("Cron Cleanup Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error during cleanup" },
            { status: 500 }
        );
    }
}
