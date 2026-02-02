import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { destination, currentActivity, preferences, timeSlot } = body;

        const alternativesSchema = z.object({
            alternatives: z.array(z.object({
                name: z.string(),
                description: z.string(),
                time: z.string(),
                cost: z.string()
            }))
        });

        const prompt = `
      You are an expert travel planner for ${destination}.
      The user wants to replace an activity in their itinerary.
      
      Current Activity: "${currentActivity.name}" (${currentActivity.description})
      Time Slot: ${timeSlot}
      User Preferences: ${preferences || "General tourist highlights"}
      
      Please suggest 3 distinct, high-quality alternative activities for this specific time slot in ${destination}.
      They should be different from the current activity but fit the same time slot logic.
      Keep descriptions punchy and under 20 words.
      
      Provide:
      - Name
      - Description
      - Time (Keep it: "${currentActivity.time}")
      - Cost (Estimated in IDR (Indonesian Rupiah), e.g. "Rp 50.000" or "Free")
    `;

        const result = await generateObject({
            model: google("gemini-2.5-flash"),
            schema: alternativesSchema,
            prompt: prompt,
        });

        return Response.json(result.object);

    } catch (error) {
        console.error("Regenerate API Error:", error);
        return Response.json(
            { error: "Failed to regenerate activity" },
            { status: 500 }
        );
    }
}
