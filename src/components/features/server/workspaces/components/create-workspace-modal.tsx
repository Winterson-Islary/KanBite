"use client";
import ResponsiveModal from "../../../ui/responsive-modal";
import { useCreateWorkspaceModal } from "../hooks/useCreateWorkspaceModal";
import CreateWorkspaceForm from "./create-workspaces-form";

export default function CreateWorkspaceModal() {
	const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();
	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateWorkspaceForm onCancel={close} />
		</ResponsiveModal>
	);
}
