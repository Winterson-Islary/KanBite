import { Card, CardContent } from "@/src/components/ui/card";
import { Loader } from "lucide-react";
import { useGetMembers } from "../../members/api/use-get-members";
import { useGetProjects } from "../../projects/api/use-get-projects";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import CreateTaskForm from "./create-task-form";

interface CreateTaskFormWrapperProps {
	onCancel: () => void;
}

export const CreateTaskFormWrapper = ({
	onCancel,
}: CreateTaskFormWrapperProps) => {
	const workspaceId = useWorkspaceId();
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	const projectDetailsList = projects?.documents.map((project) => ({
		id: project.$id,
		name: project.name,
		imageUrl: project.imageUrl,
	}));
	const memberDetailsList = members?.documents.map((member) => ({
		id: member.$id,
		name: member.name,
	}));
	const isLoading = isLoadingMembers || isLoadingProjects;
	if (isLoading) {
		return (
			<Card className="h-[714px] w-full border-none shadow-none">
				<CardContent className="flex h-full items-center justify-center">
					<Loader className="size-5 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	return (
		<main>
			<CreateTaskForm
				onCancel={onCancel}
				projectOptions={projectDetailsList ?? []}
				memberOptions={memberDetailsList ?? []}
			/>
		</main>
	);
};
