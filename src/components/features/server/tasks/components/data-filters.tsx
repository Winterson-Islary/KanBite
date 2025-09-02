import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { ListChecksIcon, UserIcon } from "lucide-react";
import { useGetMembers } from "../../members/api/use-get-members";
import { useGetProjects } from "../../projects/api/use-get-projects";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types/task-status";

interface DataFilterProps {
	hideProjectFilter?: boolean;
}

function DataFilters({ hideProjectFilter }: DataFilterProps) {
	const workspaceId = useWorkspaceId();
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});
	const isLoadingData = isLoadingMembers || isLoadingProjects;
	const projectOptions = projects?.documents.map((project) => ({
		value: project.$id,
		label: project.name,
	}));
	const memberOptions = members?.documents.map((member) => ({
		value: member.$id,
		label: member.name,
	}));
	const [{ status, assigneeId, projectId, search, dueDate }, setFilters] =
		useTaskFilters();
	const onStatusChange = (value: string) => {
		if (value === "all") setFilters({ status: null });
		else setFilters({ status: value as TaskStatus });
	};
	const onAssigneeChange = (value: string) => {
		if (value === "all") setFilters({ status: null });
		else setFilters({ assigneeId: value as string });
	};
	const onProjectChange = (value: string) => {
		if (value === "all") setFilters({ status: null });
		else setFilters({ projectId: value as string });
	};
	if (isLoadingData) return <article>Loading Data...</article>;

	return (
		<main className="flex flex-col gap-2 lg:flex-row">
			<Select
				defaultValue={status || undefined}
				onValueChange={(value) => onStatusChange(value)}
			>
				<SelectTrigger className="h-8 w-full lg:w-auto">
					<div className="flex items-center pr-2">
						<ListChecksIcon className="mr-2 size-4" />
						<SelectValue placeholder="All statuses" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All statuses</SelectItem>
					<SelectSeparator />
					<SelectItem value={TaskStatus.DONE}>Done</SelectItem>
					<SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
					<SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
					<SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
					<SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
				</SelectContent>
			</Select>
			<Select
				defaultValue={assigneeId || undefined}
				onValueChange={(value) => onAssigneeChange(value)}
			>
				<SelectTrigger className="h-8 w-full lg:w-auto">
					<div className="flex items-center pr-2">
						<UserIcon className="mr-2 size-4" />
						<SelectValue placeholder="All assignees" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All assignees</SelectItem>
					<SelectSeparator />
					{memberOptions?.map((member) => (
						<SelectItem key={member.value} value={member.value}>
							{member.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				defaultValue={projectId || undefined}
				onValueChange={(value) => onProjectChange(value)}
			>
				<SelectTrigger className="h-8 w-full lg:w-auto">
					<div className="flex items-center pr-2">
						<UserIcon className="mr-2 size-4" />
						<SelectValue placeholder="All projects" />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All projects</SelectItem>
					<SelectSeparator />
					{projectOptions?.map((project) => (
						<SelectItem key={project.value} value={project.value}>
							{project.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</main>
	);
}

export default DataFilters;
