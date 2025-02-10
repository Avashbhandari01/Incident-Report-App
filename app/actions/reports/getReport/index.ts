"use server";
import prisma from "@/lib/prisma";

export async function getReportDetails(reportId: string) {
    try {
      const report = await prisma.report.findUnique({
        where: { reportId: reportId },
      });
  
      if (!report) {
        throw new Error("Report not found");
      }
  
      return report;
    } catch (error) {
      console.error("Error fetching report details:", error);
      throw new Error("Failed to fetch report details");
    }
  }
