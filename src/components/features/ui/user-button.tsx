"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Loader, LogOut } from "lucide-react";
import { Separator } from "../../ui/separator";
import { useCurrent } from "../server/auth/api/auth/useCurrent";
import { useLogout } from "../server/auth/api/auth/useLogout";

export default function UserButton() {
	const { mutate: logout } = useLogout();
	const { data: user, isLoading } = useCurrent();
	if (!user) {
		return null;
	}
	const { name, email } = user;
	if (isLoading) {
		return (
			<div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
				<Loader className="size-4 animate-spin text-muted-foreground" />
			</div>
		);
	}
	const avatarFallback =
		(name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()) ??
		"U";

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outline-none relative hover:cursor-pointer">
				<Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
					<AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				side="bottom"
				sideOffset={10}
				className="w-60"
			>
				<article className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
					<header>
						<Avatar className="size-12 border border-neutral-300">
							<AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center">
								{avatarFallback}
							</AvatarFallback>
						</Avatar>
					</header>
					<main className="flex flex-col items-center justify-center">
						<h2 className="font-light">{name || "User"}</h2>
						<h3 className="font-extralight text-sm">{email || "Email"}</h3>
					</main>
					<Separator />
					<DropdownMenuItem
						className="flex gap-2 hover:cursor-pointer"
						onClick={() => logout()}
					>
						<LogOut className="size-5" />
						Logout
					</DropdownMenuItem>
				</article>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
