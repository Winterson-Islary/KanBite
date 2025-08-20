import ProjectAvatar from "@/src/components/features/server/projects/components/project-avatar";
import { getUserProject } from "@/src/components/features/server/projects/queries";
import TaskViewSwitcher from "@/src/components/features/server/tasks/components/task-view-switcher";
import { Button } from "@/src/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

type ProjectIdPageProps = {
	params: { projectId: string };
};

async function ProjectIdPage({ params }: ProjectIdPageProps) {
	const { projectId } = await params;
	const initialValues = await getUserProject({ projectId });
	return (
		<main className="flex flex-col gap-y-4">
			<div className="mb-5 flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<ProjectAvatar
						name={initialValues.name}
						image={initialValues.imageUrl}
						className="size-8"
					/>
					<p className="font-semibold text-lg">{initialValues.name}</p>
				</div>
				<div>
					<Button variant="ghost" asChild>
						<Link
							href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
						>
							<PencilIcon className=" size-4" />
							Edit Project
						</Link>
					</Button>
				</div>
			</div>
			<div>
				<TaskViewSwitcher />
			</div>
		</main>
	);
}

export default ProjectIdPage;
