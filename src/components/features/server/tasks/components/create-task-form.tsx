"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { DatePicker } from "../../../ui/date-picker";
import MemberAvatar from "../../members/components/member-avatar";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useCreateTask } from "../api/use-create-task";
import { createTaskSchema } from "../schemas/tasks-schema";

type TCreateTaskFormProps = {
	onCancel?: () => void;
	projectOptions: { id: string; name: string; imageUrl: string }[];
	memberOptions: { id: string; name: string }[];
};
export default function CreateTaskForm({
	onCancel,
	projectOptions,
	memberOptions,
}: TCreateTaskFormProps) {
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const { mutate, isPending } = useCreateTask();
	const inputRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof createTaskSchema>>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			workspaceId,
		},
	});
	const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
		mutate(
			{ json: { ...values, workspaceId } },
			{
				onSuccess: () => {
					form.reset();
				},
			},
		);
	};

	return (
		<Card className="h-full w-full border-none shadow-none">
			<CardHeader className="flex p-2 lg:p-0">
				<CardTitle className="font-light text-3xl">Create a new task</CardTitle>
			</CardHeader>
			<CardContent className="p-2 lg:w-full lg:p-0">
				<Form {...form}>
					<form
						action="submit"
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-2"
					>
						<section id="form-field-container" className=" flex flex-col gap-5">
							<FormField
								name="name"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-light text-lg ">
											Task Name
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Enter task name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="dueDate"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-light text-lg ">
											Due Date
										</FormLabel>
										<FormControl>
											<DatePicker {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="assigneeId"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-light text-lg ">
											Assignee
										</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select assignee" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{memberOptions.map((member) => (
													<SelectItem key={member.id} value={member.id}>
														<div className="flex items-center gap-x-2">
															<MemberAvatar
																className="size-6"
																name={member.name}
															/>
															{member.name}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormItem>
								)}
							/>
						</section>
						<Separator className="my-2" />
						<section id="buttons-container" className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								className={cn(
									"font-light text-sm uppercase hover:cursor-pointer",
									onCancel ?? "invisible",
								)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="font-light text-sm uppercase hover:cursor-pointer"
								disabled={isPending}
							>
								Create
							</Button>
						</section>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
