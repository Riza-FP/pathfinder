"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plane, MapPin } from "lucide-react";

interface LoadingStep {
    id: number;
    text: string;
    duration: number;
    coordinates: { x: number; y: number }; // Percentage positions on the map
}

const LOADING_STEPS: LoadingStep[] = [
    { id: 1, text: "Scanning destination...", duration: 2500, coordinates: { x: 20, y: 40 } },
    { id: 2, text: "Locating best attractions...", duration: 3000, coordinates: { x: 45, y: 30 } },
    { id: 3, text: "Checking flight routes...", duration: 2500, coordinates: { x: 60, y: 60 } },
    { id: 4, text: "Calculating local budget...", duration: 2500, coordinates: { x: 75, y: 35 } },
    { id: 5, text: "Finalizing your journey...", duration: 2000, coordinates: { x: 85, y: 45 } },
];

export function MapLoadingScreen() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const runSteps = (index: number) => {
            if (index >= LOADING_STEPS.length) return;

            timeoutId = setTimeout(() => {
                setCompletedSteps(prev => [...prev, LOADING_STEPS[index].id]);

                if (index < LOADING_STEPS.length - 1) {
                    setCurrentStepIndex(index + 1);
                    runSteps(index + 1);
                }
            }, LOADING_STEPS[index].duration);
        };

        runSteps(0);

        return () => clearTimeout(timeoutId);
    }, []);

    const currentStep = LOADING_STEPS[currentStepIndex];

    return (
        <div className="fixed inset-0 bg-emerald-50/90 backdrop-blur-md z-50 flex flex-col items-center justify-center overflow-hidden font-sans">
            {/* Background Map */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Image
                    src="/artifacts/subtle_world_map_vector_bg_1770004377408.png"
                    alt="World Map Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="relative w-full max-w-4xl aspect-[2/1] bg-white/40 border border-white/50 rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden p-8 flex items-center justify-center">

                {/* Text Status - Centered & Floating */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 px-8 py-3 rounded-full shadow-lg border border-emerald-100 flex items-center gap-3 z-20 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-950 font-bold tracking-wide text-lg min-w-[240px] text-center">
                        {currentStep.text}
                    </span>
                </div>

                {/* The Map & Path Layer */}
                <div className="relative w-full h-full">
                    {/* SVG Path Animation */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                                <stop offset="100%" stopColor="#059669" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                        {/* 
                            This path simulates a route across the map.
                            The 'pathLength' logic would ideally be dynamic, but for a constant animation we use CSS dasharray.
                        */}
                        <path
                            d="M 150,200 Q 300,50 450,150 T 750,250"
                            fill="none"
                            stroke="url(#pathGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="10 6"
                            className="drop-shadow-md animate-[dash_20s_linear_infinite]"
                        />
                        {/* Animated Plane following the path (Simplified for CSS: Translating a div instead of complex motion-path for MVP) */}
                    </svg>

                    {/* Dynamic Pins */}
                    {LOADING_STEPS.map((step, idx) => (
                        <div
                            key={step.id}
                            className={`absolute transition-all duration-700 ease-out transform
                                ${idx <= currentStepIndex ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-50'}`}
                            style={{
                                left: `${step.coordinates.x}%`,
                                top: `${step.coordinates.y}%`
                            }}
                        >
                            <div className="relative group">
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-4 bg-emerald-600 rounded-full" />
                                <div className={`p-2 rounded-full shadow-xl border-2 border-white text-white
                                    ${completedSteps.includes(step.id) ? 'bg-emerald-600' : 'bg-orange-500 animate-bounce'}`}>
                                    <MapPin className="w-5 h-5" fill="currentColor" />
                                </div>
                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs py-1 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {step.text}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Moving Plane (CSS Animation Approximation because pure SVG motion path is tricky without libs) */}
                    {/* We simulate movement by animating 'left' and 'top' based on the active step */}
                    <div
                        className="absolute z-10 transition-all duration-[2500ms] ease-linear"
                        style={{
                            left: `${currentStep.coordinates.x}%`,
                            top: `${currentStep.coordinates.y}%`,
                            transitionDuration: `${currentStep.duration}ms`
                        }}
                    >
                        <div className="bg-white p-2 rounded-full shadow-xl shadow-emerald-900/20 transform -translate-x-1/2 -translate-y-1/2 rotate-12">
                            <Plane className="w-8 h-8 text-emerald-600 fill-emerald-100" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Progress Bar at Bottom */}
            <div className="absolute bottom-12 w-96 max-w-[80%] h-1.5 bg-emerald-900/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                    className="h-full bg-orange-500 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    style={{ width: `${((currentStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
                />
            </div>

            <p className="absolute bottom-6 text-emerald-800/60 text-sm font-medium animate-pulse">
                Building your dream itinerary...
            </p>
        </div>
    );
}
