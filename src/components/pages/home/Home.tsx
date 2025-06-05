import { redirect } from "next/navigation";
import { getCurrentUser } from "../../features/server/auth/actions";
import UserButton from "../../features/ui/user-button";

async function Home() {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");
	return (
		<main>
			<h1>This is the Home Page</h1>
		</main>
	);
}

export default Home;
