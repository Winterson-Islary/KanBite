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
			<main className="flex h-full flex-col gap-3 bg-neutral-100 p-2.5">
				<header className="pb-3">
					<h1 className="font-extralight text-4xl">KanBite</h1>
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
								"flex items-center gap-2.5 rounded-sm p-2 font-normal text-neutral-500 transition hover:text-primary",
								isActive && "bg-white text-primary shadow-xs hover:opacity-100",
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
