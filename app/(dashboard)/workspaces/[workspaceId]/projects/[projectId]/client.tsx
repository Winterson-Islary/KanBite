"use client";

import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useGetProject } from "@/src/components/features/server/projects/api/use-get-project";
import ProjectAvatar from "@/src/components/features/server/projects/components/project-avatar";
import { useProjectId } from "@/src/components/features/server/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/src/components/features/server/tasks/components/task-view-switcher";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";
import { Button } from "@/src/components/ui/button";

function ProjectIdClient() {
	const projectId = useProjectId();
	const { data, isLoading } = useGetProject({ projectId });
	if (isLoading) return <PageLoader />;
	if (!data) return <PageError message="Project not found" />;

	return (
		<main className="flex flex-col gap-y-4">
			<div className="mb-5 flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<ProjectAvatar
						name={data.name}
						image={data.imageUrl}
						className="size-8"
					/>
					<p className="font-semibold text-lg">{data.name}</p>
				</div>
				<div>
					<Button variant="ghost" asChild>
						<Link
							href={`/workspaces/${data.workspaceId}/projects/${data.$id}/settings`}
						>
							<PencilIcon className="size-4" />
							Edit Project
						</Link>
					</Button>
				</div>
			</div>
			<div>
				<TaskViewSwitcher hideProjectFilter initialProjectIdValue={projectId} />
			</div>
		</main>
	);
}

export default ProjectIdClient;
