"use client";
import Link from "next/link";
import { useLogout } from "../../features/api/auth/useLogout";
import { Button } from "../../ui/button";

function Home() {
	const { mutate } = useLogout();
	const onClickLogout = () => {
		mutate();
	};
	return (
		<main>
			<h1>This is the Home Page</h1>
			<div>
				<Button
					asChild
					className="hover:cursor-pointer"
					onClick={onClickLogout}
				>
					Logout
				</Button>
			</div>
		</main>
	);
}

export default Home;
