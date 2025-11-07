"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useGetProjects } from "../server/projects/api/use-get-projects";
import ProjectAvatar from "../server/projects/components/project-avatar";
import { useCreateProjectModal } from "../server/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "../server/workspaces/hooks/useWorkspaceId";

function Projects() {
	const { open } = useCreateProjectModal();
	const pathname = usePathname();
	const workspaceId = useWorkspaceId();
	const { data } = useGetProjects({ workspaceId });
	return (
		<main className="flex flex-col gap-y-2">
			<article className="flex items-center justify-between">
				<p className="font-normal text-lg">Projects</p>
				<RiAddCircleFill
					onClick={open}
					className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
				/>
			</article>
			{data?.documents.map((project) => {
				const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
				const isActive = pathname === href;
				return (
					<Link href={href} key={project.$id}>
						<div
							className={cn(
								"flex cursor-pointer items-center gap-2.5 rounded-md p-2.5 text-black transition hover:opacity-80",
								isActive && "bg-white text-black shadow-sm hover:opacity-100",
							)}
						>
							<ProjectAvatar image={project.imageUrl} name={project.name} />
							<span className="truncate text-sm">{project.name}</span>
						</div>
					</Link>
				);
			})}
		</main>
	);
}

export default Projects;
