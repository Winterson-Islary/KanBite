"use client";

import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useGetMembers } from "../api/use-get-members";
import MemberAvatar from "./member-avatar";

function MembersList() {
	const workspaceId = useWorkspaceId();
	const { data } = useGetMembers({ workspaceId });
	return (
		<Card className="h-full w-full border-none shadow-none">
			<CardHeader className="flex flex-row items-center gap-x-4 p-0 space-y-0">
				<Button variant="secondary" size="sm" asChild>
					<Link href={`/workspaces/${workspaceId}`}>
						<ArrowLeftIcon className="size-4 mr-2" />
						Back
					</Link>
				</Button>
				<CardTitle className="text-3xl font-light">Members list</CardTitle>
			</CardHeader>
			<section>
				<Separator />
			</section>
			<CardContent className="flex flex-col gap-4 w-full">
				{data?.documents.map((member, index) => {
					return (
						<Fragment key={member.$id}>
							<section className="flex items-center gap-2 w-full">
								<MemberAvatar
									name={member.name}
									className="size-10"
									fallbackClassName="text-lg"
								/>
								<section className="flex w-full">
									<div className="flex flex-col">
										<p className="text-sm font-medium">{member.name}</p>
										<p className="text-xs text-muted-foreground">
											{member.email}
										</p>
									</div>
									<Button
										size="icon"
										variant="secondary"
										className="ml-auto hover:cursor-pointer"
									>
										<MoreVerticalIcon className="size-4 text-muted-foreground" />
									</Button>
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
