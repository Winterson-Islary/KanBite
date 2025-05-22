import Link from "next/link"

const NavbarLinks = ["dashboard", "settings"]
function GetNavLinks(links: string[]) {
	return (
		<ul className="flex justify-around md:gap-5 lg:gap-10 font-light">
			{
				links.map((link) => (
					<li key={link}>
						<Link href={link}>{link}</Link>
					</li>
				))
			}
		</ul>
	)
}
function Navbar() {
  return (
	<main className="py-2 flex items-center justify-between">
		<section><h1 className="text-3xl font-light">KanBite</h1></section>
		<section>{GetNavLinks(NavbarLinks)}</section>
	</main>
  )
}

export default Navbar