import { isPastEventDate } from "~/lib/utils";

export default function EventStatus({
    status,
    date,
    startTime
}:
    Pick<OrganiserEvent, "status" | "date" | "startTime"> &
    Partial<Pick<OrganiserEvent, "date" | "startTime">>) {
    const statusStyles: Record<string, string> = {
        draft: "bg-gray-100 text-primary",
        published: "bg-green-100 text-green-600",
        cancelled: "bg-red-50 text-red-600",
        completed: "bg-indigo-100 text-indigo-600",
        suspended: "bg-yellow-100 text-yellow-600",
    };

    const classes = statusStyles[status] ?? "bg-gray-50 text-gray-500";

    return (
        <span className={`w-max text-nowrap font-semibold capitalize tracking-tight px-3 py-1.5 rounded-md ${classes}`}>
            {date && startTime
                ? (
                    <>
                        {!isPastEventDate(date, startTime) && status === 'completed'
                            ? 'Sales closed'
                            : status
                        }
                    </>
                )
                : <>{status}</>
            }
        </span>
    );
}