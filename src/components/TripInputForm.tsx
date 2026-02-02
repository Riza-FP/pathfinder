"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, CalendarIcon } from "lucide-react"
import { format, differenceInDays } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// 1. Define Zod Schema
export const formSchema = z.object({
  destination: z.string().min(2, { message: "Destination must be at least 2 characters." }),
  startDate: z.date(),
  endDate: z.date(),
  budget: z.coerce.number().min(500000, { message: "Minimum budget is 500k IDR" }),
  travelers: z.coerce.number().min(1).max(10),
  pace: z.enum(["Relaxed", "Moderate", "Packed"]),
  interests: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Select at least one interest.",
  }),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date cannot be earlier than start date.",
  path: ["endDate"],
});

export type TripFormData = z.infer<typeof formSchema> & { days: number }; // Inject calculated days

const INTERESTS_LIST = [
  "Adventure", "Relaxation", "Culture", "Food", "History",
  "Art", "Nature", "Nightlife", "Shopping", "Photography"
]

interface TripInputFormProps {
  onSubmit: (values: TripFormData) => void;
  isLoading: boolean;
}

export function TripInputForm({ onSubmit, isLoading }: TripInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any, // Cast to any to resolve Zod v4/RHF type mismatch
    defaultValues: {
      destination: "",
      budget: 5000000,
      travelers: 2,
      pace: "Moderate",
      interests: [],
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate days
    const days = differenceInDays(values.endDate, values.startDate) + 1;
    onSubmit({ ...values, days });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-0 rounded-[2rem] overflow-hidden">
      <CardHeader className="p-8 pb-6 text-center border-b border-emerald-100/50">
        <CardTitle className="text-3xl font-black text-emerald-950 font-serif tracking-tight">Plan Your Dream Trip</CardTitle>
        <CardDescription className="text-lg text-emerald-700/80">Tell us your preferences and we&apos;ll handle the rest.</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Destination */}
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel className="text-emerald-900 font-bold ml-1">Where to?</FormLabel>
                    <FormControl>
                      <Input placeholder="Bali, Tokyo, Paris..." {...field} className="h-14 text-lg rounded-2xl border-emerald-100 bg-white shadow-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all placeholder:text-emerald-900/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-emerald-900 font-bold ml-1">Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-14 pl-4 text-left font-normal rounded-2xl border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 text-base transition-all",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "LLL dd, y")
                            ) : (
                              <span className="text-emerald-900/30">Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-5 w-5 opacity-40 text-emerald-900" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-emerald-100 shadow-xl bg-white text-sm" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-emerald-900 font-bold ml-1">End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-14 pl-4 text-left font-normal rounded-2xl border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 text-base transition-all",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "LLL dd, y")
                            ) : (
                              <span className="text-emerald-900/30">Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-5 w-5 opacity-40 text-emerald-900" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto min-w-[280px] p-0 rounded-2xl border-emerald-100 shadow-xl bg-white text-sm" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pace */}
              <FormField
                control={form.control}
                name="pace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-900 font-bold ml-1">Pace Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 rounded-2xl border-emerald-100 bg-white shadow-sm hover:bg-emerald-50 text-base focus:ring-emerald-500/20">
                          <SelectValue placeholder="Select pace" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-emerald-100 shadow-xl bg-white text-emerald-950 z-50">
                        <SelectItem value="Relaxed">Relaxed (Chill & Easy)</SelectItem>
                        <SelectItem value="Moderate">Moderate (Balanced)</SelectItem>
                        <SelectItem value="Packed">Packed (See Everything)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Travelers */}
              <FormField
                control={form.control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-900 font-bold ml-1">Travelers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        value={field.value || ""}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                        className="h-14 text-lg rounded-2xl border-emerald-100 bg-white shadow-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all text-center"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-emerald-900 font-bold ml-1">Budget (IDR)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/40 font-medium">Rp</span>
                        <Input
                          type="number"
                          step="500000"
                          {...field}
                          value={field.value || ""}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            field.onChange(isNaN(val) ? 0 : val);
                          }}
                          className="h-14 text-lg rounded-2xl border-emerald-100 bg-white shadow-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 transition-all pl-12"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Travel Styles (Interests) */}
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base text-emerald-900 font-bold ml-1">Travel Style</FormLabel>
                    <CardDescription className="ml-1 text-emerald-700/60">Select what applies to you.</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS_LIST.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                          const isSelected = field.value?.includes(item);
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-center space-x-0 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      )
                                  }}
                                  className="sr-only" // Hide the actual checkbox
                                />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "font-bold cursor-pointer text-sm px-6 py-3 rounded-full border-2 transition-all duration-200 select-none",
                                  isSelected
                                    ? "bg-orange-100 text-orange-700 border-orange-200 shadow-sm scale-105"
                                    : "bg-white text-zinc-600 border-zinc-100 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50"
                                )}
                              >
                                {item}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full py-8 text-xl font-bold rounded-full shadow-xl shadow-orange-500/20 bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
              <span className="text-white">{isLoading ? "Crafting your Journey..." : "Generate My Itinerary ✨"}</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}