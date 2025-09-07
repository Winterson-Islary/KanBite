"use client";

import { Button } from "@/src/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import MemberAvatar from "../../members/components/member-avatar";
import ProjectAvatar from "../../projects/components/project-avatar";
import type { Task } from "../types/task";

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="hover:cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Task Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const name = row.original.name;
			return <p className="line-clamp-1">{name}</p>;
		},
	},
	{
		accessorKey: "project",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="hover:cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Project
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const project = row.original.project;
			return (
				<div className="flex items-center gap-x-2 font-medium text-sm">
					<ProjectAvatar
						className="size-6"
						name={project.name}
						image={project.imageUrl}
					/>
					<p className="line-clamp-1">{project.name}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "assignee",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="hover:cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Assignee
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const assignee = row.original.assignee;
			return (
				<div className="flex items-center gap-x-2 font-medium text-sm">
					<MemberAvatar
						className="size-6"
						fallbackClassName="text-xs"
						name={assignee.name}
					/>
					<p className="line-clamp-1">{assignee.name}</p>
				</div>
			);
		},
	},
];
