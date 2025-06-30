import { getUserWorkspaces } from "@/src/components/features/server/workspaces/actions";
import { redirect } from "next/navigation";

export default async function HomePage() {
	const workspaces = await getUserWorkspaces();
	if (workspaces.total === 0) {
		redirect("/workspaces/create");
	} else {
		redirect(`/workspaces/${workspaces.documents[0].$id}`);
	}
}
