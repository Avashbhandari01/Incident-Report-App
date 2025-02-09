"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeImage(image: string) {
  try {
    if (!image || !image.includes(",")) {
      return { error: "Invalid image format" };
    }

    const base64Data = image.split(",")[1];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze this emergency situation image and respond in this exact format:
    TITLE: [Brief title]
    TYPE: [One of: Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, or Other]
    DESCRIPTION: [Clear, concise description]`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
    ]);

    if (!result || !result.response) {
      return { error: "AI response is empty" };
    }

    const responseText = await result.response.text();

    if (!responseText) {
      return { error: "AI response is empty" };
    }

    const parsedData = responseText.split("\n").reduce(
      (acc, line) => {
        if (line.startsWith("TITLE:")) acc.title = line.replace("TITLE:", "").trim();
        else if (line.startsWith("TYPE:")) acc.reportType = line.replace("TYPE:", "").trim();
        else if (line.startsWith("DESCRIPTION:")) acc.description = line.replace("DESCRIPTION:", "").trim();
        return acc;
      },
      { title: "", reportType: "", description: "" }
    );

    return parsedData;
  } catch (error) {
    console.error("Image analysis error:", error);
    return { error: "Failed to analyze image" };
  }
}
