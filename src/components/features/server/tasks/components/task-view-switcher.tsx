"use client";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/src/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import type { TaskStatus } from "../types/task-status";
import DataCalendar from "./data-calendar";
import { columns } from "./data-columns";
import DataFilters from "./data-filters";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";

function TaskViewSwitcher() {
	const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
	const [{ status, projectId, dueDate, assigneeId, search }] = useTaskFilters();
	const workspaceId = useWorkspaceId();
	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
		search,
		status,
		projectId,
		assigneeId,
		dueDate,
	});
	const { mutate: bulkUpdate } = useBulkUpdateTask();
	const onKanbanChange = useCallback(
		(tasks: { $id: string; status: TaskStatus; position: number }[]) => {
			bulkUpdate({ json: { tasks } });
		},
		[bulkUpdate],
	);
	const { open } = useCreateTaskModal();
	return (
		<Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1">
			<div className="flex h-full flex-col overflow-auto pb-5">
				<div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
					<TabsList className="w-full lg:w-auto">
						<TabsTrigger value="table" className="h-8 w-full lg:w-auto">
							Table
						</TabsTrigger>
						<TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
							Kanban
						</TabsTrigger>
						<TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
							Calendar
						</TabsTrigger>
					</TabsList>
					<Button
						size="sm"
						className="w-full hover:cursor-pointer lg:w-auto"
						onClick={open}
					>
						<PlusIcon className="size-4" />
						New
					</Button>
				</div>
				<Separator className="my-4" />
				<DataFilters />
				<Separator className="my-4" />
				{isLoadingTasks ? (
					<article className="flex h-[200px] w-full flex-col items-center justify-center border">
						<Loader className="size-5 animate-spin text-muted-foreground" />
					</article>
				) : (
					<article>
						<TabsContent value="table" className="mt-0">
							<DataTable columns={columns} data={tasks?.documents ?? []} />
						</TabsContent>
						<TabsContent value="kanban" className="mt-0">
							<DataKanban
								onChange={onKanbanChange}
								data={tasks?.documents ?? []}
							/>
						</TabsContent>
						<TabsContent value="calendar" className="mt-0">
							<DataCalendar data={tasks?.documents ?? []} />
						</TabsContent>
					</article>
				)}
			</div>
		</Tabs>
	);
}

export default TaskViewSwitcher;
