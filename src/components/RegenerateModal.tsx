"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Check } from "lucide-react";
import { Activity } from "@/components/ItineraryDisplay";

interface RegenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    alternatives: Activity[];
    onSelect: (activity: Activity) => void;
}

export function RegenerateModal({
    isOpen,
    onClose,
    isLoading,
    alternatives,
    onSelect,
}: RegenerateModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[85vh] bg-white dark:bg-zinc-900 border-none rounded-3xl overflow-hidden flex flex-col">
                <DialogHeader className="bg-emerald-50/50 p-6 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="bg-white border-orange-200 text-orange-700">AI Suggestions</Badge>
                    </div>
                    <DialogTitle className="text-2xl font-black text-emerald-950">Choose an Alternative</DialogTitle>
                    <DialogDescription className="text-emerald-800/70">
                        Select one of these curated options to replace your current activity.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4 overflow-y-auto">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center space-y-4 text-emerald-800/60 animate-in fade-in">
                            <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
                            <p className="font-medium animate-pulse">Consulting local experts...</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {alternatives.map((alt, index) => (
                                <Card
                                    key={index}
                                    className="cursor-pointer hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all border-emerald-100 group"
                                    onClick={() => onSelect(alt)}
                                >
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg text-emerald-950">{alt.name}</h4>
                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100">{alt.cost}</Badge>
                                            </div>
                                            <p className="text-sm text-emerald-800/70 mt-1 leading-relaxed">{alt.description}</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 self-center transition-opacity text-emerald-600">
                                            <Check className="w-6 h-6" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
