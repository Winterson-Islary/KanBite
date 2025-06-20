"use client";

import { RiAddCircleFill } from "react-icons/ri";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import { useGetWorkspaces } from "../server/workspaces/api/useGetWorkspaces";

export default function WorkspaceSwitcher() {
	const { data: workspaces } = useGetWorkspaces();
	return (
		<main className="flex flex-col gap-y-2">
			<article className="flex justify-between items-center">
				<p className="uppercase text-neutral-500">Workspaces</p>
				<RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
			</article>
			<Select>
				<SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
					<SelectValue placeholder="No workspace selected" />
				</SelectTrigger>
				<SelectContent>
					{workspaces?.documents.map((workspace) => (
						<SelectItem key={workspace.$id} value={workspace.$id}>
							{workspace.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</main>
	);
}
