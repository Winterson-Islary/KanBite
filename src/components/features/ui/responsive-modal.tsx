"use client";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/src/components/ui/drawer";
import { useMedia } from "react-use";

type ResponsiveModalProps = {
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export default function ResponsiveModal({
	children,
	open,
	onOpenChange,
}: ResponsiveModalProps) {
	const isDesktop = useMedia("(min-width: 1024px)", true);
	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none sm:max-w-xl">
					<DialogTitle className="sr-only">Workspace Creator Modal</DialogTitle>
					{children}
				</DialogContent>
			</Dialog>
		);
	}
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerTitle className="sr-only">Workspace Creator Drawer</DrawerTitle>
				<div className="hide-scrollbar max-h-[85vh] overflow-y-auto">
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
