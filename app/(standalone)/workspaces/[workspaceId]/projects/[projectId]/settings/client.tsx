"use client";

import { useGetProject } from "@/src/components/features/server/projects/api/use-get-project";
import UpdateProjectForm from "@/src/components/features/server/projects/components/update-project-form";
import { useProjectId } from "@/src/components/features/server/projects/hooks/use-project-id";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";

function ProjectIdSettingsClient() {
	const projectId = useProjectId();
	const { data, isLoading } = useGetProject({ projectId });
	if (isLoading) return <PageLoader />;
	if (!data) return <PageError message="Failed to load settings" />;

	return (
		<main className="w-full lg:max-w-xl">
			<UpdateProjectForm initialValues={data} />
		</main>
	);
}

export default ProjectIdSettingsClient;
