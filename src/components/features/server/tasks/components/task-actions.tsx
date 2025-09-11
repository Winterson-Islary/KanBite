import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

interface TaskActionsProps {
	id: string;
	projectId: string;
	children: React.ReactNode;
}

function TaskActions({ id, projectId, children }: TaskActionsProps) {
	return (
		<div className="flex justify-end">
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className="p-[10px] font-medium hover:cursor-pointer"
					>
						<ExternalLinkIcon className="mr-2 size-4 stroke-2" />
						Task Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className="p-[10px] font-medium hover:cursor-pointer"
					>
						<ExternalLinkIcon className="mr-2 size-4 stroke-2" />
						Open Project
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className="p-[10px] font-medium hover:cursor-pointer"
					>
						<PencilIcon className="mr-2 size-4 stroke-2" />
						Edit Task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
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
