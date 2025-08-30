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
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

function TaskViewSwitcher() {
	const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
	const workspaceId = useWorkspaceId();
	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
	});
	const { open } = useCreateTaskModal();
	return (
		<Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1">
			<div className="flex h-full flex-col overflow-auto">
				<div className="flex flex-col items-center justify-between gap-3 border-b pb-2 lg:flex-row">
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
				<h1>Data Filters</h1>
				<Separator className="my-4" />
				{isLoadingTasks ? (
					<article className="flex h-[200px] w-full flex-col items-center justify-center border">
						<Loader className="size-5 animate-spin text-muted-foreground" />
					</article>
				) : (
					<article>
						<TabsContent value="table" className="mt-0">
							{JSON.stringify(tasks)}
						</TabsContent>
						<TabsContent value="kanban" className="mt-0">
							{JSON.stringify(tasks)}
						</TabsContent>
						<TabsContent value="calendar" className="mt-0">
							{JSON.stringify(tasks)}
						</TabsContent>
					</article>
				)}
			</div>
		</Tabs>
	);
}

export default TaskViewSwitcher;
