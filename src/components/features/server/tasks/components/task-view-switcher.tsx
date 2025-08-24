"use client";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/src/components/ui/tabs";
import { PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

function TaskViewSwitcher() {
	const { open } = useCreateTaskModal();
	return (
		<Tabs className="w-full flex-1">
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
				<article>
					<TabsContent value="table" className="mt-0">
						Data Table
					</TabsContent>
					<TabsContent value="kanban" className="mt-0">
						Data Kanban
					</TabsContent>
					<TabsContent value="calendar" className="mt-0">
						Data Calendar
					</TabsContent>
				</article>
			</div>
		</Tabs>
	);
}

export default TaskViewSwitcher;
