import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/src/components/ui/separator";
import MemberAvatar from "../../members/components/member-avatar";
import ProjectAvatar from "../../projects/components/project-avatar";
import type { Project } from "../../projects/types/project";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { TaskStatus } from "../types/task-status";

interface EventCardProps {
	title: string;
	id: string;
	project: Project;
	assignee: { name: string } | undefined;
	status: TaskStatus;
}
const statusColorMap: Record<TaskStatus, string> = {
	[TaskStatus.PENDING]: "border-l-pink-500",
	[TaskStatus.DONE]: "border-l-emerald-500",
	[TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
	[TaskStatus.IN_REVIEW]: "border-l-blue-500",
	[TaskStatus.TODO]: "border-l-red-500",
};

function EventCard(props: EventCardProps) {
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		router.push(`/workspaces/${workspaceId}/tasks/${props.id}`);
	};
	return (
		<div className="px-2">
			<div
				className={cn(
					"flex cursor-pointer flex-col gap-y-1.5 rounded-md border border-l-4 bg-white p-1.5 text-primary text-xs transition hover:opacity-75",
					statusColorMap[props.status],
				)}
				onClick={onCardClick}
				onKeyPress={() => {}}
			>
				<p className="text-sm">{props.title}</p>
				<Separator />
				<p className="text-xs">Assignee</p>
				<div className="flex items-center gap-x-1">
					<MemberAvatar name={props.assignee?.name ?? ""} />
					<p>{props.assignee?.name}</p>
				</div>
				<Separator />
				<div className="flex items-center justify-end gap-x-1">
					<ProjectAvatar name={props.project.name} className="size-5" />
					<p>{props.project.name}</p>
				</div>
			</div>
		</div>
	);
}

export default EventCard;
