// src/app/api/parcels/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/prisma/prisma";

interface Params {
  userId: number;
  page: number;
  wilaya?: string;
  commune?: string;
  isStopdesk?: number;
  status?: string;
  doInsurance?: boolean;
}

export async function GET(req: NextRequest) {
  noStore(); // Disable cache

  try {
    const searchParams = req.nextUrl.searchParams;
    const perPage = Number(searchParams.get("perPage"));
    const userId = Number(searchParams.get("userId"));
    const page = Number(searchParams.get("page")) || 1;
    const wilaya = searchParams.get("wilaya") || undefined;
    const commune = searchParams.get("commune") || undefined;
    const isStopdesk = searchParams.get("isStopdesk");
    const isStopdeskBool =
      isStopdesk === "true" ? true : isStopdesk === "false" ? false : undefined;
    const status = searchParams.get("status") || undefined;
    const doInsurance = searchParams.get("doInsurance");
    const doInsuranceBool =
      doInsurance === "true" ? true : doInsurance === "false" ? false : undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const pageSize = perPage || 10;
    const skip = (page - 1) * pageSize;

    // Start benchmarking
    const startTime = performance.now();

    const [parcels, totalCount] = await prisma.$transaction([
      prisma.parcel.findMany({
        where: {
          user_id: userId,
          ...(wilaya ? { to_wilaya_name: { contains: wilaya } } : {}),
          ...(commune ? { to_commune_name: { contains: commune } } : {}),
          ...(isStopdesk ? { is_stopdesk: isStopdeskBool } : {}),
          ...(status ? { status: status } : {}),
          ...(doInsuranceBool !== undefined
            ? { do_insurance: doInsuranceBool }
            : {}),
        },
        orderBy: [
          { labels: { sort: "asc", nulls: "last" } }, // Sort by labels first, nulls last
          { id: "desc" }, // Reverse order by id (highest to lowest)
          { created_at: "desc" }, // Fallback to created_at
        ],
        skip: skip,
        take: pageSize,
      }),
      prisma.parcel.count({
        where: {
          user_id: userId,
          ...(wilaya ? { to_wilaya_name: { contains: wilaya } } : {}),
          ...(commune ? { to_commune_name: { contains: commune } } : {}),
          ...(isStopdesk ? { is_stopdesk: isStopdeskBool } : {}),
          ...(status ? { status: status } : {}),
          ...(doInsuranceBool !== undefined
            ? { do_insurance: doInsuranceBool }
            : {}),
        },
      }),
    ]);

    // End benchmarking
    const endTime = performance.now();
    const executionTime = endTime - startTime; // Time in milliseconds

    // Log the execution time
    // console.log(`Database query executed in ${executionTime.toFixed(2)} ms`);

    return NextResponse.json({
      data: parcels,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
      executionTime: executionTime.toFixed(2), // Optionally include in response
    });
  } catch (error) {
    console.error("Error fetching parcels:", error);
    return NextResponse.json(
      { error: "Failed to fetch parcels" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}