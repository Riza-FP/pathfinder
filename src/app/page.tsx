"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Plane, Wallet, ArrowRight, Star, Palmtree, Landmark, Building2, Flower2, Compass, Ticket } from "lucide-react";
import { UserNav } from "@/components/UserNav";

const heroImages = [
  { src: "/hero-beach-real.png", alt: "Tropical Beach" },
  { src: "/hero-mountain.png", alt: "Mountain Lake" },
  { src: "/hero-kyoto.png", alt: "Kyoto Street" },
  { src: "/hero-santorini.png", alt: "Santorini View" },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">

      {/* 1. Hero Section */}
      <header className="relative w-full overflow-hidden bg-emerald-50/50 pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Logo (Absolute top left) */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-950 hover:opacity-80 transition-opacity">
            <Plane className="w-6 h-6 text-orange-500" />
            <span>Pathfinder</span>
          </Link>
        </div>

        {/* Navigation (Absolute top right) */}
        <div className="absolute top-6 right-6 z-20">
          <UserNav />
        </div>

        {/* Background Decor */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-bg-clouds.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-emerald-50/40 to-emerald-50/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">

            <h1 className="text-5xl md:text-7xl font-black text-emerald-950 tracking-tight leading-[1.1]">
              Your Dream Trip, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Planned in Seconds.
              </span>
            </h1>

            <p className="text-xl text-emerald-900/70 max-w-lg leading-relaxed">
              Stop spending weeks researching. Tell Pathfinder your budget and vibe, and get a complete personalized itinerary instantly.
            </p>

            <div className="flex gap-4 pt-2">
              <Button size="lg" className="text-lg px-8 h-14 rounded-full shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform bg-orange-500 hover:bg-orange-600 text-white font-bold" asChild>
                <Link href="/plan">
                  Start Planning Free
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative w-full max-w-lg aspect-[4/3] flex justify-center md:justify-end">
            {heroImages.map((img, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className={`absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl shadow-emerald-900/20 transition-all duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* 2. Why Pathfinder? (New Section) */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-900 border-b border-emerald-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/10 bg-emerald-50/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/why-us.png" alt="Smart Planning" className="w-full h-full object-contain" />
            <div className="absolute inset-0 ring-1 ring-inset ring-emerald-900/5 rounded-[3rem]" />
          </div>
          <div className="space-y-8">
            <div>
              <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
              <h2 className="text-4xl font-black text-emerald-950 mt-2 mb-4">Travel Planning, <br />Reimagined.</h2>
              <p className="text-lg text-emerald-900/70 leading-relaxed">
                Say goodbye to generic lists and messy spreadsheets. Pathfinder crafts trips that feel like they were planned by a local expert just for you.
              </p>
            </div>

            <div className="space-y-6">
              <FeatureRow
                icon={<Star className="w-6 h-6 text-orange-500 fill-orange-500" />}
                title="Hyper-Personalized"
                desc="Your pace, your budget, your interests. We don't do cookie-cutter."
              />
              <FeatureRow
                icon={<Wallet className="w-6 h-6 text-emerald-600" />}
                title="Budget Optimized"
                desc="We calculate costs in real-time so you never overspend."
              />
              <FeatureRow
                icon={<Compass className="w-6 h-6 text-teal-600" />}
                title="Instant Itineraries"
                desc="Get a complete day-by-day plan in seconds, not hours."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="relative py-24 px-6 bg-emerald-50/50 dark:bg-zinc-900/50 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-emerald-950">How It Works</h2>
            <p className="text-emerald-800/70">Three simple steps to your next adventure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<MapIcon className="w-10 h-10 text-teal-600" />}
              title="1. Choose Destination"
              description="Enter where you want to go, or let us surprise you based on your vibe."
            />
            <FeatureCard
              icon={<Wallet className="w-10 h-10 text-orange-600" />}
              title="2. Set Your Budget"
              description="We optimize every activity to fit your financial comfort zone perfectly."
            />
            <FeatureCard
              icon={<Plane className="w-10 h-10 text-blue-600" />}
              title="3. Get Your Plan"
              description="Receive a detailed day-by-day itinerary complete with hidden gems and local eats."
            />
          </div>
        </div>
      </section>

      {/* 3. Popular Destinations */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Trending Destinations</h2>
              <p className="text-muted-foreground">Most popular choices by travelers this week.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <DestinationCard
              name="Bali, Indonesia"
              image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80"
            />
            <DestinationCard
              name="Tokyo, Japan"
              image="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80"
            />
            <DestinationCard
              name="Paris, France"
              image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80"
            />
            <DestinationCard
              name="New York, USA"
              image="https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=600&q=80"
            />
          </div>
        </div>
      </section>

      {/* 5. About Us (New Section) */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm">About Pathfinder</span>
            <h2 className="text-4xl font-black text-emerald-950">Connecting the World,<br />One Trip at a Time.</h2>
            <div className="space-y-4 text-lg text-emerald-900/70 leading-relaxed">
              <p>
                We believe that travel is the best way to understand the world and ourselves. But mostly, planning it shouldn't be a headache.
              </p>
              <p>
                Pathfinder was born from a simple idea: what if you had a travel agent in your pocket who knew exactly what you liked? Since then, we've helped thousands of travelers explore new horizons.
              </p>
            </div>

          </div>
          <div className="order-1 md:order-2 relative h-[400px] w-full rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/10 rotate-2 hover:rotate-0 transition-transform duration-500 bg-emerald-50/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/about-us.png" alt="Our Community" className="w-full h-full object-contain" />
            <div className="absolute inset-0 ring-1 ring-inset ring-emerald-900/5 rounded-[3rem]" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-emerald-100 bg-emerald-50 text-center text-sm text-emerald-800/60">
        <p>&copy; 2024 Pathfinder.</p>
      </footer>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-emerald-100/50 rounded-lg shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-emerald-950 text-lg">{title}</h4>
        <p className="text-emerald-900/70">{desc}</p>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white dark:bg-zinc-800/50 hover:bg-emerald-50/50 dark:hover:bg-zinc-800 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 border border-emerald-100/50">
      <div className="p-4 bg-emerald-100/30 dark:bg-zinc-950 rounded-full shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-emerald-950">{title}</h3>
      <p className="text-emerald-800/70 leading-relaxed">{description}</p>
    </div>
  );
}

function DestinationCard({ name, image }: { name: string, image: string }) {
  return (
    <div className="group cursor-pointer relative overflow-hidden rounded-[2rem] aspect-[3/4] hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm opacity-90 font-medium flex items-center gap-2 mt-1">
          Plan Trip <ArrowRight className="w-4 h-4 bg-white/20 rounded-full p-0.5" />
        </p>
      </div>
    </div>
  )
}
