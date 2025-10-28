import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
	message: string;
}

function PageError({ message = "Something went wrong" }: PageErrorProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center">
			<AlertTriangle className="mb-2 size-6 text-muted-foreground" />
			<p className="font-medium text-muted-foreground text-sm">{message}</p>
		</div>
	);
}

export default PageError;
