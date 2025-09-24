import {
	DragDropContext,
	Draggable,
	DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import React, { useEffect, useCallback, useState } from "react";
import type { Task } from "../types/task";
import { TaskStatus } from "../types/task-status";
import KanbanColumnHeader from "./kanban-column-header";

const boards: TaskStatus[] = [
	TaskStatus.DONE,
	TaskStatus.IN_PROGRESS,
	TaskStatus.IN_REVIEW,
	TaskStatus.PENDING,
	TaskStatus.TODO,
];
type TasksState = {
	[key in TaskStatus]: Task[];
};

interface DataKanbanProps {
	data: Task[];
}

export const DataKanban = ({ data }: DataKanbanProps) => {
	const [tasks, setTasks] = useState<TasksState>(() => {
		const initialTasks: TasksState = {
			[TaskStatus.PENDING]: [],
			[TaskStatus.IN_PROGRESS]: [],
			[TaskStatus.IN_REVIEW]: [],
			[TaskStatus.DONE]: [],
			[TaskStatus.TODO]: [],
		};
		for (const task of data) {
			initialTasks[task.status].push(task);
		}
		for (const status of Object.keys(initialTasks)) {
			initialTasks[status as TaskStatus].sort(
				(a, b) => a.position - b.position,
			);
		}
		return initialTasks;
	});
	return (
		<DragDropContext onDragEnd={() => {}}>
			<div className="flex overflow-x-auto">
				{boards.map((board) => (
					<div
						key={board}
						className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted p-1.5"
					>
						<KanbanColumnHeader board={board} taskCount={tasks[board].length} />
					</div>
				))}
			</div>
		</DragDropContext>
	);
};
