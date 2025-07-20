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
			<Card className="w-full h-full shadow-none border-none">
				<CardContent className="pt-8">
					<CardHeader className="p-0">
						<CardTitle className="text-2xl font-light">{title}</CardTitle>
						<CardDescription>{message}</CardDescription>
					</CardHeader>
					<div className="pt-4 w-full flex flex-col gapy-y-2 lg:flex-row gap-x-2 items-center justify-end">
						<Button
							onClick={handleCancel}
							variant="outline"
							className="w-full lg:w-auto hover:cursor-pointer font-light text-sm uppercase"
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirm}
							variant={variant}
							className="w-full lg:w-auto hover:cursor-pointer font-light text-sm uppercase"
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
