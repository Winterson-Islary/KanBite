"use client";
import ResponsiveModal from "../../../ui/responsive-modal";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";
import CreateWorkspaceForm from "./create-project-form";

export default function CreateProjectModal() {
	const { isOpen, setIsOpen, close } = useCreateProjectModal();
	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateWorkspaceForm onCancel={close} />
		</ResponsiveModal>
	);
}
