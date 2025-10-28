import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { useConfirm } from "@/src/hooks/useConfirm";
import ProjectAvatar from "../../projects/components/project-avatar";
import type { Project } from "../../projects/types/project";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useDeleteTask } from "../api/use-delete-task";
import type { Task } from "../types/task";

interface TaskBreadcrumbsProps {
	project: Project;
	task: Task;
}

function TaskBreadcrumbs({ project, task }: TaskBreadcrumbsProps) {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const { mutate, isPending } = useDeleteTask();
	const [ConfirmDialog, confirm] = useConfirm(
		"Delete task",
		"This action cannot be undone.",
	);
	const handleDeleteTask = async () => {
		const ok = await confirm();
		if (!ok) return;
		mutate(
			{ param: { taskId: task.$id } },
			{
				onSuccess: () => {
					router.push(`/workspaces/${workspaceId}/tasks`);
				},
			},
		);
	};
	return (
		<div className="flex items-center gap-x-2">
			<ConfirmDialog />
			<ProjectAvatar
				name={project.name}
				image={project.imageUrl}
				className="mr-2 size-6 lg:size-8"
			/>
			<Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
				<p className="font-semibold text-muted-foreground text-sm transition hover:opacity-75 lg:text-lg">
					{project.name}
				</p>
			</Link>
			<ChevronRightIcon className="size-4 text-muted-foreground lg:size-5" />
			<p className="font-semibold text-sm lg:text-lg">{task.name}</p>
			<Button
				className="ml-auto"
				size="sm"
				onClick={handleDeleteTask}
				disabled={isPending}
			>
				<TrashIcon className="size-4 lg:mr-2" />
				<span className="hidden lg:block">Delete Task</span>
			</Button>
		</div>
	);
}

export default TaskBreadcrumbs;
