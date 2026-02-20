export default function ProfileStatus({ status }: Pick<OrganiseProfile, "status">) {
    const statusStyles: Record<string, string> = {
        active: "bg-green-100 text-green-600",
        suspended: "bg-red-50 text-red-600",
        pending: "bg-yellow-100 text-yellow-600",
    };

    const classes = statusStyles[status] ?? "bg-gray-50 text-gray-500";

    return (
        <span className={`w-max text-[10px] text-nowrap uppercase font-bold tracking-tight px-1.5 py-0.5 rounded-md ${classes}`}>
            {status}
        </span>
    );
}