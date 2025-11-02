import { PencilIcon } from "lucide-react";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import MemberAvatar from "../../members/components/member-avatar";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import type { Task } from "../types/task";
import OverviewProperty from "./overview-property";
import TaskDate from "./task-date";

interface TaskOverviewProps {
	task: Task;
}

function TaskOverview({ task }: TaskOverviewProps) {
	const { open } = useUpdateTaskModal();

	return (
		<div className="col-span-1 flex flex-col gap-y-4">
			<section className="rounded-xl border p-4">
				<div className="flex items-center justify-between">
					<p className="font-semibold text-lg">Overview</p>
					<Button size="sm" variant="outline" onClick={() => open(task.$id)}>
						<PencilIcon className="size-4" />
						Edit
					</Button>
				</div>
				<Separator className="my-2" />
				<div className="flex flex-col gap-y-4">
					<OverviewProperty label="Assignee">
						<MemberAvatar name={task.assignee.name} />
						<p className="font-medium text-sm">{task.assignee.name}</p>
					</OverviewProperty>
					<OverviewProperty label="Due Date">
						<TaskDate value={task.dueDate} className="font-medium text-sm" />
					</OverviewProperty>
					<OverviewProperty label="Status">
						<Badge variant={task.status} className="pointer-events-none">
							{snakeCaseToTitleCase(task.status)}
						</Badge>
					</OverviewProperty>
				</div>
			</section>
		</div>
	);
}

export default TaskOverview;
