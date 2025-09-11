import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ExternalLinkIcon } from "lucide-react";

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
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className="p-[10px] font-medium"
					>
						<ExternalLinkIcon className="mr-2 size-4 stroke-2" />
						Task Details
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default TaskActions;
