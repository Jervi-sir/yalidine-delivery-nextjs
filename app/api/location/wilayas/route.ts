import { wilayas } from "@/database/wilayas";

export async function GET(request: Request) {
  return Response.json([...wilayas])
}

