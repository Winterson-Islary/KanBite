import { client } from "@/lib/rpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { WorkspacesFetchError } from "../errors/WorkspacesFetchError";

export const useGetWorkspaces = () => {
	const query = useQuery({
		queryKey: ["workspaces"],
		queryFn: async () => {
			const response = await client.api.workspaces.$get();
			if (!response.ok) throw new WorkspacesFetchError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
