import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

type RouteContext = { params: Promise<{ reportId: string }> };

export async function GET(
  request: Request,
  { params } : RouteContext
) {
  try {

    const report = await prisma.report.findUnique({
      where: {
        id: (await params).reportId,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report details:", error);
    return NextResponse.json(
      { error: "Failed to fetch report details" },
      { status: 500 }
    );
  }
}