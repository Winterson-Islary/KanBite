"use client";

import { useGetWorkspace } from "@/src/components/features/server/workspaces/api/use-get-workspace";
import JoinWorkspaceFrom from "@/src/components/features/server/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/src/components/features/server/workspaces/hooks/useWorkspaceId";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";

function WorkspaceIdJoinPage() {
	const workspaceId = useWorkspaceId();
	const { data, isLoading } = useGetWorkspace({
		workspaceId,
	});
	if (isLoading) return <PageLoader />;
	if (!data) return <PageError message="Failed to load join page" />;

	return (
		<main className="mx-auto h-full w-full lg:max-w-xl">
			<JoinWorkspaceFrom initialValues={data} />
		</main>
	);
}

export default WorkspaceIdJoinPage;
