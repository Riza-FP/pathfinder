import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, PieChart, Hotel, Utensils, Ticket, Car, ShoppingBag } from "lucide-react";

// 1. Define Data Interface
export interface Budget {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    misc: number;
    total: number;
    currency: string; // e.g. "IDR"
}

interface BudgetBreakdownProps {
    budget: Budget;
    budgetLimit?: number;
}

export function BudgetBreakdown({ budget, budgetLimit }: BudgetBreakdownProps) {
    const categories = [
        { key: 'accommodation', label: 'Accommodation', icon: <Hotel className="w-5 h-5 text-indigo-500" /> },
        { key: 'food', label: 'Food', icon: <Utensils className="w-5 h-5 text-orange-500" /> },
        { key: 'activities', label: 'Activities', icon: <Ticket className="w-5 h-5 text-pink-500" /> },
        { key: 'transport', label: 'Transport', icon: <Car className="w-5 h-5 text-blue-500" /> },
        { key: 'misc', label: 'Misc', icon: <ShoppingBag className="w-5 h-5 text-emerald-500" /> },
    ] as const;

    const isOverBudget = budgetLimit && budget.total > budgetLimit;
    const overAmount = budgetLimit ? budget.total - budgetLimit : 0;

    return (
        <Card className="overflow-hidden border-0 shadow-xl shadow-emerald-900/5 rounded-[2rem] bg-white lg:sticky lg:top-8">
            <CardHeader className="bg-orange-50 p-6 border-b border-orange-100">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-orange-800">
                    <Wallet className="w-6 h-6 text-orange-500" />
                    Estimated Costs
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {categories.map((item) => (
                        <div key={item.key} className="flex justify-between items-center pb-3 border-b border-dashed border-emerald-100 last:border-0 last:pb-0 hover:bg-emerald-50/50 p-2 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-50">
                                    {item.icon}
                                </div>
                                <span className="font-medium text-emerald-900/70">{item.label}</span>
                            </div>
                            <div className="font-bold text-emerald-950">
                                {budget.currency} {budget[item.key as keyof typeof budget]?.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-orange-100">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-orange-800/60 flex items-center gap-2">
                            Total
                        </span>
                        <span className={`text-2xl font-black ${isOverBudget ? "text-red-500" : "text-orange-600"}`}>
                            {budget.currency} {budget.total.toLocaleString()}
                        </span>
                    </div>
                </div>

                {isOverBudget && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-bottom-2">
                        <div className="p-2 bg-red-100 rounded-full text-red-600">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-700 text-sm">Over Budget Warning</h4>
                            <p className="text-xs text-red-600/80 mt-1">
                                You are <span className="font-bold">{budget.currency} {overAmount.toLocaleString()}</span> over your limit of {budget.currency} {budgetLimit?.toLocaleString()}.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
