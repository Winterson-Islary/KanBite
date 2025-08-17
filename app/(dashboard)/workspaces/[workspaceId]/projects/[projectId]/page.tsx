import { getUserProject } from "@/src/components/features/server/projects/queries";

type ProjectIdPageProps = {
	params: { projectId: string };
};

async function ProjectIdPage({ params }: ProjectIdPageProps) {
	const { projectId } = params;
	const initialValues = await getUserProject({ projectId });
	return (
		<main>
			<h1>Project ID: {projectId}</h1>
			<section id="data">{JSON.stringify(initialValues)}</section>
		</main>
	);
}

export default ProjectIdPage;
