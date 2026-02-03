import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { ReactNode } from "react";

export default function TransactionStatus({ status }: Pick<TicketPurchase, 'status'>) {
    const statusStyles: Record<string, string> = {
        refunded: "bg-gray-100 text-primary",
        completed: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-destructive",
        pending: "bg-yellow-100 text-yellow-600",
    };

    const icons: Record<string, ReactNode> = {
        refunded: <XCircle strokeWidth={3} className="size-2.5" />,
        completed: <CheckCircle strokeWidth={3} className="size-2.5" />,
        failed: <XCircle strokeWidth={3} className="size-2.5" />,
        pending: <Clock strokeWidth={3} className="size-2.5" />,
    };

    const classes = statusStyles[status] ?? "bg-gray-50 text-gray-500";

    return (
        <div className="capitalize flex items-center gap-1 tracking-tight">
            {/* <span>{status}</span> */}
            <div className={`size-4 rounded-sm ${classes}`}>
                <div className="flex items-center justify-center h-full">{icons[status]}</div>
            </div>
        </div>
    );
}