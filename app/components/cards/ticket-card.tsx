import EditTicket from '~/routes/_user.my-events_.$slug/edit-ticket'
import FormatPrice from '../utility/format-price'
import { DeleteTicket } from '~/routes/_user.my-events_.$slug/delete-ticket'
import { Ticket as TicketIcon } from 'lucide-react'

export default function TicketCard({ ticket, user = 'user' }: { ticket: Ticket, user?: "user" | 'organiser' }) {
    return (
        <div className="group relative w-full flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200">
            <div className="h-2 w-full" style={{ backgroundColor: ticket.theme }} />

            <div className="p-6 relative">
                <TicketIcon
                    className="absolute -right-4 -top-4 h-24 w-24 opacity-5 rotate-12 pointer-events-none"
                    style={{ color: ticket.theme }}
                />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div
                            className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3"
                            style={{ backgroundColor: `${ticket.theme}15`, color: ticket.theme }}
                        >
                            {ticket.name}
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter">
                            <FormatPrice price={ticket.price} />
                        </h4>
                    </div>
                    {user === 'organiser' && (
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <div className="hover:bg-white hover:text-indigo-600 rounded-lg transition-colors p-1" title="Edit Ticket">
                                <EditTicket ticket={ticket} />
                            </div>
                            <div className="w-px h-4 bg-slate-200 mx-1" />
                            <div className="hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors p-1" title="Delete Ticket">
                                <DeleteTicket ticket={ticket} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available</p>
                        <p className="text-lg font-black text-slate-700">{ticket.quantityAvailable} <span className="text-sm font-medium text-slate-400">units</span></p>
                    </div>
                </div>
            </div>

            <div className="relative flex items-center px-4">
                <div className="absolute -left-3 h-6 w-6 rounded-full bg-slate-50 border-r border-slate-200 shadow-inner" />
                <div className="w-full border-t-2 border-dashed border-slate-200" />
                <div className="absolute -right-3 h-6 w-6 rounded-full bg-slate-50 border-l border-slate-200 shadow-inner" />
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between">
                {/* Simulated Barcode */}
                <div className="flex gap-1 opacity-20 h-6 items-center mix-blend-multiply" style={{ color: ticket.theme }}>
                    <div className="w-0.5 h-full bg-current" />
                    <div className="w-2 h-full bg-current" />
                    <div className="w-0.5 h-full bg-current" />
                    <div className="w-0.5 h-full bg-current" />
                    <div className="w-1.5 h-full bg-current" />
                    <div className="w-0.5 h-full bg-current" />
                    <div className="w-2 h-full bg-current" />
                    <div className="w-0.5 h-full bg-current" />
                </div>
                <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Admit One
                </span>
            </div>
        </div>
    )
}