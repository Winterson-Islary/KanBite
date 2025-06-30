import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogoutError } from "../../errors/LogoutError";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const response = await client.api.auth.logout.$post();
			if (!response.ok) {
				throw new LogoutError();
			}
			return await response.json();
		},
		onSuccess: () => {
			router.refresh();
			toast.success("Logged out");
			queryClient.invalidateQueries({
				queryKey: ["currentUser"],
			});
			queryClient.invalidateQueries({
				queryKey: ["workspaces"],
			});
		},
		onError: () => {
			toast.error("Failed to log out");
		},
	});
	return mutation;
};
