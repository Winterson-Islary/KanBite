"use client";

import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useGetMembers } from "@/src/components/features/server/members/api/use-get-members";
import MemberAvatar from "@/src/components/features/server/members/components/member-avatar";
import type { Member } from "@/src/components/features/server/members/types/member";
import { useGetProjects } from "@/src/components/features/server/projects/api/use-get-projects";
import ProjectAvatar from "@/src/components/features/server/projects/components/project-avatar";
import { useCreateProjectModal } from "@/src/components/features/server/projects/hooks/use-create-project-modal";
import type { Project } from "@/src/components/features/server/projects/types/project";
import { useGetTasks } from "@/src/components/features/server/tasks/api/use-get-tasks";
import { useCreateTaskModal } from "@/src/components/features/server/tasks/hooks/use-create-task-modal";
import type { Task } from "@/src/components/features/server/tasks/types/task";
import { useGetWorkspaceAnalytics } from "@/src/components/features/server/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/src/components/features/server/workspaces/hooks/useWorkspaceId";
import Analytics from "@/src/components/features/ui/analytics";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";

export default function WorkspaceIdClient() {
	const workspaceId = useWorkspaceId();
	const { data: analytics, isLoading: isLoadingAnalytics } =
		useGetWorkspaceAnalytics({ workspaceId });
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
	});
	const tasksData: Task[] =
		tasks?.documents.map((item) => {
			return { ...item, dueDate: new Date(item.dueDate) };
		}) || [];

	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	const isLoading =
		isLoadingAnalytics ||
		isLoadingProjects ||
		isLoadingTasks ||
		isLoadingMembers;
	if (isLoading) return <PageLoader />;
	if (!analytics || !projects || !tasks || !members)
		return <PageError message="Failed to get analytics" />;

	return (
		<article className="flex h-full flex-col space-y-4">
			<Analytics data={analytics} />
			<TaskList
				data={tasksData}
				total={tasks.total}
				workspaceId={workspaceId}
			/>
			<ProjectList
				data={projects.documents}
				total={projects.total}
				workspaceId={workspaceId}
			/>

			<MembersList
				data={members.documents}
				total={members.total}
				workspaceId={workspaceId}
			/>
		</article>
	);
}

interface TaskListProps {
	data: Task[];
	total: number;
	workspaceId: string;
}
function TaskList({ data, total, workspaceId }: TaskListProps) {
	const { open: createTask } = useCreateTaskModal();
	return (
		<div className="col-span-1 flex flex-col gap-y-4">
			<section className="w-full rounded-lg bg-muted p-4">
				<div className="flex items-center justify-between">
					<p className="font-medium text-xl">Tasks ({total})</p>
					<Button variant="outline" size="icon" onClick={createTask}>
						<PlusIcon className="size-4 text-neutral-400" />
					</Button>
				</div>
				<Separator className="my-4" />
				<ul className="flex flex-col gap-y-2">
					{data.map((task) => (
						<li key={task.$id}>
							<Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
								<Card className="rounded-lg shadow-none transition hover:opacity-75">
									<CardContent className="p-4">
										<p className="truncate font-medium text-lg">{task.name}</p>
										<div className="flex items-center gap-x-4">
											<p className="text-sm">{task.project?.name}</p>
											<div className="flex items-center text-muted-foreground text-sm">
												<CalendarIcon className="mr-1 size-3" />
												<span className="truncate">
													{formatDistanceToNow(new Date(task.dueDate))}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}
					<li className="hidden text-center text-muted-foreground text-sm first-of-type:block">
						No tasks found
					</li>
				</ul>
				<div className="ml-auto flex">
					<Button className="mt-4 w-full lg:ml-auto lg:w-auto" asChild>
						<Link href={`/workspaces/${workspaceId}/tasks`}>Show all</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}

interface ProjectListProps {
	data: Project[];
	total: number;
	workspaceId: string;
}
function ProjectList({ data, total, workspaceId }: ProjectListProps) {
	const { open: createProject } = useCreateProjectModal();
	return (
		<div className="col-span-1 flex flex-col gap-y-4">
			<section className="w-full rounded-lg bg-muted p-4">
				<div className="flex items-center justify-between">
					<p className="font-medium text-xl">Projects ({total})</p>
					<Button variant="outline" size="icon" onClick={createProject}>
						<PlusIcon className="size-4 text-neutral-400" />
					</Button>
				</div>
				<Separator className="my-4" />
				<ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{data.map((project) => (
						<li key={project.$id}>
							<Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
								<Card className="rounded-lg shadow-none transition hover:opacity-75">
									<CardContent className="flex items-center gap-x-2.5 p-4">
										<ProjectAvatar
											name={project.name}
											className="size-10"
											fallbackClassname="text-lg"
											image={project.imageUrl}
										/>
										<p className="truncate font-medium text-sm">
											{project.name}
										</p>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}
					<li className="hidden text-center text-muted-foreground text-sm first-of-type:block">
						No projects found
					</li>
				</ul>
			</section>
		</div>
	);
}

interface MembersListProps {
	data: Member[];
	total: number;
	workspaceId: string;
}
function MembersList({ data, total, workspaceId }: MembersListProps) {
	return (
		<div className="col-span-1 flex flex-col gap-y-4">
			<section className="w-full rounded-lg bg-muted p-4">
				<div className="flex items-center justify-between">
					<p className="font-medium text-xl">Members ({total})</p>
					<Button variant="outline" size="icon" asChild>
						<Link href={`/workspaces/${workspaceId}/members`}>
							<SettingsIcon className="size-4 text-neutral-400" />
						</Link>
					</Button>
				</div>
				<Separator className="my-4" />
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{data.map((member) => (
						<li key={member.$id}>
							<Card className="overflow-hidden rounded-lg shadow-none">
								<CardContent className="flex flex-col items-center gap-x-2 p-3">
									<MemberAvatar name={member.name} className="size-10" />
									<div className="flex flex-col items-center overflow-hidden">
										<p className="line-clamp-1 font-medium text-lg">
											{member.name}
										</p>
										<p className="line-clamp-1 text-muted-foreground text-sm">
											{member.email}
										</p>
									</div>
								</CardContent>
							</Card>
						</li>
					))}
					<li className="hidden text-center text-muted-foreground text-sm first-of-type:block">
						No members found
					</li>
				</ul>
			</section>
		</div>
	);
}
