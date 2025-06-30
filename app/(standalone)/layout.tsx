import UserButton from "@/src/components/features/ui/user-button";
import Link from "next/link";

type StandaloneLayoutProps = {
	children: React.ReactNode;
};
function StandaloneLayout({ children }: StandaloneLayoutProps) {
	return (
		<article>
			<section className="max-w-screen-2xl mx-auto w-full min-h-screen p-2.5 grid [grid-template-rows:auto_1fr]">
				<nav className="flex justify-between items-center h-[73px]">
					<Link href="/" className="hover:cursor-pointer">
						<p className="text-3xl">KANBITE</p>
					</Link>
					<UserButton />
				</nav>
				<main className="flex flex-col items-center justify-center">
					{children}
				</main>
			</section>
		</article>
	);
}

export default StandaloneLayout;
