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
				<DialogContent className="w-full sm:max-w-xl border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
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
				<div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
