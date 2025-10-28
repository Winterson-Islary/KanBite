import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/components/features/server/auth/queries";
import SignIn from "@/src/components/pages/auth/SignIn";

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
