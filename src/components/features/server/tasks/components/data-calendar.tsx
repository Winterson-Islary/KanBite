import {
	addMonths,
	format,
	getDay,
	parse,
	startOfWeek,
	subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { Task } from "../types/task";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";

const locales = {
	"en-US": enUS,
};
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

interface DataCalendarProps {
	data: Task[];
}

function DataCalendar({ data }: DataCalendarProps) {
	const [value, setValue] = useState(
		data?.length > 0 ? new Date(data[0].dueDate) : new Date(),
	);
	const events = data.map((task) => ({
		start: new Date(task.dueDate),
		end: new Date(task.dueDate),
		title: task.name,
		project: task.project,
		assignee: task.assignee,
		status: task.status,
		id: task.$id,
	}));
	const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
		switch (action) {
			case "PREV":
				setValue(subMonths(value, 1));
				break;
			case "NEXT":
				setValue(addMonths(value, 1));
				break;
			case "TODAY":
				setValue(new Date());
		}
	};

	return (
		<Calendar
			localizer={localizer}
			date={value}
			events={events}
			views={["month"]}
			defaultView="month"
			toolbar
			showAllEvents
			className="h-full"
			max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
			formats={{
				weekdayFormat: (date, culture, localizer) =>
					localizer?.format(date, "EEE", culture) ?? "",
			}}
		/>
	);
}

export default DataCalendar;
