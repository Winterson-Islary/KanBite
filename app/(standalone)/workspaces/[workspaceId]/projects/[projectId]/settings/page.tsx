import UpdateProjectForm from "@/src/components/features/server/projects/components/update-project-form";
import { getUserProject } from "@/src/components/features/server/projects/queries";
import React from "react";

interface ProjectIdSettingsPageProps {
	params: {
		projectId: string;
	};
}
async function ProjectIdSettingsPage({ params }: ProjectIdSettingsPageProps) {
	const { projectId } = params;
	const initialValues = await getUserProject({ projectId });
	return (
		<main className="w-full lg:max-w-xl">
			<UpdateProjectForm initialValues={initialValues} />
		</main>
	);
}

export default ProjectIdSettingsPage;
