import { useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import { PartyPopper, Copy, Check } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';

interface EventPublishedModalProps {
    eventSlug?: string;
}

export default function EventPublishedModal({ eventSlug }: EventPublishedModalProps) {
    const [params, setParams] = useSearchParams();
    const [copied, setCopied] = useState(false);
    const [origin, setOrigin] = useState('https://ariapass.africa');

    const isOpen = params.get('status') === 'published';

    // Safely get the window origin on mount to avoid hydration mismatch
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrigin(window.location.origin);
        }
    }, []);

    const eventUrl = `${origin}/events/${eventSlug || ''}`;

    const closeModal = () => {
        setParams((prev) => {
            prev.delete('status');
            return prev;
        });
        setTimeout(() => setCopied(false), 300);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) closeModal();
        }}>
            {/* Changed width logic: w-[calc(100vw-2rem)] ensures it never touches 
              the edges of a small mobile screen, but caps at max-w-md on desktop.
            */}
            <DialogContent className="bg-white border-0 shadow-2xl rounded-[2rem] p-0 overflow-hidden w-[calc(100vw-2rem)] sm:w-full max-w-md mx-auto">

                {/* Decorative Header Banner */}
                <div className="bg-gradient-to-br from-indigo-700 to-primary-theme h-28 sm:h-32 relative flex items-center justify-center shrink-0">
                    <div className="absolute top-4 left-6 w-3 h-3 bg-white/20 rounded-full" />
                    <div className="absolute bottom-6 right-8 w-4 h-4 bg-white/20 rounded-full" />
                    <div className="absolute top-8 right-12 w-2 h-2 bg-white/30 rounded-full" />

                    {/* Center Icon Badge */}
                    <div className="absolute -bottom-8 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center rotate-3">
                        <PartyPopper className="size-8 text-indigo-600 -rotate-3" strokeWidth={2.5} />
                    </div>
                </div>

                <div className="pt-12 pb-6 px-5 sm:px-8 text-center flex flex-col">
                    <DialogHeader className="mb-6 space-y-2">
                        <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Your event is live!
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500 leading-relaxed">
                            Congratulations! Your event has been successfully published. Now it's time to spread the word and sell out those tickets.
                        </DialogDescription>
                    </DialogHeader>

                    {/* The Link Copy Box */}
                    <div className="mb-8 w-full">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest text-left mb-2 ml-1">
                            Shareable Link
                        </p>
                        <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-full">
                            {/* min-w-0 is the magic class that stops the URL from breaking the mobile layout */}
                            <div className="flex-1 min-w-0 px-2 sm:px-3">
                                <p className="text-xs sm:text-sm font-medium text-slate-600 truncate select-all">
                                    {eventUrl}
                                </p>
                            </div>
                            <Button
                                onClick={handleCopy}
                                variant="secondary"
                                className={`hidden md:flex shrink-0 rounded-xl h-10 px-3 sm:px-4 transition-all duration-300 ${copied
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="size-4" />
                                        <span className="hidden sm:inline">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-4" />
                                        <span className="hidden sm:inline">Copy</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Replaced DialogFooter with a custom standard div to prevent Shadcn layout clashes */}
                    <div className="flex flex-col gap-3 w-full mt-auto">
                        <Button
                            onClick={handleCopy}
                            className="w-full h-12 rounded-xl text-sm sm:text-base font-bold bg-primary-theme hover:bg-indigo-700 text-white shadow-md transition-all shrink-0"
                        >
                            Copy Link & Share
                        </Button>
                        <Button
                            onClick={closeModal}
                            variant="ghost"
                            className="w-full h-12 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 shrink-0"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}