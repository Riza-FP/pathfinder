"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Correct hook for App Router params
import { supabase } from "@/lib/supabaseClient";
import { TripView, TripData } from "@/components/TripView";
import { DayPlan } from "@/components/ItineraryDisplay";
import { Budget } from "@/components/BudgetBreakdown";

import { toast } from "sonner";

export default function ItineraryPage() {
    const params = useParams(); // Get ID from URL
    const id = params?.id as string;

    const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
    const [budget, setBudget] = useState<Budget | null>(null);
    const [tripData, setTripData] = useState<TripData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('itineraries')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching trip:", error);
                toast.error("Could not load trip.");
                setIsLoading(false);
                return;
            }

            if (data) {
                setItinerary(data.itinerary_data);
                setBudget(data.budget_breakdown);
                setTripData({
                    destination: data.destination,
                    days: data.days,
                    budget: data.budget_breakdown?.total || 0,
                    currency: data.budget_breakdown?.currency || "IDR",
                    travelers: 1, // Defaulting as this might not be saved
                });

                // Corrections if we didn't save these fields:
                // We should probably update the `handleSave` in PlanPage to save everything in a cleaner JSON struct or dedicated cols.
                // For now, let's just show what we have.
            }
            setIsLoading(false);
        };

        fetchTrip();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="animate-pulse text-muted-foreground">Loading trip details...</p>
            </div>
        );
    }

    if (!itinerary || !tripData || !budget) {
        return <div className="text-center p-10">Trip not found.</div>;
    }

    return (
        <TripView
            tripData={tripData}
            itinerary={itinerary}
            budgetBreakdown={budget}
            isSaved={true}
        />
    );
}
