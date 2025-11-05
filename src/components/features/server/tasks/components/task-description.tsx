import { PencilIcon, XIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Textarea } from "@/src/components/ui/textarea";
import { useUpdateTask } from "../api/use-update-task";
import type { Task } from "../types/task";

interface TaskDescriptionProps {
	task: Task;
}

function TaskDescription({ task }: TaskDescriptionProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(task.description || "");
	const { mutate, isPending } = useUpdateTask();

	const handleSave = () => {
		mutate(
			{
				json: { description: value },
				param: { taskId: task.$id },
			},
			{
				onSuccess: () => {
					setIsEditing(false);
				},
			},
		);
	};
	return (
		<div className="rounded-xl border p-4">
			<section className="flex items-center justify-between">
				<p className="font-semibold text-lg">Description</p>
				<Button
					size="sm"
					variant="outline"
					onClick={() => setIsEditing((prev) => !prev)}
				>
					{isEditing ? (
						<XIcon className="size-4" />
					) : (
						<PencilIcon className="size-4" />
					)}
					{isEditing ? "Cancel" : "Edit"}
				</Button>
			</section>
			<Separator className="my-2" />
			<section className="flex flex-col gap-y-4">
				{isEditing ? (
					<Fragment>
						<article>
							<Textarea
								placeholder="Add a description..."
								value={value}
								rows={4}
								onChange={(e) => setValue(e.target.value)}
								disabled={isPending}
							/>
						</article>
						<Button
							className="ml-auto w-fit"
							onClick={handleSave}
							disabled={isPending}
						>
							{isPending ? "Saving..." : "Save Changes"}
						</Button>
					</Fragment>
				) : (
					<article>
						<p>
							{task.description || (
								<span className="text-muted-foreground">
									No description set
								</span>
							)}
						</p>
					</article>
				)}
			</section>
		</div>
	);
}

export default TaskDescription;
