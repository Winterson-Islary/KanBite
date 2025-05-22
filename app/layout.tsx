import type { Metadata } from "next";
import "@/src/styles/globals.css";
import Navbar from "@/src/components/ui/navbar";

export const metadata: Metadata = {
	title: "Kanbite",
	description: "Bite-sized control over your entire Kanban workflow",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<main className="min-h-screen grid [grid-template-rows:auto_1fr_auto] px-[2rem] md:px-[5rem] lg:px-[10rem]">
					<header>
						<Navbar />
					</header>
					<article>{children}</article>
					<footer>Footer</footer>
				</main>
			</body>
		</html>
	);
}
