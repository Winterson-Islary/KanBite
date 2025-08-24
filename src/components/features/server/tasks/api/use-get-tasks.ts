import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskGetError } from "../errors/get-tasks-error";

type UseGetTasksProps = {
	workspaceId: string;
};
export const useGetTasks = ({ workspaceId }: UseGetTasksProps) => {
	const query = useQuery({
		queryKey: ["tasks", workspaceId],
		queryFn: async () => {
			const response = await client.api.tasks.$get({
				query: { workspaceId },
			});
			if (!response.ok) throw new TaskGetError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
