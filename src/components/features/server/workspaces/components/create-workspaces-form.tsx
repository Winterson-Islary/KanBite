"use client";
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
import { type ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateWorkspace } from "../api/useCreateWorkspace";
import { createWorkspaceSchema } from "../schemas/workspaces-schema";

type TCreateWorkspaceFormProps = {
	onCancel?: () => void;
};
export default function CreateWorkspaceForm({
	onCancel,
}: TCreateWorkspaceFormProps) {
	const { mutate, isPending } = useCreateWorkspace();
	const inputRef = useRef<HTMLInputElement>(null);

	const form = useForm<z.infer<typeof createWorkspaceSchema>>({
		resolver: zodResolver(createWorkspaceSchema),
		defaultValues: {
			name: "",
		},
	});
	const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
		const finalValues = {
			...values,
			image: values.image instanceof File ? values.image : "",
		};
		mutate({ form: finalValues }, { onSuccess: () => form.reset() });
	};
	const handleImageInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("image", file);
		}
	};

	return (
		<Card className="h-full w-full border-none shadow-none">
			<CardHeader className="p-2 lg:p-0 flex">
				<CardTitle className="text-xl font-bold">
					Create a new workspace
				</CardTitle>
			</CardHeader>
			<CardContent className="p-2 lg:p-0 lg:w-[500px]">
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
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => inputRef.current?.click()}
													className="hover:cursor-pointer w-fit mt-2"
												>
													Upload Image
												</Button>
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
								className="hover:cursor-pointer"
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="hover:cursor-pointer"
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
