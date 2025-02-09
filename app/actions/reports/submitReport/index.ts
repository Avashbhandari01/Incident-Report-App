"use server";
import prisma from "@/lib/prisma";
import { ReportType } from "@prisma/client";

export async function submitReport(formData: {
  reportId: string;
  type: string;
  specificType: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  status?: string;
}) {
  try {
    const report = await prisma.report.create({
      data: {
        reportId: formData.reportId,
        type: formData.type as ReportType,
        title: formData.title,
        description: formData.description,
        reportType: formData.specificType,
        location: formData.location,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        image: formData.image || null,
        status: formData.status || "PENDING",
      },
    });
    return {
      success: true,
      reportId: report.reportId,
      message: "Report submitted successfully",
    };
  } catch (error) {
    console.error("Error creating report:", error);
    return {
      success: false,
      error: "Failed to submit report",
      details: (error as any)?.message || "Unknown error",
    };
  }
}
