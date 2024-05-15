// api/get-users/route.jsx
import { sql } from "@vercel/postgres";

// Handle GET requests
export async function GET(request) {
  try {
    const { rows } = await sql`SELECT * FROM Users`;
    return new Response(JSON.stringify(rows), {
      status: 200,
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
