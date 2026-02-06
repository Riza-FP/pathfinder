"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

const DEFAULT_STEPS = [
    { text: "Searching best attractions...", duration: 3000 },
    { text: "Finding delicious restaurants...", duration: 3000 },
    { text: "Optimizing your route...", duration: 3000 },
    { text: "Finalizing itinerary...", duration: 2000 },
];

interface LoadingScreenProps {
    title?: string;
    steps?: { text: string; duration: number }[];
}

export function LoadingScreen({ title = "Planning your trip", steps = DEFAULT_STEPS }: LoadingScreenProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const stepsToRun = steps;

        const runSteps = (index: number) => {
            if (index >= stepsToRun.length) return;

            // Update progress for the current step
            setProgress(((index + 1) / stepsToRun.length) * 100);

            timeoutId = setTimeout(() => {
                if (index < stepsToRun.length - 1) {
                    setCurrentStep(index + 1);
                    runSteps(index + 1);
                }
            }, stepsToRun[index].duration);
        };

        // Small delay to ensure starting from 0 visual
        setTimeout(() => runSteps(0), 100);

        return () => clearTimeout(timeoutId);
    }, [steps]);

    return (
        <div className="fixed inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="relative mb-8">
                {/* Cloud 1 */}
                <div className="absolute top-2 -left-16 text-muted-foreground/30 animate-[cloud-pass_3s_linear_infinite]">☁️</div>
                {/* Cloud 2 */}
                <div className="absolute top-8 -right-16 text-muted-foreground/30 animate-[cloud-pass_4s_linear_infinite_reverse]">☁️</div>

                {/* Airplane */}
                <div className="relative z-10 p-4 bg-orange-100 rounded-full animate-bounce">
                    <Plane className="w-12 h-12 text-orange-500 transform -rotate-45" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-orange-600">
                    {title}
                </h3>
                <p className="text-orange-900/60 w-64">
                    {steps[currentStep]?.text || steps[steps.length - 1].text}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-orange-100 rounded-full mt-6 overflow-hidden">
                <div
                    className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
