"use client";
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
	const form = useForm<z.infer<typeof createWorkspaceSchema>>({
		resolver: zodResolver(createWorkspaceSchema),
		defaultValues: {
			name: "",
		},
	});
	const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
		mutate({ json: values });
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
						<section id="form-field-container" className="flex-col">
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
