"use client";

import { redirect } from "next/navigation";
import { useGetWorkspaces } from "@/src/components/features/server/workspaces/api/use-get-workspaces";
import PageError from "@/src/components/features/ui/page-error";
import PageLoader from "@/src/components/features/ui/page-loader";

function DashboardClient() {
	const { data, isLoading } = useGetWorkspaces();
	if (isLoading) return <PageLoader />;
	if (!data) return <PageError message="Failed to load workspace" />;

	if (data.total === 0) {
		redirect("/workspaces/create");
	} else {
		redirect(`/workspaces/${data.documents[0].$id}`);
	}
}

export default DashboardClient;
