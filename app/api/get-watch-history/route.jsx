import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return Response.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT *
      FROM WatchHistory
      WHERE username = ${username}
      ORDER BY watched_at DESC
    `;

    return Response.json(result.rows, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Failed to fetch watch history:", error);

    return Response.json(
      { error: "Failed to fetch watch history" },
      { status: 500 }
    );
  }
}