"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TripView, TripData } from "@/components/TripView";
import { DayPlan } from "@/components/ItineraryDisplay";
import { Budget } from "@/components/BudgetBreakdown";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { MapLoadingScreen } from "@/components/MapLoadingScreen";
import { RegenerateModal } from "@/components/RegenerateModal";
import { Activity } from "@/components/ItineraryDisplay";
import { ManualEditModal } from "@/components/ManualEditModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const parseCost = (costStr: string | number | undefined | null): number => {
    if (costStr === null || costStr === undefined) return 0;
    const str = String(costStr);
    if (str.toLowerCase().includes("free")) return 0;

    // Handle ranges with various separators (hyphen, en-dash, em-dash, "to")
    // This prevents "50.000 - 100.000" from becoming "50000100000"
    const rangeSeparators = /[-–—]|\s+to\s+/i;
    if (rangeSeparators.test(str)) {
        const parts = str.split(rangeSeparators);
        const values = parts.map(p => parseInt(p.replace(/\D/g, "")) || 0);
        return Math.max(...values);
    }

    // Simple parsing: remove non-digits.
    const digits = str.replace(/\D/g, "");
    return parseInt(digits) || 0;
};

export default function PreviewPage() {
    const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
    const [budget, setBudget] = useState<Budget | null>(null);
    const [tripData, setTripData] = useState<TripData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Regeneration State
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
    const [alternatives, setAlternatives] = useState<Activity[]>([]);
    const [selectedContext, setSelectedContext] = useState<{ dayIndex: number, period: string } | null>(null);

    // Manual Edit State
    const [manualEditModalOpen, setManualEditModalOpen] = useState(false);
    const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

    // Delete Confirmation State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ dayIndex: number, period: string } | null>(null);

    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // Note: We ignore set-state-in-effect as this is a client-side hydration of local data
        const storedData = localStorage.getItem("currentTrip");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                setItinerary(parsed.itinerary);
                setBudget(parsed.budget);
                setTripData(parsed.formData);
            } catch (e) {
                console.error("Failed to parse trip data", e);
                toast.error("Invalid trip data.");
            }
        } else {
            // No data, redirect to plan
            router.push("/plan");
        }
        setIsLoading(false);
    }, [router]);

    const handleSave = async () => {
        if (!itinerary || !budget || !tripData) return;

        setIsSaving(true);

        // 1. Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            toast.error("Please sign in to save your trip!");
            setIsSaving(false);
            // The data is already in localStorage("currentTrip"), so just redirect
            router.push("/auth?redirect=/itinerary/preview");
            return;
        }

        // 2. Save
        const { data, error } = await supabase.from('itineraries').insert({
            user_id: user.id,
            destination: tripData.destination,
            days: tripData.days,
            itinerary_data: itinerary,
            budget_breakdown: budget
            // Note: We are losing 'travelers' and 'raw budget' here if columns don't exist.
            // But this matches current schema.
        }).select();

        if (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save trip. ' + error.message);
            setIsSaving(false);
        } else {
            toast.success('Trip saved successfully!');
            // Redirect to the real ID page
            if (data && data[0]) {
                router.push(`/itinerary/${data[0].id}`);
            }
            // If we redirect, we technically don't need to unset isSaving, but good practice if nav fails
        }
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete || !itinerary || !tripData) return;

        const { dayIndex, period } = itemToDelete;
        const currentDay = itinerary[dayIndex];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentActivity = (currentDay.activities as any)[period];

        const updatedItinerary = [...itinerary];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updatedItinerary[dayIndex].activities as any)[period] = {
            name: "Free Time",
            description: "Enjoy some leisure time to explore on your own.",
            time: currentActivity.time,
            cost: "Free"
        };
        setItinerary(updatedItinerary);

        // Update Budget
        if (budget) {
            const costToRemove = parseCost(currentActivity.cost);
            setBudget({
                ...budget,
                activities: Math.max(0, budget.activities - costToRemove),
                total: Math.max(0, budget.total - costToRemove)
            });
        }

        toast.success("Activity removed.");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const handleActivityUpdate = async (dayIndex: number, period: string, action: 'regenerate' | 'edit' | 'remove') => {
        if (!itinerary || !tripData) return;

        const currentDay = itinerary[dayIndex];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentActivity = (currentDay.activities as any)[period];

        if (action === 'remove') {
            setItemToDelete({ dayIndex, period });
            setDeleteDialogOpen(true);
            return;
        }

        if (action === 'regenerate') {
            setIsRegenerating(true);
            setRegenerateModalOpen(true);
            setSelectedContext({ dayIndex, period });
            setAlternatives([]); // clear previous

            try {
                const response = await fetch("/api/activity/regenerate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        destination: tripData.destination,
                        currentActivity: currentActivity,
                        preferences: tripData.interests, // Passing raw string interests
                        timeSlot: period
                    })
                });

                if (!response.ok) throw new Error("Failed to fetch suggestions");

                const data = await response.json();
                setAlternatives(data.alternatives || []);
            } catch (error) {
                console.error(error);
                toast.error("Failed to regenerate activity.");
                setRegenerateModalOpen(false);
            } finally {
                setIsRegenerating(false);
            }
        }

        if (action === 'edit') {
            setActivityToEdit(currentActivity);
            setSelectedContext({ dayIndex, period });
            setManualEditModalOpen(true);
        }
    };

    const parseCost = (costStr: string | number | undefined | null): number => {
        if (costStr === null || costStr === undefined) return 0;
        const str = String(costStr);
        if (str.toLowerCase().includes("free")) return 0;
        // Simple parsing: remove non-digits.
        const digits = str.replace(/\D/g, "");
        return parseInt(digits) || 0;
    };

    // ...

    const handleManualEditSave = (updatedActivity: Activity) => {
        try {
            if (!selectedContext || !itinerary) return;

            const { dayIndex, period } = selectedContext;

            // Validate context exists
            if (!itinerary[dayIndex]) {
                console.error("Day index out of bounds");
                return;
            }

            const currentDay = itinerary[dayIndex];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const oldActivity = (currentDay.activities as any)[period];

            if (!oldActivity) {
                console.error("Old activity not found");
                return;
            }

            const updatedItinerary = [...itinerary];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((updatedItinerary[dayIndex].activities as any)[period]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (updatedItinerary[dayIndex].activities as any)[period] = updatedActivity;
            } else {
                console.error("Activity slot not found for update");
                return;
            }

            setItinerary(updatedItinerary);
            setManualEditModalOpen(false);

            // Update Budget
            if (budget) {
                const oldCost = parseCost(oldActivity.cost);
                const newCost = parseCost(updatedActivity.cost);
                const diff = newCost - oldCost;

                setBudget({
                    ...budget,
                    activities: Math.max(0, budget.activities + diff),
                    total: Math.max(0, budget.total + diff)
                });

                const diffText = diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString();
                toast.success(`Activity updated! Budget: ${diffText}`);
            } else {
                toast.success("Activity updated!");
            }
        } catch (error) {
            console.error("Error saving manual edit:", error);
            toast.error("Failed to save changes. Please try again.");
        }
    };

    const handleAlternativeSelect = (newActivity: Activity) => {
        if (!selectedContext || !itinerary) return;

        const { dayIndex, period } = selectedContext;
        const currentDay = itinerary[dayIndex];
        const oldActivity = (currentDay.activities as any)[period];

        const updatedItinerary = [...itinerary];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updatedItinerary[dayIndex].activities as any)[period] = newActivity;

        setItinerary(updatedItinerary);
        setRegenerateModalOpen(false);

        // Update Budget
        if (budget) {
            const oldCost = parseCost(oldActivity.cost);
            const newCost = parseCost(newActivity.cost);
            const diff = newCost - oldCost;

            setBudget({
                ...budget,
                activities: Math.max(0, budget.activities + diff),
                total: Math.max(0, budget.total + diff)
            });

            // Show toast with diff
            const diffText = diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString();
            toast.success(`Activity updated! Budget: ${diffText}`);
        } else {
            toast.success("Activity updated!");
        }
    };

    if (isLoading) return <MapLoadingScreen />;

    if (!itinerary || !tripData || !budget) return null;

    return (
        <>
            <TripView
                tripData={tripData}
                itinerary={itinerary}
                budgetBreakdown={budget}
                onSave={handleSave}
                isSaving={isSaving}
                isPreview={true}
                onActivityUpdate={handleActivityUpdate}
            />

            <RegenerateModal
                isOpen={regenerateModalOpen}
                onClose={() => setRegenerateModalOpen(false)}
                isLoading={isRegenerating}
                alternatives={alternatives}
                onSelect={handleAlternativeSelect}
            />

            <ManualEditModal
                isOpen={manualEditModalOpen}
                onClose={() => setManualEditModalOpen(false)}
                activity={activityToEdit}
                onSave={handleManualEditSave}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-white dark:bg-zinc-900 border-none rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-emerald-950">Remove Activity?</AlertDialogTitle>
                        <AlertDialogDescription className="text-emerald-800/70">
                            This will replace the activity with a &quot;Free Time&quot; slot. You can regenerate it later if you change your mind.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full border-none hover:bg-emerald-50 text-emerald-700">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600 rounded-full px-6 font-bold">Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
