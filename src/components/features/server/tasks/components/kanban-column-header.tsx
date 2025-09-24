import { snakeCaseToTitleCase } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
	CircleCheckIcon,
	CircleDashedIcon,
	CircleDotDashedIcon,
	CircleDotIcon,
	CircleIcon,
	PlusIcon,
} from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { TaskStatus } from "../types/task-status";

interface KanbanColumnHeaderProps {
	board: TaskStatus;
	taskCount: number;
}
const statusIconMap: Record<TaskStatus, React.ReactNode> = {
	[TaskStatus.PENDING]: (
		<CircleDashedIcon className="size-[18px] text-pink-400" />
	),
	[TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
	[TaskStatus.DONE]: (
		<CircleCheckIcon className="size-[18px] text-emerald-400" />
	),
	[TaskStatus.IN_PROGRESS]: (
		<CircleDotDashedIcon className="size-[18px] text-yellow-400" />
	),
	[TaskStatus.IN_REVIEW]: (
		<CircleDotIcon className="size-[18px] text-blue-400" />
	),
};

function KanbanColumnHeader({ board, taskCount }: KanbanColumnHeaderProps) {
	const { open } = useCreateTaskModal();
	const icon = statusIconMap[board];
	return (
		<div className="flex items-center justify-between px-2 py-1.5">
			<div className="flex items-center gap-x-2">
				{icon}
				<h2 className="font-medium text-sm">{snakeCaseToTitleCase(board)}</h2>
				<div className="flex size-5 items-center justify-center rounded-md bg-neutral-200 font-medium text-neutral-700 text-xs">
					{taskCount}
				</div>
			</div>{" "}
			<Button
				onClick={open}
				variant="ghost"
				size="icon"
				className="size-5 hover:cursor-pointer"
			>
				<PlusIcon className="size-4 text-neutral-500" />
			</Button>
		</div>
	);
}

export default KanbanColumnHeader;
