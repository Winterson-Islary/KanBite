import { getCurrentUser } from "@/src/components/features/server/auth/queries";
import CreateWorkspaceForm from "@/src/components/features/server/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

async function WorkspaceCreatePage() {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");
	return (
		<main className="w-full lg:max-w-xl">
			<CreateWorkspaceForm />
		</main>
	);
}

export default WorkspaceCreatePage;
