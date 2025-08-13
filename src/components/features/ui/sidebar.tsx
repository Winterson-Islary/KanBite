"use client";
import { cn } from "@/lib/utils";
import { SettingsIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	GoCheckCircle,
	GoCheckCircleFill,
	GoHome,
	GoHomeFill,
} from "react-icons/go";
import { Separator } from "../../ui/separator";
import { useWorkspaceId } from "../server/workspaces/hooks/useWorkspaceId";
import Projects from "./projects";
import WorkspaceSwitcher from "./workspace-switcher";

export default function Sidebar() {
	return (
		<article className="h-full">
			<main className="h-full p-2.5 flex flex-col gap-3 bg-neutral-100">
				<header className="pb-3">
					<h1 className="text-4xl font-extralight">KanBite</h1>
				</header>
				<section className="flex flex-col gap-3">
					<Separator />
					<WorkspaceSwitcher />
					<Separator />
				</section>
				<Navigation />
				<Separator />
				<Projects />
			</main>
		</article>
	);
}

export const NavigationRoutes = [
	{
		label: "Home",
		href: "",
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
	const workspaceId = useWorkspaceId();
	const pathname = usePathname();
	return (
		<ul>
			{NavigationRoutes.map((route) => {
				const fullHref = `/workspaces/${workspaceId}${route.href}`;
				const isActive = pathname === fullHref;
				const Icon = isActive ? route.activeIcon : route.icon;
				return (
					<Link key={route.href} href={fullHref}>
						<main
							className={cn(
								"flex items-center gap-2.5 p-2 rounded-sm font-normal hover:text-primary transition text-neutral-500",
								isActive && "bg-white shadow-xs hover:opacity-100 text-primary",
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
