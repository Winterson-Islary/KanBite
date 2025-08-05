import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { MemberDeleteError } from "../errors/member-delete-error";

type ResponseType = InferResponseType<
	(typeof client.api.members)[":memberId"]["$delete"],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMemeber = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.api.members[":memberId"].$delete({
				param,
			});
			if (!response.ok) throw new MemberDeleteError();
			return await response.json();
		},
		onSuccess: () => {
			toast.success("Member deleted");
			queryClient.invalidateQueries({ queryKey: ["members"] });
		},
		onError: () => {
			toast.error("Failed to delete member");
		},
	});
	return mutation;
};
