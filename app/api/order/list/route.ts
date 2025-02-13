import { createClient } from "@/database/postgresClient";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: users } = await supabase.from("users").select();

  return Response.json({ users })
}

