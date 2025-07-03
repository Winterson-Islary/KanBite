"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import { NavigationRoutes } from "./sidebar";
import UserButton from "./user-button";

function Navbar() {
	const pathname = usePathname();
	const pageDescription = NavigationRoutes.find(
		(item) => item.href === pathname,
	);
	return (
		<main className="py-2 flex items-center justify-between w-full">
			<section className="block lg:hidden">
				<MobileSidebar />
			</section>
			{/* <section>{GetNavLinks(NavbarLinks)}</section> */}
			<section className="flex items-center justify-end lg:justify-between w-full">
				<section id="left-side" className="hidden lg:block">
					<h1 className="text-3xl font-light">{pageDescription?.label}</h1>
					<h2 className="text-muted-foreground">{pageDescription?.desc}</h2>
				</section>
				<section id="right-side" className="">
					<UserButton />
				</section>
			</section>
		</main>
	);
}

export default Navbar;
