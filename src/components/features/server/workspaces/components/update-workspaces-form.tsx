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
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useUpdateWorkspace } from "../api/useUpdateWorkspace";
import { updateWorkspaceSchema } from "../schemas/workspaces-schema";
import type { Workspace } from "../types/update-workspace-form";

type TUpdateWorkspaceFormProps = {
	onCancel?: () => void;
	initialValues: Workspace;
};
export default function UpdateWorkspaceForm({
	onCancel,
	initialValues,
}: TUpdateWorkspaceFormProps) {
	const router = useRouter();
	const { mutate, isPending } = useUpdateWorkspace();
	const inputRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
		resolver: zodResolver(updateWorkspaceSchema),
		defaultValues: {
			...initialValues,
			image: initialValues.imageUrl ?? "",
		},
	});
	const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
		const finalValues = {
			...values,
			image: values.image instanceof File ? values.image : "",
		};
		mutate(
			{ form: finalValues, param: { workspaceId: initialValues.$id } },
			{
				onSuccess: ({ data }) => {
					form.reset();
					router.push(`/workspaces/${data.$id}`);
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
			<CardHeader className="flex flex-row gap-x-4 items-center p-0">
				<Button
					variant="secondary"
					size="sm"
					onClick={
						onCancel
							? onCancel
							: () => router.push(`/workspaces/${initialValues.$id}`)
					}
					className="hover:cursor-pointer"
				>
					<ArrowLeftIcon />
					Back
				</Button>
				<CardTitle className="text-2xl font-bold">
					{initialValues.name}
				</CardTitle>
			</CardHeader>
			<CardContent className="p-2 lg:p-0 lg:w-full">
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
										<FormLabel className="text-lg">Workspace Name</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="Enter workspace name"
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
												<div className="size-[72px] rounded-md relative overflow-hidden">
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
													<p className="text-sm">Workspace Icon</p>
													<p className="text-sm text-muted-foreground">
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
															if (inputRef.current) {
																inputRef.current.value = "";
															}
														}}
														className="hover:cursor-pointer max-w-[9rem] mt-2"
													>
														Remove Image
													</Button>
												) : (
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => inputRef.current?.click()}
														className="hover:cursor-pointer max-w-[9rem] mt-2"
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
								className={cn(onCancel ?? "invisible hover:cursor-pointer")}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="hover:cursor-pointer"
								disabled={isPending}
							>
								Save Changes
							</Button>
						</section>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
