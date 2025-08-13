import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { ProjectCreateError } from "../errors/create-project-error";

type ResponseType = InferResponseType<
	(typeof client.api.projects)["$post"],
	200
>;
type RequestType = InferRequestType<(typeof client.api.projects)["$post"]>;

export const useCreateProject = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form }) => {
			const response = await client.api.projects.$post({ form });
			if (!response.ok) throw new ProjectCreateError();
			return await response.json();
		},
		onSuccess: () => {
			toast.success("Project created");
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
		onError: () => {
			toast.error("Failed to create project");
		},
	});
	return mutation;
};
