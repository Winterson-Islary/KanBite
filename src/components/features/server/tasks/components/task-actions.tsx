import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useConfirm } from "@/src/hooks/useConfirm";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useDeleteTask } from "../api/use-delete-task";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";

interface TaskActionsProps {
	id: string;
	projectId: string;
	children: React.ReactNode;
}

function TaskActions({ id, projectId, children }: TaskActionsProps) {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const { open } = useUpdateTaskModal();
	const { mutate: deleteTask, isPending: deleteTaskPending } = useDeleteTask();
	const [ConfirmDialog, confirm] = useConfirm(
		"Delete task",
		"This action cannot be undone",
	);
	const onDelete = async () => {
		const ok = await confirm();
		if (!ok) return;
		deleteTask({ param: { taskId: id } });
	};
	const onOpenTask = () => {
		router.push(`/workspaces/${workspaceId}/tasks/${id}`);
	};
	const onOpenProject = () => {
		router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
	};
	return (
		<div className="flex justify-end">
			<ConfirmDialog />
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem
						onClick={onOpenTask}
						className="p-[10px] font-medium hover:cursor-pointer"
					>
						<ExternalLinkIcon className="mr-2 size-4 stroke-2" />
						Task Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={onOpenProject}
						className="p-[10px] font-medium hover:cursor-pointer"
					>
						<ExternalLinkIcon className="mr-2 size-4 stroke-2" />
						Open Project
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => open(id)}
						className="p-[10px] font-medium hover:cursor-pointer"
					>
						<PencilIcon className="mr-2 size-4 stroke-2" />
						Edit Task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={onDelete}
						disabled={deleteTaskPending}
						className="p-[10px] font-medium hover:cursor-pointer"
					>
						<TrashIcon className="mr-2 size-4 stroke-2" />
						Delete Task
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default TaskActions;
