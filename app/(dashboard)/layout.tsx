import { getCurrentUser } from "@/src/components/features/server/auth/queries";
import CreateProjectModal from "@/src/components/features/server/projects/components/create-project-modal";
import { CreateTaskModal } from "@/src/components/features/server/tasks/components/create-task-modal";
import CreateWorkspaceModal from "@/src/components/features/server/workspaces/components/create-workspace-modal";
import Navbar from "@/src/components/features/ui/navbar";
import Sidebar from "@/src/components/features/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Dashboardlayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");
	return (
		<article className="grid min-h-screen w-full overflow-hidden [grid-template-rows:1fr_auto] ">
			<CreateWorkspaceModal />
			<CreateProjectModal />
			<CreateTaskModal />
			<div className=" mx-auto min-h-full w-full">
				<main className="h-full lg:grid lg:[grid-template-columns:300px_1fr]">
					<aside className="hidden h-full lg:block">
						<Sidebar />
					</aside>
					<section
						id="content"
						className="mx-auto h-full w-full max-w-screen-2xl p-2.5"
					>
						<nav className="h-[73px]">
							<Navbar />
						</nav>
						<main className="h-full">{children}</main>
					</section>
				</main>
			</div>
			{/* <footer className="bg-black min-h-[200px]">
				<main className="max-w-screen-2xl w-full mx-auto px-[2rem] md:px[5rem] lg:px-[10rem] text-white">
					<h1>FOOTER</h1>
				</main>
			</footer> */}
		</article>
	);
}
