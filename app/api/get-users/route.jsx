// api/get-users/route.jsx
import { sql } from "@vercel/postgres";

// Force Next.js to render this route dynamically
export const dynamic = 'force-dynamic';

// Handle GET requests
export async function GET(request) {
  try {
    const { rows } = await sql`SELECT * FROM Users`;
    //console.log(rows);
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Ensure no caching on response
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Ensure no caching on error response
      },
    });
  }
}