"use client";


import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { ItineraryDisplay, DayPlan } from "@/components/ItineraryDisplay";
import { BudgetBreakdown, Budget } from "@/components/BudgetBreakdown";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { ArrowLeft, Save, Download, Calendar, Users, Wallet, Loader2, CloudSun, Sparkles, Share2 } from "lucide-react";

export interface TripData {
    destination: string;
    days: number;
    budget: number;
    travelers: number;
    currency?: string;
    interests?: string;
}

interface TripViewProps {
    tripData: TripData;
    itinerary: DayPlan[];
    budgetBreakdown: Budget;
    onSave?: () => void;
    isSaved?: boolean;
    isSaving?: boolean;
    isPreview?: boolean;
    onActivityUpdate?: (dayIndex: number, period: string, action: 'regenerate' | 'edit' | 'remove', data?: any) => void;
    weather?: {
        summary: string;
        temperature: string;
    };
    hotels?: Array<{
        name: string;
        address: string;
        description: string;
        price_per_night: string;
        currency: string;
        booking_url_query: string;
        category: string;
    }>;
    onRegenerate?: () => void;
    regenerationCount?: number;
}

export function TripView({ tripData, itinerary, budgetBreakdown, onSave, isSaved = false, isSaving = false, isPreview = false, onActivityUpdate, weather, hotels, onRegenerate, regenerationCount = 0 }: TripViewProps) {
    const router = useRouter();
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleBack = () => {
        if (isPreview && !isSaved) {
            setIsAlertOpen(true);
        } else {
            router.push(isPreview ? "/plan" : "/dashboard");
        }
    };

    const handleConfirmLeave = () => {
        router.push("/plan");
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => toast.success("Link copied to clipboard!"))
            .catch(() => toast.error("Failed to copy link."));
    };

    const handleExportPDF = () => {
        // ... (existing export logic)
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- HEADER ---
        doc.setFillColor(13, 148, 136); // Teal-600
        doc.rect(0, 0, pageWidth, 40, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(tripData.destination.toUpperCase(), 20, 20);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${tripData.days} Days Trip`, 20, 30);

        const currency = tripData.currency || "IDR";
        doc.text(`Budget: ${tripData.budget.toLocaleString()} ${currency}`, pageWidth - 20, 20, { align: "right" });
        doc.text(`Travelers: ${tripData.travelers}`, pageWidth - 20, 30, { align: "right" });

        // --- CONTENT ---
        let finalY = 50;

        itinerary.forEach((day) => {
            // Day Header
            doc.setFontSize(14);
            doc.setTextColor(13, 148, 136); // Teal
            doc.setFont("helvetica", "bold");

            if (finalY > 250) {
                doc.addPage();
                finalY = 20;
            }

            doc.text(`Day ${day.day}: ${day.date || ""}`, 14, finalY);
            finalY += 5;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tableBody: any[] = [];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const processActivity = (period: string, act: any) => {
                tableBody.push([
                    period,
                    act.time,
                    `${act.name}\n${act.description}`,
                    act.cost
                ]);
            };

            processActivity("Morning", day.activities.morning);
            processActivity("Lunch", day.activities.lunch);
            processActivity("Afternoon", day.activities.afternoon);
            processActivity("Dinner", day.activities.dinner);
            processActivity("Evening", day.activities.evening);

            autoTable(doc, {
                startY: finalY,
                head: [['Period', 'Time', 'Activity', 'Cost']],
                body: tableBody,
                theme: 'grid',
                headStyles: { fillColor: [13, 148, 136] },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 25 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 'auto' },
                    3: { cellWidth: 30, halign: 'right' }
                },
                styles: { fontSize: 10, cellPadding: 4 },
                margin: { top: 20 },
                didDrawPage: (data) => {
                    const pageCount = doc.getNumberOfPages();
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text('Generated by Pathfinder', data.settings.margin.left, doc.internal.pageSize.height - 10);
                    doc.text(`Page ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
                }
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            finalY = (doc as any).lastAutoTable.finalY + 15;
        });

        doc.save(`${tripData.destination}_Itinerary.pdf`);
        toast.success("PDF exported successfully!");
    };

    return (
        <div className="min-h-screen relative bg-emerald-50 dark:bg-zinc-950 overflow-hidden">
            {/* Detailed Vector Background */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-emerald-900/5 -skew-y-3 origin-top-left" />
                <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[100px]" />
                <div className="absolute top-40 -left-20 w-[300px] h-[300px] bg-teal-200/20 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
                {/* Nav */}
                <div className="mb-12 flex items-center justify-between">
                    <Button variant="ghost" onClick={handleBack} className="hover:bg-emerald-100/50 text-emerald-800 -ml-4 flex items-center gap-2 font-medium">
                        <ArrowLeft className="w-5 h-5" />
                        {isPreview ? "Back to Planning" : "Back to Dashboard"}
                    </Button>

                    <div className="flex gap-3">
                        {/* Share Button (Only visible if saved or in preview) */}
                        {isSaved && (
                            <Button onClick={handleShare} variant="outline" className="gap-2 border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 shadow-sm">
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        )}

                        <Button onClick={handleExportPDF} variant="outline" className="gap-2 border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 shadow-sm">
                            <Download className="w-4 h-4" />
                            PDF
                        </Button>
                        {onSave && (
                            <Button onClick={onSave} className="gap-2 rounded-full px-6 bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 font-bold transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100" disabled={isSaved || isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {isSaved ? "Saved" : "Save Trip"}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Header Card */}
                <div className="text-center mb-16 space-y-6 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-emerald-950 font-sans drop-shadow-sm leading-tight">
                        Trip to <span className="text-emerald-600">{tripData.destination}</span>
                    </h1>

                    <div className="flex flex-wrap justify-center gap-4 text-emerald-800/80 items-center font-medium">
                        <span className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-sm ring-1 ring-emerald-50">
                            <Calendar className="w-5 h-5 text-teal-600" /> {tripData.days} Days
                        </span>
                        <span className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-sm ring-1 ring-emerald-50">
                            <Users className="w-5 h-5 text-orange-500" /> {tripData.travelers} Travelers
                        </span>
                        <span className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-sm ring-1 ring-emerald-50">
                            <Wallet className="w-5 h-5 text-emerald-600" /> {tripData.budget.toLocaleString()} {tripData.currency || "IDR"}
                        </span>
                        {weather && (
                            <span className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full shadow-sm ring-1 ring-emerald-50" title={weather.summary}>
                                <CloudSun className="w-5 h-5 text-amber-500" /> {weather.temperature}
                            </span>
                        )}
                    </div>

                    {weather && (
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 max-w-2xl mx-auto mt-6">
                            <p className="text-emerald-800/80 text-sm italic">
                                "{weather.summary}"
                            </p>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <ItineraryDisplay days={itinerary} onActivityUpdate={onActivityUpdate} />

                        {/* Bottom Regeneration Action */}
                        {onRegenerate && isPreview && (
                            <div className="mt-12 bg-emerald-50/50 border border-emerald-100/50 rounded-3xl p-8 text-center space-y-4">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-emerald-950 text-lg">Not completely satisfied?</h3>
                                    <p className="text-emerald-800/60 text-sm">
                                        You can regenerate the entire itinerary to get a fresh plan.
                                    </p>
                                </div>
                                <Button
                                    onClick={onRegenerate}
                                    variant="outline"
                                    size="lg"
                                    disabled={regenerationCount >= 3}
                                    className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm rounded-full px-8 gap-2 font-bold"
                                >
                                    <Sparkles className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                                    {regenerationCount >= 3 ? "Limit Reached" : `Regenerate Trip (${3 - regenerationCount} left)`}
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1 lg:sticky lg:top-8 space-y-8">
                        {/* Hotels Section */}
                        {hotels && hotels.length > 0 && (
                            <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 overflow-hidden border-0">
                                <div className="bg-indigo-50 p-6 border-b border-indigo-100">
                                    <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                                        <span className="text-2xl">🏨</span> Where to Stay
                                    </h3>
                                </div>
                                <div className="divide-y divide-emerald-50">
                                    {hotels.map((hotel, index) => (
                                        <div key={index} className="p-6 space-y-4 hover:bg-emerald-50/30 transition-colors">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="text-base font-bold text-emerald-950 leading-tight">{hotel.name}</h4>
                                                    </div>
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg inline-block mb-1">
                                                        {hotel.category}
                                                    </span>
                                                    <p className="text-xs text-emerald-800/60">{hotel.address}</p>
                                                </div>
                                            </div>

                                            <p className="text-xs text-emerald-800/80 leading-relaxed line-clamp-3">
                                                {hotel.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-2">
                                                <span className="font-bold text-emerald-950 text-sm">
                                                    {hotel.price_per_night} <span className="text-[10px] text-emerald-900/40 font-normal">/ night</span>
                                                </span>
                                                <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 text-xs shadow-lg shadow-blue-500/20" asChild>
                                                    <a
                                                        href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.booking_url_query)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Book
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="p-4 bg-emerald-50/50 text-[10px] text-center text-emerald-900/30 border-t border-emerald-50">
                                    *Prices are estimates. We check external sites.
                                </p>
                            </div>
                        )}

                        <BudgetBreakdown budget={budgetBreakdown} budgetLimit={tripData.budget} />
                    </div>
                </div>
            </div>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="bg-white dark:bg-zinc-900 border-none rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-bold text-emerald-950">Discard Unsaved Changes?</AlertDialogTitle>
                        <AlertDialogDescription className="text-emerald-800/70">
                            You have unsaved changes. If you leave now, your current itinerary will be lost forever.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full border-none hover:bg-emerald-50 text-emerald-700">Stay</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmLeave} className="bg-orange-500 hover:bg-orange-600 rounded-full px-6 font-bold">Discard & Leave</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}
