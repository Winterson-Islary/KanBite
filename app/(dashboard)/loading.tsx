import { Loader } from "lucide-react";

function Dashboardloading() {
	return (
		<article className="flex h-full items-center justify-center">
			<Loader className="size-6 animate-spin text-muted-foreground" />
		</article>
	);
}

export default Dashboardloading;
