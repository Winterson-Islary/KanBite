"use client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
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
import { Separator } from "@/src/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useWorkspaceId } from "../../workspaces/hooks/useWorkspaceId";
import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema } from "../schemas/projects-schema";

type TCreateProjectFormProps = {
	onCancel?: () => void;
};
const schemaWithoutWorkspace = createProjectSchema.omit({ workspaceId: true });
export default function CreateProjectForm({
	onCancel,
}: TCreateProjectFormProps) {
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const { mutate, isPending } = useCreateProject();
	const inputRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof schemaWithoutWorkspace>>({
		resolver: zodResolver(schemaWithoutWorkspace),
		defaultValues: {
			name: "",
		},
	});
	const onSubmit = (values: z.infer<typeof schemaWithoutWorkspace>) => {
		const finalValues = {
			...values,
			workspaceId,
			image: values.image instanceof File ? values.image : "",
		};
		mutate(
			{ form: finalValues },
			{
				onSuccess: ({ data }) => {
					form.reset();
					//! Redirect to project screen
				},
			},
		);
	};
	const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("image", file);
		}
	};

	return (
		<Card className="h-full w-full border-none shadow-none">
			<CardHeader className="flex p-2 lg:p-0">
				<CardTitle className="font-light text-3xl">
					Create a new project
				</CardTitle>
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
											Project Name
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Enter a project name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="image"
								control={form.control}
								render={({ field }) => (
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center gap-x-5">
											{field.value ? (
												<div className="relative size-[72px] overflow-hidden rounded-md">
													<Image
														alt="workspace image"
														fill
														className="object-cover"
														src={
															field.value instanceof File
																? URL.createObjectURL(field.value)
																: field.value
														}
													/>
												</div>
											) : (
												<Avatar className="size-[72px]">
													<AvatarFallback className="size-[72px] text-neutral-300">
														<ImageIcon />
													</AvatarFallback>
												</Avatar>
											)}
											<div className="flex flex-col gap-2">
												<article>
													<p className="font-light text-md ">Project Icon</p>
													<p className="text-muted-foreground text-sm">
														JPG, PNG, JPEG or SVG, max 1MB
													</p>
												</article>
												<input
													type="file"
													accept=".jpg, .jpeg, .svg, .png"
													ref={inputRef}
													onChange={handleImageInputChange}
													disabled={isPending}
													className="hidden"
												/>
												{field.value ? (
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => {
															field.onChange("");
															if (inputRef.current) inputRef.current.value = "";
														}}
														className="mt-2 max-w-[9rem] font-light text-sm uppercase hover:cursor-pointer"
													>
														Remove Image
													</Button>
												) : (
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => inputRef.current?.click()}
														className="mt-2 max-w-[9rem] font-light text-sm uppercase hover:cursor-pointer"
													>
														Upload Image
													</Button>
												)}
											</div>
										</div>
									</div>
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
