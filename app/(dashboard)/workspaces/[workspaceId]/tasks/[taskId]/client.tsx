"use client";

import { useGetTask } from "@/src/components/features/server/tasks/api/use-get-task";
import TaskBreadcrumbs from "@/src/components/features/server/tasks/components/task-breadcrumbs";
import TaskDescription from "@/src/components/features/server/tasks/components/task-description";
import TaskOverview from "@/src/components/features/server/tasks/components/task-overview";
import { useTaskId } from "@/src/components/features/server/tasks/hooks/use-task-id";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";
import { Separator } from "@/src/components/ui/separator";

function TaskIdClient() {
	const taskId = useTaskId();
	const { data, isLoading } = useGetTask({ taskId });
	if (isLoading) return <PageLoader />;
	if (!data) return <PageError message="Task not found" />;

	return (
		<div className="h-full">
			<TaskBreadcrumbs project={data.project} task={data} />
			<Separator className="my-4" />
			<section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<TaskOverview task={data} />
				<TaskDescription task={data} />
			</section>
		</div>
	);
}

export default TaskIdClient;
