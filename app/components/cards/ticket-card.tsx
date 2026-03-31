import EditTicket from '~/routes/_user.my-events_.$slug/edit-ticket';
import FormatPrice from '../utility/format-price';
import { DeleteTicket } from '~/routes/_user.my-events_.$slug/delete-ticket';
import { Ticket as TicketIcon } from 'lucide-react';

// Assuming the Ticket type is defined in your types
export default function OrganiserTicketCard({ ticket }: { ticket: Ticket }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-4">
                {/* Subtle Theme Indicator */}
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
                    style={{
                        backgroundColor: `${ticket.theme}10`,
                        borderColor: `${ticket.theme}30`,
                        color: ticket.theme
                    }}
                >
                    <TicketIcon className="size-5 -rotate-45" strokeWidth={1} />
                </div>

                <div className="flex flex-col">
                    <h4 className="font-bold text-slate-900 tracking-tighter">
                        {ticket.name}
                    </h4>

                    {/* Clean Data Row */}
                    <div className="flex items-center gap-1.5 text-sm mt-0.5">
                        <span className="font-bold text-slate-700">
                            <FormatPrice price={ticket.price} />
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-slate-500 font-medium">
                            {ticket.quantityAvailable} available
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Utility Actions */}
            {/* Kept visible at all times—no hover gimmicks for core admin actions */}
            <div className="flex items-center gap-5 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                <div className="text-slate-500 hover:text-indigo-600 transition-colors">
                    <EditTicket ticket={ticket} />
                </div>
                <div className="text-slate-500 hover:text-rose-600 transition-colors">
                    <DeleteTicket ticket={ticket} />
                </div>
            </div>

        </div>
    )
}