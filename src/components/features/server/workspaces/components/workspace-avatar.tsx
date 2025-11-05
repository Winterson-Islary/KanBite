import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

type WorkspaceAvatarProps = {
	name: string;
	image?: string;
	className?: string;
};

function WorkspaceAvatar({ image, name, className }: WorkspaceAvatarProps) {
	if (image) {
		return (
			<main
				className={cn("relative size-10 overflow-hidden rounded-xl", className)}
			>
				<Image
					src={image}
					alt={name}
					fill
					className="rounded-xl object-cover"
				/>
			</main>
		);
	}

	return (
		<Avatar className={cn("size-10 overflow-hidden rounded-xl", className)}>
			<AvatarFallback className="rounded-xl bg-blue-600 font-semibold text-lg text-white uppercase">
				{name[0]}
			</AvatarFallback>
		</Avatar>
	);
}

export default WorkspaceAvatar;
