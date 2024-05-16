import { sql } from "@vercel/postgres";
import { revalidatePath } from 'next/cache';

// Force Next.js to render this route dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 1;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const result = await sql`
      SELECT * FROM Playlists WHERE username = ${username} ORDER BY added_at DESC
    `;

    // To dynamically get the path
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    return new Response(JSON.stringify(result.rows), {
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
