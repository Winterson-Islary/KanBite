import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { WorkspaceAnalyticsGetError } from "../errors/get-workspace-analytics-error";

type UseGetWorkspaceAnalyticsProps = {
	workspaceId: string;
};
export type ProjectAnalyticsResponseType = InferResponseType<
	(typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"],
	200
>["data"];

export const useGetWorkspaceAnalytics = ({
	workspaceId,
}: UseGetWorkspaceAnalyticsProps) => {
	const query = useQuery({
		queryKey: ["workspace-analytics", workspaceId],
		queryFn: async () => {
			const response = await client.api.workspaces[
				":workspaceId"
			].analytics.$get({
				param: { workspaceId },
			});
			if (!response.ok) throw new WorkspaceAnalyticsGetError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
