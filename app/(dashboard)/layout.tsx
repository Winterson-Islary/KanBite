import { getCurrentUser } from "@/src/components/features/server/auth/actions";
import Navbar from "@/src/components/features/ui/navbar";
import Sidebar from "@/src/components/features/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Dashboardlayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");
	return (
		<article className="min-h-screen overflow-hidden w-full grid [grid-template-rows:1fr_auto] ">
			<div className=" min-h-full w-full mx-auto">
				<main className="lg:grid lg:[grid-template-columns:300px_1fr] h-full">
					<aside className="hidden lg:block h-full">
						<Sidebar />
					</aside>
					<section
						id="content"
						className="max-w-screen-2xl mx-auto w-full h-full p-2.5"
					>
						<nav>
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
