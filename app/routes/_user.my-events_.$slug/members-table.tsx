import { Trash, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";

export default function MembersTable({ members }: { members: any[] }) {
    if (!members || members.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex flex-col gap-3">
                {members.map((member) => {
                    // Extract initials for the avatar (fallback to '?' if missing)
                    const initials = member.name 
                        ? member.name.substring(0, 2).toUpperCase() 
                        : (member.email ? member.email.substring(0, 2).toUpperCase() : '?');
                    
                    const isPending = member.status?.toLowerCase() === 'pending';

                    return (
                        <div 
                            key={member.id} 
                            className="flex flex-col items-start justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all gap-4 group"
                        >
                            {/* 1. Member Identity */}
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-sm font-black text-white shadow-inner ${isPending ? 'bg-slate-300' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'}`}>
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 tracking-tight">
                                        {member.name || 'Awaiting Registration'}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                                        <Mail className="size-3 text-slate-400" /> {member.email}
                                    </p>
                                </div>
                            </div>

                            {/* 2. Role & Status Badges */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
                                        {member.role?.toLowerCase() === 'admin' 
                                            ? <ShieldAlert className="size-3 text-indigo-500" /> 
                                            : <ShieldCheck className="size-3 text-emerald-500" />
                                        }
                                        {member.role}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isPending ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {member.status}
                                    </span>
                                </div>

                                {/* 3. Actions */}
                                <div className="flex items-center gap-1 pl-2 border-l border-slate-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    {/* <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full cursor-pointer"
                                        title="Edit Role"
                                    >
                                        <Pen className="size-3.5" />
                                    </Button> */}
                                    
                                    <Form method="POST" className="m-0">
                                        <input type="hidden" name="memberId" value={member.id} />
                                        <input type="hidden" name="type" value="member.delete"/>
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer"
                                            title="Remove Member"
                                            onClick={(e) => {
                                                if (!confirm(`Are you sure you want to remove ${member.name || member.email}?`)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <Trash className="size-3.5" />
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Summary */}
            <div className="mt-4 px-4 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Total Team Size</span>
                <span>{members.length} Member{members.length !== 1 ? 's' : ''}</span>
            </div>
        </div>
    );
}