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
import { useGetWorkspaces } from "../server/workspaces/api/use-get-workspaces";
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
			<article className="flex items-center justify-between">
				<p className="font-light text-black uppercase">Workspaces</p>
				<RiAddCircleFill
					onClick={open}
					className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
				/>
			</article>
			<Select onValueChange={onSelect} value={workspaceId}>
				<SelectTrigger className="w-full bg-neutral-200 p-1 font-medium hover:cursor-pointer">
					<SelectValue placeholder="No workspace selected" />
				</SelectTrigger>
				<SelectContent>
					{workspaces?.documents.map((workspace) => (
						<SelectItem key={workspace.$id} value={workspace.$id}>
							<article className="flex items-center justify-start gap-3 font-medium">
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
