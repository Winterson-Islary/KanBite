import { MenuIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
	return (
		<Sheet modal={false}>
			<SheetTrigger asChild>
				<Button variant="secondary" className="lg:hidden">
					<MenuIcon className="size-4 text-neutral-500" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<Sidebar />
			</SheetContent>
		</Sheet>
	);
}
