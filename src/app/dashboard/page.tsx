"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Compass } from "lucide-react";
import { toast } from "sonner";
import { UserNav } from "@/components/UserNav";

interface SavedItinerary {
    id: string;
    created_at: string;
    destination: string;
    days: number;
    budget_breakdown: { total: number; currency: string };
}

export default function Dashboard() {
    const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchItineraries = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                window.location.href = "/auth";
                return;
            }

            setUserEmail(user.email || "");

            const { data, error } = await supabase
                .from('itineraries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching trips:", error);
                toast.error("Failed to load your trips.");
            } else {
                setItineraries(data || []);
            }
            setIsLoading(false);
        };

        fetchItineraries();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-zinc-950">
                <p className="animate-pulse text-emerald-600 font-medium">Loading your adventures...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-emerald-50/50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-8">
                    <div className="flex">
                        <Link href="/" className="text-emerald-700/60 hover:text-emerald-800 flex items-center gap-2 text-sm font-medium transition-colors">
                            ← Back to Home
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-100 pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-emerald-950 tracking-tight font-serif">My Trips</h1>
                            <p className="text-emerald-600 font-medium mt-1 text-lg">Welcome back, {userEmail} 👋</p>
                        </div>
                        <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium">
                            Log Out
                        </Button>
                    </div>

                    {/* Grid */}
                    {itineraries.length === 0 ? (
                        <div className="text-center py-32 border-2 border-dashed rounded-[2.5rem] border-emerald-100 bg-white/50">
                            <div className="bg-emerald-100/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                                <Compass className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-900 mb-2">No trips planned yet</h3>
                            <p className="text-lg text-emerald-600/70 mb-8 max-w-md mx-auto">Start your journey by creating your first personalized itinerary.</p>
                            <Button asChild size="lg" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 shadow-xl shadow-orange-500/20">
                                <Link href="/plan">Start a New Adventure ✨</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {itineraries.map((trip) => (
                                <Card key={trip.id} className="group hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 border-0 overflow-hidden bg-white rounded-[2rem] ring-1 ring-emerald-100">
                                    <div className="h-48 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-emerald-900">
                                            {/* Use the local image as background */}
                                            <img
                                                src="/card-pattern.png"
                                                alt="Trip Pattern"
                                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/20 to-transparent z-10" />

                                        <div className="absolute bottom-4 left-6 z-20">
                                            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{trip.destination}</h3>
                                            <div className="flex items-center gap-2 text-emerald-100 font-medium text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(trip.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="bg-emerald-50 px-4 py-2 rounded-full text-emerald-700 font-bold text-sm">
                                                {trip.days} Days
                                            </div>
                                            <div className="text-emerald-900 font-bold">
                                                {trip.budget_breakdown?.currency || "IDR"} {trip.budget_breakdown?.total?.toLocaleString()}
                                            </div>
                                        </div>
                                        <Button className="w-full rounded-xl bg-white border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 font-bold h-12 transition-all" variant="secondary" asChild>
                                            <Link href={`/itinerary/${trip.id}`}>
                                                View Itinerary →
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Always show "Add New" card style button at the end of list if desired, implies user can add more */}
                            <Link href="/plan" className="group flex flex-col items-center justify-center gap-4 h-full min-h-[300px] rounded-[2rem] border-2 border-dashed border-emerald-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 group-hover:bg-orange-100 group-hover:text-orange-500 flex items-center justify-center transition-colors">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-emerald-700 group-hover:text-orange-700">Plan Another Trip</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
