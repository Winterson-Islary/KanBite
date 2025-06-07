import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import {
	GoCheckCircle,
	GoCheckCircleFill,
	GoHome,
	GoHomeFill,
} from "react-icons/go";

export default function Sidebar() {
	return (
		<article className="h-full">
			<main className="h-full p-2.5 flex-col gap-2 bg-neutral-100">
				<header className="pb-3">
					<h1 className="text-4xl font-extralight">KANBITE</h1>
				</header>
				<Navigation />
			</main>
		</article>
	);
}

export const NavigationRoutes = [
	{
		label: "Home",
		href: "/",
		icon: GoHome,
		activeIcon: GoHomeFill,
		desc: "Monitor all of your projects and tasks here",
	},
	{
		label: "My Tasks",
		href: "/tasks",
		icon: GoCheckCircle,
		activeIcon: GoCheckCircleFill,
		desc: "",
	},
	{
		label: "Settings",
		href: "/settings",
		icon: SettingsIcon,
		activeIcon: SettingsIcon,
		desc: "",
	},
	{
		label: "Members",
		href: "/members",
		icon: UsersIcon,
		activeIcon: UsersIcon,
		desc: "",
	},
];

function Navigation() {
	return (
		<ul>
			{NavigationRoutes.map((route) => {
				const isActive = false;
				const Icon = isActive ? route.activeIcon : route.icon;
				return (
					<Link key={route.href} href={route.href}>
						<main
							className={cn(
								"flex items-center gap-2.5 py-2.5 rounded-md font-normal hover:text-primary transition text-neutral-500",
								isActive && "bg-white shadow-sm hover:opacity-100 text-primary",
							)}
						>
							<Icon className="size-5 text-neutral-500" />
							<h1>{route.label}</h1>
						</main>
					</Link>
				);
			})}
		</ul>
	);
}
