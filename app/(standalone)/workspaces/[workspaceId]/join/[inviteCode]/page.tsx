import JoinWorkspaceFrom from "@/src/components/features/server/workspaces/components/join-workspace-form";
import { getWorkspaceById } from "@/src/components/features/server/workspaces/queries";
import { redirect } from "next/navigation";

type WorkspaceIdJoinPageProps = {
	params: { workspaceId: string };
};
async function WorkspaceIdJoinPage({ params }: WorkspaceIdJoinPageProps) {
	const initialValues = await getWorkspaceById({
		workspaceId: params.workspaceId,
	});
	if (!initialValues) redirect("/");
	return (
		<main className="mx-auto h-full w-full lg:max-w-xl">
			<JoinWorkspaceFrom initialValues={initialValues} />
		</main>
	);
}

export default WorkspaceIdJoinPage;
