// api/verify-user/route.jsx
import { sql } from "@vercel/postgres";
import { revalidatePath } from 'next/cache';

// Force Next.js to render this route dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 1;
// Handle POST requests
export async function POST(request) {
  try {
    const { username } = await request.json();
    
    const { rows } = await sql`SELECT * FROM Users WHERE username = ${username}`;
    // To dynamically get the path
    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);
    
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
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