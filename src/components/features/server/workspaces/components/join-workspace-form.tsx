"use client";

import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/useWorkspaceId";

type JoinWorkspaceFormProps = {
	initialValues: {
		name: string;
	};
};
export default function JoinWorkspaceFrom({
	initialValues,
}: JoinWorkspaceFormProps) {
	const workspaceId = useWorkspaceId();
	const inviteCode = useInviteCode();
	const { mutate, isPending } = useJoinWorkspace();
	const router = useRouter();
	const onSubmit = () => {
		mutate(
			{
				param: {
					workspaceId,
				},
				json: { code: inviteCode },
			},
			{
				onSuccess: ({ data }) => {
					router.push(`/workspaces/${data.$id}`);
				},
			},
		);
	};
	return (
		<Card className="w-full border-none shadow-none">
			<CardHeader className="p-7">
				<CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
				<CardDescription>
					You&apos;ve been invited to join{" "}
					<strong>{initialValues.name} </strong>workspace
				</CardDescription>
			</CardHeader>
			<div className="px-7">
				<Separator />
			</div>
			<CardContent className="px-7">
				<div className="flex items-center justify-end gap-5">
					<Button
						asChild
						variant="outline"
						className="font-light hover:cursor-pointer"
						disabled={isPending}
					>
						<Link href="/">Cancel</Link>
					</Button>
					<Button
						type="button"
						className="font-light hover:cursor-pointer"
						onClick={onSubmit}
						disabled={isPending}
					>
						Join Workspace
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
