import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { username, mediaType, mediaID } = body;

    if (!username || !mediaType || !mediaID) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    const result = await sql`
      DELETE FROM WatchHistory
      WHERE username = ${username}
        AND mediaType = ${mediaType}
        AND mediaID = ${mediaID}
    `;

    revalidatePath('/watch-history');

    return new Response(JSON.stringify({
      success: true,
      deleted: result.rowCount ?? 0,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
}
