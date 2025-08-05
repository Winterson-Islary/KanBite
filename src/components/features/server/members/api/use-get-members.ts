import { client } from "@/lib/rpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MembersFetchError } from "../errors/member-fetch-error";

type UseGetMembersProps = {
	workspaceId: string;
};
export const useGetMembers = ({ workspaceId }: UseGetMembersProps) => {
	const query = useQuery({
		queryKey: ["members", workspaceId],
		queryFn: async () => {
			const response = await client.api.members.$get({
				query: { workspaceId },
			});
			if (!response.ok) throw new MembersFetchError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
