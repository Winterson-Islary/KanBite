"use client";

import Link from "next/link";
import UserButton from "./user-button";

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
	return (
		<main className="py-2 flex items-center justify-between">
			<section>
				<Link href={"/"} className="text-3xl font-light">
					KanBite
				</Link>
			</section>
			{/* <section>{GetNavLinks(NavbarLinks)}</section> */}
			<section>
				<UserButton />
			</section>
		</main>
	);
}

export default Navbar;
