// pages/api/save-watch-history/route.jsx
import { sql } from "@vercel/postgres";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, mediaType, mediaID } = body;

    if (!username || !mediaType || !mediaID) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    try {
      await sql`
        INSERT INTO WatchHistory (username, mediaType, mediaID)
        VALUES (${username}, ${mediaType}, ${mediaID})
      `;
    } catch (error) {
      if (error.code === '23505') { // Unique violation error code for PostgreSQL
        return new Response(JSON.stringify({ success: true, message: 'Watch history already exists' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
