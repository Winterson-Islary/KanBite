"use client";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarLinks = ["dashboard", "settings"];
function GetNavLinks(links: string[]) {
	return (
		<ul className="flex justify-around md:gap-5 lg:gap-10 font-light">
			{links.map((link) => (
				<li key={link}>
					<Link href={link}>{link}</Link>
				</li>
			))}
		</ul>
	);
}
function Navbar() {
	const pathname = usePathname();
	return (
		<main className="py-2 flex items-center justify-between">
			<section>
				<Link href={"/"} className="text-3xl font-light">
					KanBite
				</Link>
			</section>
			<section>{GetNavLinks(NavbarLinks)}</section>
			<section>
				<Button
					variant={"ghost"}
					asChild
					className="min-w-[100px] border-[1px] border-slate-300"
				>
					<Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
						{pathname === "/sign-in" ? "Sign up" : "Login"}
					</Link>
				</Button>
			</section>
		</main>
	);
}

export default Navbar;
