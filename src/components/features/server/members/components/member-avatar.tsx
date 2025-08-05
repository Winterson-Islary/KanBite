import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

type MemberAvatarProps = {
	name: string;
	className?: string;
	fallbackClassName?: string;
};

function MemberAvatar({
	name,
	className,
	fallbackClassName,
}: MemberAvatarProps) {
	return (
		<Avatar
			className={cn(
				"size-5 transition border border-neutral-300 rounded-full overflow-hidden",
				className,
			)}
		>
			<AvatarFallback
				className={cn(
					"bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
					fallbackClassName,
				)}
			>
				{name.charAt(0).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}

export default MemberAvatar;
