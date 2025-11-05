import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { ProjectGetError } from "../errors/get-project-error";

type UseGetProjectAnalyticsProps = {
	projectId: string;
};
export type ProjectAnalyticsResponseType = InferResponseType<
	(typeof client.api.projects)[":projectId"]["analytics"]["$get"],
	200
>["data"];

export const useGetProjectAnalytics = ({
	projectId,
}: UseGetProjectAnalyticsProps) => {
	const query = useQuery({
		queryKey: ["project-analytics", projectId],
		queryFn: async () => {
			const response = await client.api.projects[":projectId"].analytics.$get({
				param: { projectId },
			});
			if (!response.ok) throw new ProjectGetError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
