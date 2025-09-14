import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TaskDeleteError } from "../errors/delete-task-error";

type ResponseType = InferResponseType<
	(typeof client.api.tasks)[":taskId"]["$delete"],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.api.tasks[":taskId"].$delete({
				param,
			});
			if (!response.ok) throw new TaskDeleteError();
			return await response.json();
		},
		onSuccess: ({ data }) => {
			toast.success("Task deleted");
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
			queryClient.invalidateQueries({ queryKey: ["tasks", data.$id] });
		},
		onError: () => {
			toast.error("Failed to delete task");
		},
	});
	return mutation;
};
