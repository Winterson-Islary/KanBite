import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import Image from "next/image";

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
				className={cn("relative size-7 overflow-hidden rounded-md", className)}
			>
				<Image src={image} alt={name} fill className="object-cover" />
			</main>
		);
	}

	return (
		<Avatar className={cn("size-7 overflow-hidden rounded-sm", className)}>
			<AvatarFallback
				className={cn(
					"rounded-sm bg-blue-600 font-semibold text-sm text-white uppercase",
					fallbackClassname,
				)}
			>
				{name[0]}
			</AvatarFallback>
		</Avatar>
	);
}

export default ProjectAvatar;
