# Pathfinder - Travel Itinerary Planner 🌍✈️

Pathfinder is an intelligent travel companion that helps you design the perfect getaway in seconds. Powered by Google's Gemini AI, it generates personalized day-by-day itineraries, estimates budgets, and presents everything in a beautiful, vector-rich interface.

## ✨ Features

-   **AI-Powered Planning**: Generates detailed daily schedules tailored to your interests, pace, and group size using the Vercel AI SDK and Gemini 2.5 Flash.
-   **Smart Budgeting**: Automatically estimates costs for accommodation, food, and activities, helping you stay within your limit.
-   **PDF Export**: Download your itinerary as a clean, printable PDF document.
-   **Modern UI**: Built with a "Travel Premium" aesthetic using Tailwind CSS, vector illustrations, and glassmorphism effects.
-   **Data Persistence**: Save your trips locally (and optionally to Cloud via Supabase).

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **AI Integration**: Google Gemini
-   **Database/Auth**: Supabase (Optional for saved trips)
-   **Icons**: Lucide React
-   **PDF Generation**: jsPDF & jspdf-autotable

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/Riza-FP/travel-itinerary-planner-app.git
cd TravelApp
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a copy of the example environment file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your API keys:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Note**: You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/) and Supabase keys from your [Supabase Dashboard](https://supabase.com/).

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
