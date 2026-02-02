"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RefreshCw, Pencil, Trash2, Sparkles } from "lucide-react";

interface ActivityActionMenuProps {
    onRegenerate: () => void;
    onEdit: () => void;
    onRemove: () => void;
    isRegenerating?: boolean;
}

export function ActivityActionMenu({ onRegenerate, onEdit, onRemove, isRegenerating = false }: ActivityActionMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 text-emerald-900/40 hover:text-emerald-900">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] border-emerald-100 bg-white/95 backdrop-blur-sm">
                <DropdownMenuLabel className="text-emerald-900 text-xs uppercase tracking-wider opacity-60">Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={onRegenerate} disabled={isRegenerating} className="text-emerald-700 focus:bg-emerald-50 focus:text-emerald-900 gap-2 cursor-pointer">
                    {isRegenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-orange-500" />}
                    Regenerate with AI
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onEdit} className="text-emerald-700 focus:bg-emerald-50 focus:text-emerald-900 gap-2 cursor-pointer">
                    <Pencil className="h-4 w-4" />
                    Edit Manually
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-emerald-100/50" />

                <DropdownMenuItem onClick={onRemove} className="text-red-600 focus:bg-red-50 focus:text-red-700 gap-2 cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                    Remove Activity
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
