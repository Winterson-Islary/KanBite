"use client";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

function ErrorPage() {
	return (
		<main className="grid h-full [grid-template-rows:1fr]">
			<article className="flex h-full flex-col items-center justify-center gap-y-4">
				<AlertTriangle className="size-7" />
				<p className="text-md text-muted-foreground">Something went wrong</p>
				<Button asChild size="sm">
					<Link href="/">Back to home</Link>
				</Button>
			</article>
		</main>
	);
}

export default ErrorPage;
