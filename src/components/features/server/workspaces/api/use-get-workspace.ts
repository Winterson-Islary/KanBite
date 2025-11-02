import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { WorkspacesFetchError } from "../errors/WorkspacesFetchError";

interface UseGetProjectProps {
	workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: UseGetProjectProps) => {
	const query = useQuery({
		queryKey: ["workspace", workspaceId],
		queryFn: async () => {
			const response = await client.api.workspaces[":workspaceId"].$get({
				param: { workspaceId },
			});
			if (!response.ok) throw new WorkspacesFetchError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
