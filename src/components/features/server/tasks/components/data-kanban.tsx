import {
	DragDropContext,
	Draggable,
	type DropResult,
	Droppable,
} from "@hello-pangea/dnd";
import React, { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/task";
import { TaskStatus } from "../types/task-status";
import KanbanCard from "./kanban-card";
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
	onChange: (
		tasks: { $id: string; status: TaskStatus; position: number }[],
	) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
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
	useEffect(() => {
		const newTasks: TasksState = {
			[TaskStatus.PENDING]: [],
			[TaskStatus.IN_PROGRESS]: [],
			[TaskStatus.IN_REVIEW]: [],
			[TaskStatus.DONE]: [],
			[TaskStatus.TODO]: [],
		};
		for (const task of data) {
			newTasks[task.status].push(task);
		}
		for (const status of Object.keys(newTasks)) {
			newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
		}
		setTasks(newTasks);
	}, [data]);
	const onDragEnd = useCallback(
		(result: DropResult) => {
			if (!result.destination) return;
			const { source, destination } = result;
			const sourceStatus = source.droppableId as TaskStatus;
			const destinationStatus = destination.droppableId as TaskStatus;

			let updatesPayload: {
				$id: string;
				status: TaskStatus;
				position: number;
			}[] = [];

			setTasks((prevTasks) => {
				const newTasks = { ...prevTasks };
				const sourceColumn = [...newTasks[sourceStatus]];
				const [movedTask] = sourceColumn.splice(source.index, 1);
				if (!movedTask) return prevTasks;
				const updatedMovedTask =
					sourceStatus !== destinationStatus
						? { ...movedTask, status: destinationStatus }
						: movedTask;
				// update the source column
				newTasks[sourceStatus] = sourceColumn;
				// add the task to the destination column
				const destColumn = [...newTasks[destinationStatus]];
				destColumn.splice(destination.index, 0, updatedMovedTask);
				newTasks[destinationStatus] = destColumn;

				// updates payload, array of updated task details to be sent to the backend
				updatesPayload = [];
				updatesPayload.push({
					$id: updatedMovedTask.$id,
					status: destinationStatus,
					position: Math.min((destination.index + 1) * 1000, 1_000_000),
				});
				// update position for affected tasks due to moved task in the destination column
				newTasks[destinationStatus].forEach((task, index) => {
					if (task && task.$id !== updatedMovedTask.$id) {
						const newPosition = Math.min(index + 1 * 1000, 1_000_000);
						if (task.position !== newPosition) {
							updatesPayload.push({
								$id: task.$id,
								status: destinationStatus,
								position: newPosition,
							});
						}
					}
				});
				// moving tasks between columns
				if (sourceStatus !== destinationStatus) {
					newTasks[sourceStatus].forEach((task, index) => {
						if (task) {
							const newPosition = Math.min((index + 1) * 1000, 1_000_000);
							if (task.position !== newPosition)
								updatesPayload.push({
									$id: task.$id,
									status: sourceStatus,
									position: newPosition,
								});
						}
					});
				}
				return newTasks;
			});
			onChange(updatesPayload);
		},
		[onChange],
	);
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="flex overflow-x-auto">
				{boards.map((board) => (
					<div
						key={board}
						className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted p-1.5"
					>
						<KanbanColumnHeader board={board} taskCount={tasks[board].length} />
						<Droppable droppableId={board}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="min-h-[200px] py-1.5"
								>
									{tasks[board].map((task, index) => (
										<Draggable
											key={task.$id}
											draggableId={task.$id}
											index={index}
										>
											{(provided) => (
												<div
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef}
												>
													<KanbanCard task={task} />
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				))}
			</div>
		</DragDropContext>
	);
};
