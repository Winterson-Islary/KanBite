"use client";

import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Separator } from "@/src/components/ui/separator";
import { useConfirm } from "@/src/hooks/useConfirm";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useDeleteMember } from "../api/use-delete-member";
import { useGetMembers } from "../api/use-get-members";
import { useUpdateMember } from "../api/use-update-member";
import { MEMBER_ROLE, type MEMBER_ROLE_TYPE } from "../constants/types";
import MemberAvatar from "./member-avatar";

function MembersList() {
	const workspaceId = useWorkspaceId();
	const { data } = useGetMembers({ workspaceId });
	const [ConfirmDialog, confirm] = useConfirm(
		"Remove member",
		"This member will be removed from the workspace",
	);
	const { mutate: deleteMemberMutate, isPending: isDeleteMemberPending } =
		useDeleteMember();
	const { mutate: updateMemberMutate, isPending: isUpdateMemberPending } =
		useUpdateMember();
	const handleDeleteMember = async (memberId: string) => {
		const ok = await confirm();
		if (!ok) return;
		deleteMemberMutate(
			{ param: { memberId } },
			{
				onSuccess: () => {
					window.location.reload();
				},
			},
		);
	};
	const handleUpdateMember = (memberId: string, role: MEMBER_ROLE_TYPE) => {
		updateMemberMutate({ json: { role }, param: { memberId } });
	};
	return (
		<Card className="h-full w-full border-none shadow-none">
			<ConfirmDialog />
			<CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-0">
				<Button variant="secondary" size="sm" asChild>
					<Link href={`/workspaces/${workspaceId}`}>
						<ArrowLeftIcon className="mr-2 size-4" />
						Back
					</Link>
				</Button>
				<CardTitle className="font-light text-3xl">Members list</CardTitle>
			</CardHeader>
			<section>
				<Separator />
			</section>
			<CardContent className="flex w-full flex-col gap-4">
				{data?.documents.map((member, index) => {
					return (
						<Fragment key={member.$id}>
							<section className="flex w-full items-center gap-2">
								<MemberAvatar
									name={member.name}
									className="size-10"
									fallbackClassName="text-lg"
								/>
								<section className="flex w-full">
									<div className="flex flex-col">
										<p className="font-medium text-sm">{member.name}</p>
										<p className="text-muted-foreground text-xs">
											{member.email}
										</p>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												size="icon"
												variant="secondary"
												className="ml-auto hover:cursor-pointer"
											>
												<MoreVerticalIcon className="size-4 text-muted-foreground" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent side="bottom" align="end">
											<DropdownMenuItem
												className="font-medium"
												disabled={isUpdateMemberPending}
												onClick={() =>
													handleUpdateMember(member.$id, MEMBER_ROLE.ADMIN)
												}
											>
												Set as Administrator
											</DropdownMenuItem>
											<DropdownMenuItem
												className="font-medium"
												disabled={isUpdateMemberPending}
												onClick={() =>
													handleUpdateMember(member.$id, MEMBER_ROLE.MEMBER)
												}
											>
												Set as Member
											</DropdownMenuItem>
											<DropdownMenuItem
												className="font-medium text-amber-700"
												disabled={isDeleteMemberPending}
												onClick={() => handleDeleteMember(member.$id)}
											>
												Remove {member.name}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</section>
							</section>
						</Fragment>
					);
				})}
			</CardContent>
		</Card>
	);
}

export default MembersList;
