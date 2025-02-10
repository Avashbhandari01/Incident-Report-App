import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

type RouteContext = { params: Promise<{ reportId: string }> };

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    // Check if the user is authenticated
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the params are resolved
    const { reportId } = await params; // Awaiting the params object
    
    // Extracting the status from the request body
    const { status } = await request.json();

    // Update the report in the database
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}