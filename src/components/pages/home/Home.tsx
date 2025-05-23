import Link from "next/link";
import { Button } from "../../ui/button";

function Home() {
	return (
		<main>
			<h1>This is the Home Page</h1>
			<div>
				<Button asChild className="hover:cursor-pointer">
					<Link href={"/sign-in"}>Sign In</Link>
				</Button>
			</div>
		</main>
	);
}

export default Home;
