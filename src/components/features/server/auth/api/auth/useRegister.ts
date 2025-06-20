import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserRegisterError } from "../../errors/UserRegisterError";

type ResponseType = InferResponseType<
	(typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ json }) => {
			const response = await client.api.auth.register.$post({ json });
			if (!response.ok) {
				throw new UserRegisterError();
			}
			return await response.json();
		},
		onSuccess: () => {
			router.refresh();
			toast.success("Registered user");
			queryClient.invalidateQueries({ queryKey: ["currentUser"] });
		},
		onError: () => {
			toast.error("Failed to register user");
		},
	});

	return mutation;
};
