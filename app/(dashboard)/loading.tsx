"use client";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, Loader } from "lucide-react";
import Link from "next/link";

function LoadingPage() {
	return (
		<main className="grid h-full [grid-template-rows:1fr]">
			<article className="flex h-full items-center justify-center">
				<Loader className="size-7 animate-spin text-muted-foreground" />
			</article>
		</main>
	);
}

export default LoadingPage;
