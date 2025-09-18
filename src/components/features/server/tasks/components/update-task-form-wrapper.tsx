import { Card, CardContent } from "@/src/components/ui/card";
import { Loader } from "lucide-react";
import { useGetMembers } from "../../members/api/use-get-members";
import { useGetProjects } from "../../projects/api/use-get-projects";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useGetTask } from "../api/use-get-task";
import UpdateTaskForm from "./update-task-form";

interface UpdateTaskFormWrapperProps {
	id: string;
	onCancel: () => void;
}

export const UpdateTaskFormWrapper = ({
	id,
	onCancel,
}: UpdateTaskFormWrapperProps) => {
	const workspaceId = useWorkspaceId();

	const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
		taskId: id,
	});
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
	const isLoading = isLoadingMembers || isLoadingProjects || isLoadingTask;
	if (isLoading) {
		return (
			<Card className="h-[714px] w-full border-none shadow-none">
				<CardContent className="flex h-full items-center justify-center">
					<Loader className="size-5 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}
	if (!initialValues) return null;

	return (
		<main>
			<UpdateTaskForm
				onCancel={onCancel}
				projectOptions={projectDetailsList ?? []}
				memberOptions={memberDetailsList ?? []}
				initialValues={initialValues}
			/>
		</main>
	);
};
