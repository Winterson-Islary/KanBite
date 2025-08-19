import UpdateWorkspaceForm from "@/src/components/features/server/workspaces/components/update-workspace-form";
import { getWorkspaceById } from "@/src/components/features/server/workspaces/queries";
import { redirect } from "next/navigation";

type WorkspaceIdSettingsPageProps = {
	params: { workspaceId: string };
};

async function WorkspaceIdSettingsPage({
	params,
}: WorkspaceIdSettingsPageProps) {
	const { workspaceId } = await params;
	const initialValues = await getWorkspaceById({
		workspaceId,
	});

	return (
		<main className="flex w-full items-center justify-center">
			<div className="max-h-[85vh] w-full sm:max-w-xl">
				<UpdateWorkspaceForm initialValues={initialValues} />
			</div>
		</main>
	);
}

export default WorkspaceIdSettingsPage;
