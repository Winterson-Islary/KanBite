import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import Image from "next/image";

type WorkspaceAvatarProps = {
	name: string;
	image?: string;
	className?: string;
};

function WorkspaceAvatar({ image, name, className }: WorkspaceAvatarProps) {
	if (image) {
		return (
			<main
				className={cn("size-10 relative rounded-md overflow-hidden", className)}
			>
				<Image src={image} alt={name} fill className="object-cover" />
			</main>
		);
	}

	return (
		<Avatar className={cn("size-10 rounded-md overflow-hidden", className)}>
			<AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
				{name[0]}
			</AvatarFallback>
		</Avatar>
	);
}

export default WorkspaceAvatar;
