import { getCurrentUser } from "@/src/components/features/server/auth/queries";
import UserButton from "@/src/components/features/ui/user-button";
import Link from "next/link";
import { redirect } from "next/navigation";

type StandaloneLayoutProps = {
	children: React.ReactNode;
};
async function StandaloneLayout({ children }: StandaloneLayoutProps) {
	const user = await getCurrentUser();
	if (!user) redirect("/sign-in");
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
