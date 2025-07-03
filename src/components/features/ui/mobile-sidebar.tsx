"use client";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
	const pathname = usePathname();

	const [isOpen, setIsOpen] = useState<boolean>(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant="secondary" className="lg:hidden hover:cursor-pointer">
					<MenuIcon className="size-4 text-neutral-500" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<Sidebar />
			</SheetContent>
		</Sheet>
	);
}
