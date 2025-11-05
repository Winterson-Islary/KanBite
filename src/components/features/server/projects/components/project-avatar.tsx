import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

type ProjectAvatarProps = {
	name: string;
	image?: string;
	className?: string;
	fallbackClassname?: string;
};

function ProjectAvatar({
	image,
	name,
	className,
	fallbackClassname,
}: ProjectAvatarProps) {
	if (image) {
		return (
			<main
				className={cn("relative size-7 overflow-hidden rounded-xl", className)}
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
		<Avatar className={cn("size-7 overflow-hidden rounded-xl", className)}>
			<AvatarFallback
				className={cn(
					"rounded-xl bg-blue-600 font-semibold text-sm text-white uppercase",
					fallbackClassname,
				)}
			>
				{name[0]}
			</AvatarFallback>
		</Avatar>
	);
}

export default ProjectAvatar;
