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

    console.log('isStopdesk: ', isStopdesk);
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

    const pageSize = perPage;
    const skip = (page - 1) * pageSize;

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
        orderBy: {
          created_at: "desc",
        },
        skip: skip,
        take: pageSize,
        // select: {
        //   firstname: true,
        //   familyname: true,
        //   tracking: true,
        //   to_commune_name: true,
        //   to_wilaya_name: true,
        //   is_stopdesk: true,
        //   do_insurance: true,
        //   status: true,
        //   price: true,
        //   freeshipping: true,
        //   product_list: true,
        // },
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

    return NextResponse.json({
      data: parcels,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
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
