import Link from "next/link";
import { Button } from "../../ui/button";

function SignIn() {
	return (
		<div>
			<h1>This Is The Sign-in Page</h1>
			<Button>
				<Link href={"/"}>Back</Link>
			</Button>
		</div>
	);
}

export default SignIn;
