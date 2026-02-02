import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

// Schema for the response structure we want the AI to return
const itinerarySchema = z.object({
    itinerary: z.array(z.object({
        day: z.number(),
        date: z.string(),
        activities: z.object({
            morning: z.object({
                name: z.string(),
                description: z.string(),
                time: z.string(),
                cost: z.string(),
            }),
            lunch: z.object({
                name: z.string(),
                description: z.string(),
                time: z.string(),
                cost: z.string(),
            }),
            afternoon: z.object({
                name: z.string(),
                description: z.string(),
                time: z.string(),
                cost: z.string(),
            }),
            dinner: z.object({
                name: z.string(),
                description: z.string(),
                time: z.string(),
                cost: z.string(),
            }),
            evening: z.object({
                name: z.string(),
                description: z.string(),
                time: z.string(),
                cost: z.string(),
            }),
        }),
    })),
    budget: z.object({
        accommodation: z.number(),
        food: z.number(),
        activities: z.number(),
        transport: z.number(),
        misc: z.number(),
        total: z.number(),
        currency: z.string(),
    })
});

export async function POST(req: Request) {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
        return Response.json({ error: "Invalid API Key: Please check .env.local" }, { status: 500 });
    }

    console.log("API Key loaded:", apiKey?.substring(0, 8) + "...");

    try {
        const body = await req.json();
        const { destination, days, budget, travelers, interests, pace, dateRange } = body;

        const prompt = `
      Plan a ${days}-day trip to ${destination} for ${travelers} people.
      Date Range: ${dateRange?.from} to ${dateRange?.to} (Calculate exact dates).
      
      Budget Limit: ${budget} IDR per person.
      IMPORTANT: This is a LIMIT, not a target. Minimize costs where possible while maintaining quality. 
      Do not try to spend the entire budget if cheaper good options exist.
      
      Pace: ${pace || "Moderate"}
      Travel Style/Interests: ${interests?.join(", ") || "General sightseeing, local food, culture"}.

      Generate a detailed day-by-day itinerary with:
      - Morning: Attraction/Activity
      - Lunch: Restaurant recommendation
      - Afternoon: Attraction/Activity
      - Dinner: Restaurant recommendation
      - Evening: Optional activity

      Ensure realistic timing (travel time considered) and variety in activities.
      Also provide a budget breakdown in IDR.
      IMPORTANT: All costs (activities, food, etc.) MUST be in IDR (Indonesian Rupiah), e.g. "Rp 50.000".
    `;

        const result = await generateObject({
            model: google("gemini-2.5-flash"),
            schema: itinerarySchema,
            prompt: prompt,
        });

        return Response.json(result.object);
    } catch (error) {
        console.error("AI Generation failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}
