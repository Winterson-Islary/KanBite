import Link from "next/link";
import { Button } from "../../ui/button";

function Home() {
	return (
		<main>
			<h1>This is the Home Page</h1>
			<div>
				<Link href={"/sign-in"}>
					<Button className="hover:cursor-pointer">Sign In</Button>
				</Link>
			</div>
		</main>
	);
}

export default Home;
