import { Separator } from "@/src/components/ui/separator";
import { MoreHorizontal } from "lucide-react";
import MemberAvatar from "../../members/components/member-avatar";
import ProjectAvatar from "../../projects/components/project-avatar";
import type { Task } from "../types/task";
import TaskActions from "./task-actions";
import TaskDate from "./task-date";

interface KanbanCardProps {
	task: Task;
}

function KanbanCard({ task }: KanbanCardProps) {
	return (
		<div className="mb-1.5 space-y-3 rounded bg-white p-2.5 shadow-sm">
			<div className="flex items-center justify-between gap-x-1.5">
				<div className="flex items-center gap-x-1.5">
					<ProjectAvatar
						name={task.project.name}
						image={task.project.imageUrl}
						fallbackClassname="text-[10px]"
					/>
					<span className="font-medium text-xs">{task.project.name}</span>
				</div>
				<TaskActions id={task.id} projectId={task.projectId}>
					<MoreHorizontal className="size[18px] shrink-0 stroke-1 text-neutral-700 transition hover:opacity-75" />
				</TaskActions>
			</div>
			<Separator />
			<div className="flex items-start justify-between gap-x-2">
				<p className="line-clamp-2 text-sm">{task.name}</p>
			</div>
			<Separator />
			<div className="flex items-center justify-between gap-x-1.5">
				<MemberAvatar
					name={task.assignee.name}
					fallbackClassName="text-[10px]"
				/>
				<TaskDate value={task.dueDate} className="text-xs" />
			</div>
		</div>
	);
}

export default KanbanCard;
