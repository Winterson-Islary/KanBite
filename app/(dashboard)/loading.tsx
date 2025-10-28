"use client";
import { Loader } from "lucide-react";

function LoadingPage() {
	return (
		<main className="grid h-full [grid-template-rows:1fr]">
			<article className="flex h-full items-center justify-center">
				<Loader className="size-6 animate-spin text-muted-foreground" />
			</article>
		</main>
	);
}

export default LoadingPage;
