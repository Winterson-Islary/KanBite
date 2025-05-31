"use client";
import { useCurrent } from "@/src/components/features/api/auth/useCurrent";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Home from "@/src/components/pages/home/Home";

export default function HomePage() {
	const router = useRouter();
	const { data, isLoading } = useCurrent();
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (!data && !isLoading) {
			router.push("/sign-in");
		}
	}, [data, isLoading]);
	return (
		<main>
			<Home />
		</main>
	);
}
