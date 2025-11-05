import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";

interface AnalyticsCardProps {
	title: string;
	value: number;
	variant: "up" | "down";
	increaseValue: number;
}

export default function AnalyticsCard(props: AnalyticsCardProps) {
	const iconColor =
		props.variant === "up" ? "text-emerald-500" : "text-red-500";
	const increaseValueColor =
		props.variant === "up" ? "text-emerald-500" : "text-red-500";
	const Icon = props.variant === "up" ? FaCaretUp : FaCaretDown;

	return (
		<Card className="flex h-full shrink-0 border-none shadow-none">
			<CardHeader>
				<div className="flex shrink-0 items-center gap-x-2.5">
					<CardDescription className="flex items-center gap-x-2 overflow-hidden font-medium">
						<span className="truncate text-base">{props.title}</span>
					</CardDescription>
					<div className="flex shrink-0 items-center gap-x-1">
						<Icon className={cn(iconColor, "size-4")} />
						<span
							className={cn(
								increaseValueColor,
								"truncate font-medium text-base",
							)}
						>
							{props.increaseValue}
						</span>
					</div>
				</div>
				<CardTitle className="3xl font-semibold">{props.value}</CardTitle>
			</CardHeader>
		</Card>
	);
}
