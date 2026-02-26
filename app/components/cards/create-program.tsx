import { BookOpen, Users, Share2, Sparkles } from 'lucide-react';
import EventProgram from '../custom/event-program';

export default function EventProgramPrompter({ event }: { event: any }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-linear-to-br from-white to-indigo-50/30 p-6 mt-8">
            {/* Subtle Background Icon Decoration */}
            <BookOpen className="absolute -right-4 -top-4 h-24 w-24 text-indigo-100/50 rotate-12" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                        <Sparkles strokeWidth={0} className="h-4 w-4 fill-current" />
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                        Feature Spotlight
                        <span className="rounded-full bg-pink-500 px-2 py-0.5 text-[9px] text-white animate-pulse">
                            New
                        </span>
                    </span>
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-900 mb-2">
                    Your Event Program
                </h3>

                <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500 mb-6">
                    Create a stunning digital experience for your fans. Build your program,
                    <span className="text-slate-900"> invite collaborators</span>, and share it instantly via QR code.
                </p>

                {/* Feature Mini-Grid */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-white/60 px-3 py-1.5 rounded-full border border-slate-100">
                        <Share2 className="h-3 w-3 text-indigo-500" /> Publicly Sharable
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-white/60 px-3 py-1.5 rounded-full border border-slate-100">
                        <Users className="h-3 w-3 text-indigo-500" /> Team Collaboration
                    </div>
                </div>

                {/* The Actual Component/Button */}
                <div className="w-full">
                    <EventProgram event={event} />
                </div>
            </div>
        </div>
    );
}