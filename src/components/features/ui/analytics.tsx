import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import type { ProjectAnalyticsResponseType } from "../server/projects/api/use-get-project-analytics";
import AnalyticsCard from "./analytics-card";

interface AnalyticsProps {
	data: ProjectAnalyticsResponseType;
}

export default function Analytics({ data }: AnalyticsProps) {
	return (
		<ScrollArea className="w-full whitespace-nowrap rounded-lg border">
			<div className="flex w-full items-center justify-center p-2">
				<div className="flex-1 shrink-0">
					<AnalyticsCard
						title="Total tasks"
						value={data.currentMonthTasksCount}
						variant={
							data.currentPreviousTasksCountDifference > 0 ? "up" : "down"
						}
						increaseValue={data.currentPreviousTasksCountDifference}
					/>
				</div>
				<div className="flex-1 shrink-0">
					<AnalyticsCard
						title="Assigned tasks"
						value={data.currentMonthAssignedTasksCount}
						variant={
							data.currentPreviousMonthAssignedTasksCountDifference > 0
								? "up"
								: "down"
						}
						increaseValue={
							data.currentPreviousMonthAssignedTasksCountDifference
						}
					/>
				</div>
				<div className="flex-1 shrink-0">
					<AnalyticsCard
						title="Completed tasks"
						value={data.currentMonthCompletedTasksCount}
						variant={
							data.currentPreviousMonthCompletedTasksCountDifference > 0
								? "up"
								: "down"
						}
						increaseValue={
							data.currentPreviousMonthCompletedTasksCountDifference
						}
					/>
				</div>
				<div className="flex-1 shrink-0">
					<AnalyticsCard
						title="Overdue tasks"
						value={data.currentMonthPendingTasksCount}
						variant={
							data.currentPreviousMonthPendingTasksCountDifference > 0
								? "up"
								: "down"
						}
						increaseValue={data.currentPreviousMonthPendingTasksCountDifference}
					/>
				</div>
				<div className="flex-1 shrink-0">
					<AnalyticsCard
						title="Incomplete tasks"
						value={data.currentMonthIncompleteTasksCount}
						variant={
							data.currentPreviousMonthIncompleteTasksCountDifference > 0
								? "up"
								: "down"
						}
						increaseValue={
							data.currentPreviousMonthIncompleteTasksCountDifference
						}
					/>
				</div>
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
