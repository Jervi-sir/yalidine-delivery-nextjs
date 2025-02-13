import { wilayas } from "@/database/wilayas";

export async function GET() {
  return Response.json([...wilayas])
}

