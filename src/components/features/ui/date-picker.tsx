"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/src/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "../../ui/button";

interface DatePickerProps {
	value: Date | undefined;
	onChange: (date: Date) => void;
	className?: string;
	placeholder?: string;
}

export const DatePicker = ({
	value,
	onChange,
	className,
	placeholder = "Select date",
}: DatePickerProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="lg"
					className={cn(
						"w-full items-center justify-start px-3 text-left font-normal",
						!value && "text-muted-foreground",
						className,
					)}
				>
					<CalendarIcon className="h-3 w-3" />
					{value ? format(value, "PPP") : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="pointer-events-auto z-50 w-auto p-0">
				<Calendar
					mode="single"
					selected={value}
					onSelect={(date) => onChange(date as Date)}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
};
