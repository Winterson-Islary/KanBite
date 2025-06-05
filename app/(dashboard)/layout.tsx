import Navbar from "@/src/components/features/ui/navbar";
import Sidebar from "@/src/components/features/ui/sidebar";

export default function Dashboardlayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<article className="min-h-screen w-full grid [grid-template-rows:1fr_auto] ">
			<div className="max-w-screen-2xl min-h-screen w-full mx-auto  px-[2rem] md:px-[5rem] lg:px-[10rem]">
				<header>
					<Navbar />
				</header>
				<main className="lg:grid lg:[grid-template-columns:300px_1fr]">
					<aside className="hidden lg:block">
						<Sidebar />
					</aside>
					<section id="content">{children}</section>
				</main>
			</div>
			<footer className="bg-black min-h-[200px]">
				<main className="max-w-screen-2xl w-full mx-auto px-[2rem] md:px[5rem] lg:px-[10rem] text-white">
					<h1>FOOTER</h1>
				</main>
			</footer>
		</article>
	);
}
