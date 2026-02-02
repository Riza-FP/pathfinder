"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Plane, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // New state
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: username, // Save metadata
                        }
                    }
                });
                if (error) throw error;
                toast.success("Account created! You can now sign in.");
                setIsSignUp(false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success("Signed in successfully!");
                router.push("/"); // Redirect to home after login
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Column: Visuals */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative bg-emerald-900 text-white overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/hero-vector.png"
                        alt="Travel Landscape"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 to-emerald-900/90" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Plane className="w-6 h-6 text-orange-400" />
                        <span>Pathfinder</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg space-y-6">
                    <h1 className="text-5xl font-black font-serif leading-tight">
                        Start your <span className="text-orange-400">journey</span> with us today.
                    </h1>
                    <p className="text-lg text-emerald-100/80">
                        Join thousands of travelers planning their dream trips in seconds. AI-powered itineraries, tailored just for you.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-emerald-200/60">
                    &copy; 2024 Pathfinder Inc.
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="flex items-center justify-center bg-emerald-50 dark:bg-zinc-950 p-6 lg:p-12">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="text-center space-y-2 lg:text-left">
                        <Link href="/" className="lg:hidden inline-flex items-center gap-2 font-bold text-emerald-800 mb-8">
                            <Plane className="w-5 h-5 text-orange-500" /> Pathfinder
                        </Link>
                        <h2 className="text-3xl font-bold text-emerald-950 tracking-tight">
                            {isSignUp ? "Create an account" : "Welcome back"}
                        </h2>
                        <p className="text-emerald-700/70">
                            {isSignUp
                                ? "Enter your details to get started with your planning."
                                : "Please enter your details to sign in."}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {/* Username Field - Only for Sign Up */}
                        {isSignUp && (
                            <div className="space-y-2 animate-in slide-in-from-top-4 fade-in duration-300">
                                <Label htmlFor="username">Display Name</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Your Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required={isSignUp}
                                    className="bg-white border-emerald-100 focus:ring-emerald-500 h-11"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white border-emerald-100 focus:ring-emerald-500 h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                {!isSignUp && (
                                    <Link href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="bg-white border-emerald-100 focus:ring-emerald-500 h-11"
                            />
                        </div>

                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-lg transition-all duration-300 shadow-lg shadow-emerald-600/20" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSignUp ? "Sign Up" : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        </span>
                        <button
                            type="button"
                            className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
