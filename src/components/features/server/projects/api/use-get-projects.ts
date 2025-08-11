import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { ProjectsGetError } from "../errors/projects-get-error";

type UseGetProjectsProps = {
	workspaceId: string;
};
export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
	const query = useQuery({
		queryKey: ["projects", workspaceId],
		queryFn: async () => {
			const response = await client.api.projects.$get({
				query: { workspaceId },
			});
			if (!response.ok) throw new ProjectsGetError();
			const { data } = await response.json();
			return data;
		},
	});
	return query;
};
