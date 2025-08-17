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
			<section className="mx-auto grid min-h-screen w-full max-w-screen-2xl p-2.5 [grid-template-rows:auto_1fr]">
				<nav className="flex h-[73px] items-center justify-between">
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
