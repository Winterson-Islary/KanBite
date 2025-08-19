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
import { useConfirm } from "@/src/hooks/useConfirm";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { useUpdateWorkspace } from "../api/use-update-workspace";
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
	const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
		useDeleteWorkspace();
	const [DeleteDialog, confirmDelete] = useConfirm(
		"Delete Workspace",
		"This action is irreversible. All the user data will be deleted.",
	);
	const handleDelete = async () => {
		const ok = await confirmDelete();
		if (!ok) return;
		deleteWorkspace(
			{ param: { workspaceId: initialValues.$id } },
			{
				onSuccess: () => {
					window.location.href = "/";
				},
			},
		);
	};
	const { mutate: resetInviteCode, isPending: isInviteResetPending } =
		useResetInviteCode();
	const [ResetInviteDialog, confirmReset] = useConfirm(
		"Reset Invite Code",
		"This action is irreversible. The old invite code will be invalidated.",
	);
	const handleReset = async () => {
		const ok = await confirmReset();
		if (!ok) return;
		resetInviteCode({ param: { workspaceId: initialValues.$id } });
	};

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
				onSuccess: () => {
					form.reset();
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
	const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
	const handleCopyInviteLink = () => {
		navigator.clipboard.writeText(fullInviteLink).then(() => {
			toast.success("Invite link copied to the clipboard");
		});
	};
	return (
		<div className="flex flex-col gap-y-4">
			<ResetInviteDialog />
			<DeleteDialog />
			<Card className="h-full w-full border-none shadow-none">
				<CardHeader className="flex flex-row items-center gap-x-4 p-0">
					<Button
						variant="secondary"
						size="sm"
						onClick={
							onCancel
								? onCancel
								: () => router.push(`/workspaces/${initialValues.$id}`)
						}
						className="font-light hover:cursor-pointer"
					>
						<ArrowLeftIcon />
						Back
					</Button>
					<CardTitle className="font-light text-3xl">
						{initialValues.name}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-2 lg:w-full lg:p-0">
					<Form {...form}>
						<form
							action="submit"
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-2"
						>
							<section
								id="form-field-container"
								className=" flex flex-col gap-5"
							>
								<FormField
									name="name"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-light text-xl">
												Workspace Name
											</FormLabel>
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
														<p className="text-sm">Workspace Icon</p>
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
																if (inputRef.current) {
																	inputRef.current.value = "";
																}
															}}
															className="mt-2 max-w-[9rem] font-medium hover:cursor-pointer"
														>
															Remove Image
														</Button>
													) : (
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => inputRef.current?.click()}
															className="mt-2 max-w-[9rem] hover:cursor-pointer"
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
							<section
								id="buttons-container"
								className="flex justify-end gap-2"
							>
								<Button
									type="button"
									variant="outline"
									onClick={onCancel}
									className={cn(
										onCancel ?? "invisible font-light hover:cursor-pointer",
									)}
									disabled={isPending}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="font-light hover:cursor-pointer"
									disabled={isPending || isDeletingWorkspace}
								>
									Save Changes
								</Button>
							</section>
							<Separator className="my-2" />
						</form>
					</Form>
				</CardContent>
			</Card>
			<Card className="h-full w-full border-none shadow-none">
				<CardContent className="p-2 lg:w-full lg:p-0">
					<div className="flex flex-col">
						<h2 className="font-light text-xl">Invite Members</h2>
						<p className="text-muted-foreground text-sm">
							You can easily invite your friends or colleagues using the code
							below.
						</p>
						<div className="mt-4 mb-2">
							<div className="flex items-center gap-x-2">
								<Input disabled value={fullInviteLink} />
								<Button
									onClick={handleCopyInviteLink}
									variant="secondary"
									className="size-9 hover:cursor-pointer"
								>
									<CopyIcon />
								</Button>
							</div>
						</div>
						<Button
							className="my-2 ml-auto w-fit max-w-[9rem] font-light hover:cursor-pointer"
							type="button"
							disabled={isPending || isDeletingWorkspace}
							onClick={handleReset}
						>
							Reset Code
						</Button>
					</div>
					<Separator className="my-2" />
				</CardContent>
			</Card>
			<Card className="h-full w-full border-none shadow-none">
				<CardContent className="p-2 lg:w-full lg:p-0">
					<div className="flex flex-col">
						<h2 className="font-light text-xl">Workspace Deletion Panel</h2>
						<p className="text-muted-foreground text-sm">
							Be aware that deleting this workspace is irreversible and will
							remove all of its associated data.
						</p>

						<Button
							className="my-2 ml-auto w-fit max-w-[9rem] font-light hover:cursor-pointer"
							type="button"
							disabled={isPending || isDeletingWorkspace}
							onClick={handleDelete}
						>
							Delete Workspace
						</Button>
					</div>
					<Separator className="my-2" />
				</CardContent>
			</Card>
		</div>
	);
}
