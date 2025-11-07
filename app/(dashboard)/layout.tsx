import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/components/features/server/auth/queries";
import CreateProjectModal from "@/src/components/features/server/projects/components/create-project-modal";
import { CreateTaskModal } from "@/src/components/features/server/tasks/components/create-task-modal";
import { UpdateTaskModal } from "@/src/components/features/server/tasks/components/update-task-modal";
import CreateWorkspaceModal from "@/src/components/features/server/workspaces/components/create-workspace-modal";
import Navbar from "@/src/components/features/ui/navbar";
import Sidebar from "@/src/components/features/ui/sidebar";

export default async function Dashboardlayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");
	return (
		<article className="grid h-full w-full grid-rows-[1fr_auto]">
			<CreateWorkspaceModal />
			<CreateProjectModal />
			<CreateTaskModal />
			<UpdateTaskModal />
			<div className="mx-auto min-h-full w-full">
				<main className="h-full lg:grid lg:grid-cols-[300px_1fr]">
					<aside className="hidden lg:block">
						<div className="sticky top-0 h-screen">
							<Sidebar />
						</div>
					</aside>
					<section
						id="content"
						className="mx-auto grid h-full min-h-screen w-full max-w-screen-2xl grid-rows-[auto_1fr] p-2.5"
					>
						<nav className="h-[73px]">
							<Navbar />
						</nav>
						<main className="h-full">{children}</main>
					</section>
				</main>
			</div>
			{/* <footer className="min-h-[200px] bg-black">
				<main className="md:px[5rem] mx-auto w-full max-w-screen-2xl px-[2rem] text-white lg:px-[10rem]">
					<h1>FOOTER</h1>
				</main>
			</footer> */}
		</article>
	);
}
