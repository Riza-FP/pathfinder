import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, MapPin, Moon, Utensils } from "lucide-react";
import { ActivityActionMenu } from "@/components/ActivityActionMenu";

// 1. Define Interfaces (Types)
export interface Activity {
    name: string;
    description: string;
    time: string; // e.g. "09:00 AM"
    cost: string; // e.g. "Free" or "Rp 50,000"
}

export interface DayPlan {
    day: number;
    date: string;
    activities: {
        morning: Activity;
        lunch: Activity;
        afternoon: Activity;
        dinner: Activity;
        evening: Activity;
    };
}

interface ItineraryDisplayProps {
    days: DayPlan[];
    onActivityUpdate?: (dayIndex: number, period: string, action: 'regenerate' | 'edit' | 'remove', data?: any) => void;
}

// 2. Component
export function ItineraryDisplay({ days, onActivityUpdate }: ItineraryDisplayProps) {
    if (!days || days.length === 0) return null;

    return (
        <div className="space-y-12 w-full">
            {/* Section Header */}
            <div className="flex items-center gap-4 text-emerald-900 border-b border-emerald-100 pb-4">
                <h2 className="text-3xl font-black tracking-tight transform -skew-x-6">Your Journey</h2>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-100/50 px-3 py-1 rounded-full">{days.length} Days</span>
            </div>

            {days.map((day, index) => (
                <div key={day.day} className="relative pl-0 md:pl-8 border-l-0 md:border-l-4 border-emerald-100 space-y-8">
                    {/* Day Marker */}
                    <div className="hidden md:flex absolute -left-[22px] top-0 h-10 w-10 bg-emerald-500 rounded-full items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30 z-10 border-4 border-emerald-50">
                        {day.day}
                    </div>

                    <Card className="overflow-hidden border-0 shadow-xl shadow-emerald-900/5 rounded-[2rem] bg-white group hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 pb-6 relative overflow-hidden">
                            {/* Decorative Circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />

                            <CardTitle className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold font-serif">Day {day.day}</span>
                                    <span className="text-emerald-100 font-medium text-lg opacity-90">{day.date}</span>
                                </div>
                                <span className="text-sm font-medium text-emerald-100 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 w-fit">
                                    Full Day Plan
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-emerald-50">
                                {/* Morning */}
                                <ActivityItem
                                    period="Morning"
                                    activity={day.activities.morning}
                                    color="text-amber-600"
                                    bgColor="bg-amber-50"
                                    icon={<Sun className="w-5 h-5 text-amber-500" />}
                                    onAction={(action) => onActivityUpdate?.(index, 'morning', action)}
                                />

                                {/* Lunch */}
                                <ActivityItem
                                    period="Lunch"
                                    activity={day.activities.lunch}
                                    color="text-orange-600"
                                    bgColor="bg-orange-50"
                                    icon={<Utensils className="w-5 h-5 text-orange-500" />}
                                    onAction={(action) => onActivityUpdate?.(index, 'lunch', action)}
                                />

                                {/* Afternoon */}
                                <ActivityItem
                                    period="Afternoon"
                                    activity={day.activities.afternoon}
                                    color="text-emerald-600"
                                    bgColor="bg-emerald-50"
                                    icon={<MapPin className="w-5 h-5 text-emerald-500" />}
                                    onAction={(action) => onActivityUpdate?.(index, 'afternoon', action)}
                                />

                                {/* Dinner */}
                                <ActivityItem
                                    period="Dinner"
                                    activity={day.activities.dinner}
                                    color="text-orange-700"
                                    bgColor="bg-orange-50"
                                    icon={<Utensils className="w-5 h-5 text-orange-600" />}
                                    onAction={(action) => onActivityUpdate?.(index, 'dinner', action)}
                                />

                                {/* Evening */}
                                <ActivityItem
                                    period="Evening"
                                    activity={day.activities.evening}
                                    color="text-indigo-600"
                                    bgColor="bg-indigo-50"
                                    icon={<Moon className="w-5 h-5 text-indigo-500" />}
                                    onAction={(action) => onActivityUpdate?.(index, 'evening', action)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}

// Helper Component for consistent styling
function ActivityItem({
    period,
    activity,
    color,
    bgColor,
    icon,
    onAction
}: {
    period: string,
    activity: Activity,
    color: string,
    bgColor: string,
    icon: React.ReactNode,
    onAction?: (action: 'regenerate' | 'edit' | 'remove') => void
}) {
    if (!activity) return null;

    return (
        <div className="group relative p-6 hover:bg-emerald-50/30 transition-colors flex gap-4 md:gap-6 items-start">
            <div className={`shrink-0 w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center shadow-sm`}>
                {icon}
            </div>
            <div className="space-y-2 flex-1 pr-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${color} border-${color.split('-')[1]}-200 bg-white font-bold px-2 py-0.5 rounded-md`}>
                            {period}
                        </Badge>
                        <span className="text-sm font-medium text-emerald-900/60 font-mono">
                            {activity.time}
                        </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                        {activity.cost}
                    </span>
                </div>

                <h4 className={`text-xl font-bold text-emerald-950`}>{activity.name}</h4>
                <p className="text-emerald-800/70 leading-relaxed text-sm">
                    {activity.description}
                </p>
            </div>

            {onAction && (
                <div className="absolute top-4 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActivityActionMenu
                        onRegenerate={() => onAction('regenerate')}
                        onEdit={() => onAction('edit')}
                        onRemove={() => onAction('remove')}
                    />
                </div>
            )}
        </div>
    );
}
