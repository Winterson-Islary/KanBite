import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/src/styles/globals.css";
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
				<main>
					<QueryProvider>{children}</QueryProvider>
				</main>
			</body>
		</html>
	);
}
