import { getWorkspaceById } from "@/src/components/features/server/workspaces/actions";
import UpdateWorkspaceForm from "@/src/components/features/server/workspaces/components/update-workspaces-form";
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
	if (!initialValues) redirect(`/workspaces/${workspaceId}`);

	return (
		<main className="w-full flex items-center justify-center">
			<div className="w-full sm:max-w-xl max-h-[85vh]">
				<UpdateWorkspaceForm initialValues={initialValues} />
			</div>
		</main>
	);
}

export default WorkspaceIdSettingsPage;
