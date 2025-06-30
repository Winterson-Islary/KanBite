"use client";

import { useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import { useGetWorkspaces } from "../server/workspaces/api/useGetWorkspaces";
import WorkspaceAvatar from "../server/workspaces/components/workspace-avatar";
import { useCreateWorkspaceModal } from "../server/workspaces/hooks/useCreateWorkspaceModal";
import { useWorkspaceId } from "../server/workspaces/hooks/useWorkspaceId";

export default function WorkspaceSwitcher() {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const { data: workspaces } = useGetWorkspaces();
	const { open } = useCreateWorkspaceModal();
	const onSelect = (id: string) => {
		router.push(`/workspaces/${id}`);
	};
	return (
		<main className="flex flex-col gap-y-2">
			<article className="flex justify-between items-center">
				<p className="uppercase text-neutral-500">Workspaces</p>
				<RiAddCircleFill
					onClick={open}
					className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
				/>
			</article>
			<Select onValueChange={onSelect} value={workspaceId}>
				<SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
					<SelectValue placeholder="No workspace selected" />
				</SelectTrigger>
				<SelectContent>
					{workspaces?.documents.map((workspace) => (
						<SelectItem key={workspace.$id} value={workspace.$id}>
							<article className="flex justify-start items-center gap-3 font-medium">
								<WorkspaceAvatar
									name={workspace.name}
									image={workspace.imageUrl}
									className=""
								/>
								<span className="truncate">{workspace.name}</span>
							</article>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</main>
	);
}
