"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "@/components/ItineraryDisplay";
import { Edit3 } from "lucide-react";

interface ManualEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    activity: Activity | null;
    onSave: (updatedActivity: Activity) => void;
}

export function ManualEditModal({
    isOpen,
    onClose,
    activity,
    onSave,
}: ManualEditModalProps) {
    const [formData, setFormData] = useState<Activity>({
        name: "",
        description: "",
        time: "",
        cost: "",
    });

    useEffect(() => {
        if (activity) {
            setFormData(activity);
        }
    }, [activity]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    if (!activity) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border-none rounded-3xl overflow-hidden">
                <DialogHeader className="bg-orange-50/50 p-6 pb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                            <Edit3 className="w-5 h-5" />
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-black text-emerald-950">Edit Activity</DialogTitle>
                    <DialogDescription className="text-emerald-800/70">
                        Manually update the details for this slot.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-emerald-900">Activity Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-emerald-50/50 border-emerald-100 focus:ring-orange-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time" className="text-emerald-900">Time</Label>
                        <Input
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="bg-emerald-50/50 border-emerald-100 focus:ring-orange-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cost" className="text-emerald-900">Cost (IDR)</Label>
                        <Input
                            id="cost"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            placeholder="e.g. Rp 50.000"
                            className="bg-emerald-50/50 border-emerald-100 focus:ring-orange-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-emerald-900">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="bg-emerald-50/50 border-emerald-100 focus:ring-orange-500 min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <Button variant="ghost" onClick={onClose} className="hover:bg-emerald-50 text-emerald-700">Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-6">
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
