import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/src/styles/globals.css";
import Navbar from "@/src/components/features/ui/navbar";
import { QueryProvider } from "@/src/components/providers/queryProvider";

const inter = Inter({ subsets: ["latin"] });

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
			<body className={cn(inter.className, "antialiased")}>
				<main className="min-h-screen  max-w-screen-2xl mx-auto grid [grid-template-rows:auto_1fr_auto] px-[2rem] md:px-[5rem] lg:px-[10rem]">
					<header>
						<Navbar />
					</header>
					<article>
						<QueryProvider>{children}</QueryProvider>
					</article>
					<footer>Footer</footer>
				</main>
			</body>
		</html>
	);
}
