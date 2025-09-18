import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskGetError } from "../errors/get-tasks-error";

type UseGetTasksProps = {
	taskId: string;
};
export const useGetTask = ({ taskId }: UseGetTasksProps) => {
	const query = useQuery({
		queryKey: ["tasks", taskId],
		queryFn: async () => {
			const response = await client.api.tasks[":taskId"].$get({
				param: {
					taskId,
				},
			});
			if (!response.ok) throw new TaskGetError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
