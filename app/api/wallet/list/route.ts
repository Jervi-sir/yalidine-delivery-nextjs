import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "7", 10);

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId, 10);

    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { message: "Invalid userId. Must be an integer." },
        { status: 400 }
      );
    }

    const skip = (page - 1) * perPage;

    const [data, totalCount] = await Promise.all([
      prisma.withdrawalRequest.findMany({
        where: { user_id: userIdInt },
        skip,
        take: perPage,
        orderBy: { requested_at: "desc" },
      }),
      prisma.withdrawalRequest.count({ where: { user_id: userIdInt } }),
    ]);

    const totalPages = Math.ceil(totalCount / perPage);

    return NextResponse.json({
      data,
      totalCount,
      currentPage: page,
      totalPages,
    });
  } catch (error: any) {
    console.error("Error fetching withdrawal requests:", error);
    return NextResponse.json(
      { message: "Error fetching withdrawal requests", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
