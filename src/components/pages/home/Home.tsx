import CreateWorkspaceForm from "../../features/server/workspaces/components/create-workspaces-form";

async function Home() {
	return (
		<main>
			<h1>This is the Home Page</h1>
			<CreateWorkspaceForm />
		</main>
	);
}

export default Home;
