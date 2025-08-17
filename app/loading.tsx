"use client";
import { Loader } from "lucide-react";

function LoadingPage() {
	return (
		<main className="grid min-h-screen [grid-template-rows:1fr]">
			<article className="flex h-full flex-col items-center justify-center gap-y-2">
				<Loader className="size-7 animate-spin" />
				<p>Loading</p>
			</article>
		</main>
	);
}

export default LoadingPage;
