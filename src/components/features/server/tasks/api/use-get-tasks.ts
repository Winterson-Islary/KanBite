import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskGetError } from "../errors/get-tasks-error";
import type { TaskStatus } from "../types/task-status";

type UseGetTasksProps = {
	workspaceId: string;
	projectId?: string | null;
	assigneeId?: string | null;
	status?: TaskStatus | null;
	dueDate?: string | null;
	search?: string | null;
};
export const useGetTasks = ({
	workspaceId,
	projectId,
	assigneeId,
	status,
	dueDate,
	search,
}: UseGetTasksProps) => {
	const query = useQuery({
		queryKey: [
			"tasks",
			workspaceId,
			projectId,
			assigneeId,
			status,
			search,
			dueDate,
		],
		queryFn: async () => {
			const response = await client.api.tasks.$get({
				query: {
					workspaceId,
					projectId: projectId ?? undefined,
					assigneeId: assigneeId ?? undefined,
					status: status ?? undefined,
					search: search ?? undefined,
					dueDate: dueDate ?? undefined,
				},
			});
			if (!response.ok) throw new TaskGetError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
