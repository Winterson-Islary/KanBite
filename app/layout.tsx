import type { Metadata } from "next";
import "@/src/styles/globals.css";
import { QueryProvider } from "@/src/components/providers/queryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

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
			<body className="font-inter">
				<main className="min-h-screen">
					<Toaster style={{ fontFamily: "inherit" }} />
					<QueryProvider>
						<NuqsAdapter>{children}</NuqsAdapter>
					</QueryProvider>
				</main>
			</body>
		</html>
	);
}
