// api/add-user/route.jsx
import { sql } from "@vercel/postgres";

// Handle POST requests
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, email } = body;

    const result = await sql`
      INSERT INTO Users (username, password, email, date_of_sign_up)
      VALUES (${username}, ${password}, ${email}, NOW())
      RETURNING *
    `;

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation error code for PostgreSQL
      return new Response(JSON.stringify({ error: 'Username is already taken.' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}