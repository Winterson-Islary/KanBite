"use client";
import ResponsiveModal from "@/src/components/features/ui/responsive-modal";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { UpdateTaskFormWrapper } from "./update-task-form-wrapper";

export const UpdateTaskModal = () => {
	const { taskId, close } = useUpdateTaskModal();
	return (
		<ResponsiveModal open={!!taskId} onOpenChange={close}>
			{taskId && <UpdateTaskFormWrapper id={taskId} onCancel={close} />}
		</ResponsiveModal>
	);
};
