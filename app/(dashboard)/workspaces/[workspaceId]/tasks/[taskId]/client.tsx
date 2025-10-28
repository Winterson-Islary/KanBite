"use client";

import { useGetTask } from "@/src/components/features/server/tasks/api/use-get-task";
import TaskBreadcrumbs from "@/src/components/features/server/tasks/components/task-breadcrumbs";
import { useTaskId } from "@/src/components/features/server/tasks/hooks/use-task-id";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";

function TaskIdClient() {
	const taskId = useTaskId();
	const { data, isLoading } = useGetTask({ taskId });
	if (isLoading) return <PageLoader />;
	if (!data) return <PageError message="Task not found" />;

	return (
		<div className="h-full">
			<TaskBreadcrumbs project={data.project} task={data} />
		</div>
	);
}

export default TaskIdClient;
