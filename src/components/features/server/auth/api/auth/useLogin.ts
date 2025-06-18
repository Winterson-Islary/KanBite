import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginError } from "../../errors/LoginError";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ json }) => {
			const response = await client.api.auth.login.$post({ json });
			if (!response.ok) {
				throw new LoginError();
			}
			return await response.json();
		},
		onSuccess: () => {
			router.refresh();
			toast.success("Logged in");
			queryClient.invalidateQueries({ queryKey: ["currentUser"] });
		},
		onError: () => {
			toast.error("Failed to log in");
		},
	});

	return mutation;
};
