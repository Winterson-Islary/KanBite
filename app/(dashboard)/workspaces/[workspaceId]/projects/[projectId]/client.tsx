"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useGetProject } from "@/src/components/features/server/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/src/components/features/server/projects/api/use-get-project-analytics";
import ProjectAvatar from "@/src/components/features/server/projects/components/project-avatar";
import { useProjectId } from "@/src/components/features/server/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/src/components/features/server/tasks/components/task-view-switcher";
import Analytics from "@/src/components/features/ui/analytics";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";
import { Button } from "@/src/components/ui/button";

function ProjectIdClient() {
	const projectId = useProjectId();
	const { data: project, isLoading: isLoadingProject } = useGetProject({
		projectId,
	});
	const { data: analytics, isLoading: isLoadingAnalytics } =
		useGetProjectAnalytics({ projectId });

	const isLoading = isLoadingProject || isLoadingAnalytics;

	if (isLoading) return <PageLoader />;
	if (!project) return <PageError message="Project not found" />;
	console.log("Analytics: ", analytics);
	return (
		<main className="flex w-full flex-col gap-y-4">
			<div className="mb-5 flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<ProjectAvatar
						name={project.name}
						image={project.imageUrl}
						className="size-8"
					/>
					<p className="font-semibold text-lg">{project.name}</p>
				</div>
				<div>
					<Button variant="ghost" asChild>
						<Link
							href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
						>
							<PencilIcon className="size-4" />
							Edit Project
						</Link>
					</Button>
				</div>
			</div>
			<div className="flex flex-col gap-y-4">
				{analytics ? <Analytics data={analytics} /> : null}
				<TaskViewSwitcher hideProjectFilter initialProjectIdValue={projectId} />
			</div>
		</main>
	);
}

export default ProjectIdClient;
