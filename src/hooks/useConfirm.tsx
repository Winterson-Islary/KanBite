import ResponsiveModal from "@/src/components/features/ui/responsive-modal";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { type JSX, useState } from "react";
import { Button } from "../components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

export const useConfirm = (
	title: string,
	message: string,
	variant: ButtonProps["variant"] = "default",
): [() => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () => {
		return new Promise((resolve) => setPromise({ resolve }));
	};
	const handleClose = () => {
		setPromise(null);
	};
	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};
	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const confirmationDialog = () => (
		<ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
			<Card className="h-full w-full border-none shadow-none">
				<CardContent className="pt-8">
					<CardHeader className="p-0">
						<CardTitle className="font-light text-2xl">{title}</CardTitle>
						<CardDescription>{message}</CardDescription>
					</CardHeader>
					<div className="gapy-y-2 flex w-full flex-col items-center justify-end gap-x-2 pt-4 lg:flex-row">
						<Button
							onClick={handleCancel}
							variant="outline"
							className="w-full font-light text-sm uppercase hover:cursor-pointer lg:w-auto"
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirm}
							variant={variant}
							className="w-full font-light text-sm uppercase hover:cursor-pointer lg:w-auto"
						>
							Confirm
						</Button>
					</div>
				</CardContent>
			</Card>
		</ResponsiveModal>
	);

	return [confirmationDialog, confirm];
};
