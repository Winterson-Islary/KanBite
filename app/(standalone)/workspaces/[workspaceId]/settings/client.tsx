"use client";

import { useGetWorkspace } from "@/src/components/features/server/workspaces/api/use-get-workspace";
import UpdateWorkspaceForm from "@/src/components/features/server/workspaces/components/update-workspace-form";
import { useWorkspaceId } from "@/src/components/features/server/workspaces/hooks/useWorkspaceId";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";

function WorkspaceSettingsClient() {
	const workspaceId = useWorkspaceId();
	const { data, isLoading } = useGetWorkspace({ workspaceId });
	if (isLoading) return <PageLoader />;
	if (!data) return <PageError message="Failed to get workspace" />;

	return (
		<div className="max-h-[85vh] w-full sm:max-w-xl">
			<UpdateWorkspaceForm initialValues={data} />
		</div>
	);
}

export default WorkspaceSettingsClient;
