import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/components/features/server/auth/queries";
import SignUp from "@/src/components/pages/auth/SignUp";

async function SignUpPage() {
	const user = await getCurrentUser();
	console.log(user);
	if (user) redirect("/");
	return (
		<main>
			<SignUp />
		</main>
	);
}

export default SignUpPage;
