import { Loader } from "lucide-react";

function Spinner() {
	return (
		<article className="flex h-full items-center justify-center">
			<Loader className="size-5 animate-spin text-muted-foreground" />
		</article>
	);
}

export default Spinner;
