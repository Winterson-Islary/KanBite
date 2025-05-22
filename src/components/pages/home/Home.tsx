import Link from "next/link";
import { Button } from "../../ui/button";

function Home() {
	return (
		<main>
			<h1>This is the Home Page</h1>
			<div>
				<Button>
					<Link href={"/sign-in"}>Sign In</Link>
				</Button>
			</div>
		</main>
	);
}

export default Home;
