"use client";

import { AlertTriangle, TrendingDown, Wallet, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface BudgetWarningProps {
    currentBudget: number;
    estimatedCost: number;
    currency: string;
    onAdjustBudget: (newBudget: number) => void;
    onOptimizeCheaper: () => void;
    onShortenTrip: () => void;
    days: number;
}

export function BudgetWarning({
    currentBudget,
    estimatedCost,
    currency,
    onAdjustBudget,
    onOptimizeCheaper,
    onShortenTrip,
    days
}: BudgetWarningProps) {
    const diff = estimatedCost - currentBudget;
    const diffFormatted = diff.toLocaleString();
    const estFormatted = estimatedCost.toLocaleString();

    if (diff <= 0) return null;

    return (
        <Card className="border-orange-200 bg-orange-50/50 shadow-lg mb-8 animate-in slide-in-from-top-4 duration-500">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle className="text-lg font-bold">Budget Alert</CardTitle>
                </div>
                <CardDescription className="text-orange-900/80">
                    This itinerary is currently <strong>{diffFormatted} {currency}</strong> over your budget.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex justify-between items-center bg-white/60 p-3 rounded-lg border border-orange-100">
                    <div className="text-sm">
                        <p className="text-muted-foreground">Your Budget</p>
                        <p className="font-semibold text-emerald-700">{currentBudget.toLocaleString()} {currency}</p>
                    </div>
                    <div className="text-right text-sm">
                        <p className="text-muted-foreground">Est. Cost</p>
                        <p className="font-bold text-red-600">{estFormatted} {currency}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                        variant="outline"
                        className="bg-white border-orange-200 hover:bg-orange-100 text-orange-900 h-auto py-3 flex flex-col gap-1 items-start"
                        onClick={() => onAdjustBudget(estimatedCost)}
                    >
                        <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-orange-700">
                            <Wallet className="w-4 h-4" /> Raise Budget
                        </span>
                        <span className="text-xs text-left leading-tight opacity-80">
                            Update budget to match cost ({estFormatted})
                        </span>
                    </Button>

                    <Button
                        variant="outline"
                        className="bg-white border-orange-200 hover:bg-orange-100 text-orange-900 h-auto py-3 flex flex-col gap-1 items-start"
                        onClick={onOptimizeCheaper}
                    >
                        <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-orange-700">
                            <TrendingDown className="w-4 h-4" /> Find Cheaper
                        </span>
                        <span className="text-xs text-left leading-tight opacity-80">
                            Regenerate with budget options
                        </span>
                    </Button>

                    <Button
                        variant="outline"
                        className="bg-white border-orange-200 hover:bg-orange-100 text-orange-900 h-auto py-3 flex flex-col gap-1 items-start"
                        onClick={onShortenTrip}
                        disabled={days <= 1}
                    >
                        <span className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-orange-700">
                            <CalendarClock className="w-4 h-4" /> Shorten Trip
                        </span>
                        {days > 1 ? (
                            <span className="text-xs text-left leading-tight opacity-80">
                                Reduce to {days - 1} days to save money
                            </span>
                        ) : (
                            <span className="text-xs text-left leading-tight opacity-50">
                                Cannot shorten further
                            </span>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
