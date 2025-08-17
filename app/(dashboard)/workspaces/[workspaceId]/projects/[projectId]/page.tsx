import ProjectAvatar from "@/src/components/features/server/projects/components/project-avatar";
import { getUserProject } from "@/src/components/features/server/projects/queries";
import { Button } from "@/src/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";

type ProjectIdPageProps = {
	params: { projectId: string };
};

async function ProjectIdPage({ params }: ProjectIdPageProps) {
	const { projectId } = await params;
	const initialValues = await getUserProject({ projectId });
	//! Handle condition for missing initial-values
	if (!initialValues) throw new Error("Project not found"); //? Throwing for now

	return (
		<main className="flex flex-col gap-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<ProjectAvatar
						name={initialValues.name}
						image={initialValues.imageUrl}
						className="size-8"
					/>
					<p className="font-semibold text-lg">{initialValues.name}</p>
				</div>
				<div>
					<Button variant="outline" asChild>
						<Link href="">
							<PencilIcon className=" size-4" />
							Edit Project
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}

export default ProjectIdPage;
