"use client";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { Drawer, DrawerContent } from "@/src/components/ui/drawer";
import { DialogTitle as RadixDialog } from "@radix-ui/react-dialog";
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
					<RadixDialog className="sr-only">
						<DialogTitle className="sr-only">
							Workspace Creator Modal
						</DialogTitle>
					</RadixDialog>
					{children}
				</DialogContent>
			</Dialog>
		);
	}
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
