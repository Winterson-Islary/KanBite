"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetProjects } from "../server/projects/api/use-get-projects";
import { useCreateProjectModal } from "../server/projects/hooks/use-create-project-modal";
import { useProjectId } from "../server/projects/hooks/use-project-id";
import { useWorkspaceId } from "../server/workspaces/hooks/useWorkspaceId";
function Projects() {
	const projectId = useProjectId();
	const { open } = useCreateProjectModal();
	const pathname = usePathname();
	const workspaceId = useWorkspaceId();
	const { data } = useGetProjects({ workspaceId });
	return (
		<main className="flex flex-col gap-y-2">
			<article className="flex justify-between items-center">
				<p className="uppercase font-light text-black">Projects</p>
				<RiAddCircleFill
					onClick={open}
					className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
				/>
			</article>
			{data?.documents.map((project) => {
				const href = `/workspaces/${workspaceId}/projects/${projectId}`;
				const isActive = pathname === href;
				return (
					<Link href={href} key={project.$id}>
						<div
							className={cn(
								"flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
								isActive && "bg-white shadow-sm hover:opacity-100 text-black",
							)}
						>
							<span className="truncate">{project.name}</span>
						</div>
					</Link>
				);
			})}
		</main>
	);
}

export default Projects;
