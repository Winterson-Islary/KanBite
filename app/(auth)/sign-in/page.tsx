import { getCurrentUser } from "@/src/components/features/server/auth/queries";
import SignIn from "@/src/components/pages/auth/SignIn";
import { redirect } from "next/navigation";

async function SignInPage() {
	const user = await getCurrentUser();
	if (user) redirect("/");
	return (
		<main>
			<SignIn />
		</main>
	);
}

export default SignInPage;
