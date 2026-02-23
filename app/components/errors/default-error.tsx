import { isRouteErrorResponse, Link } from "react-router";
import { Button } from "../ui/button";
import {
    AlertTriangle,
    ArrowLeft,
    RefreshCw,
    Home,
    ChevronDown,
    Search,
    User
} from "lucide-react";
import { useState } from "react";

export default function DefaultError({ error }: { error: unknown }) {
    const [showStack, setShowStack] = useState(false);

    let message = "Aww, snap!";
    let details = "We hit a little snag on our end. Don't worry, your tickets are safe.";
    let status: string | number = "Error";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        status = error.status;
        message = error.status === 404 ? "The beat stopped!" : "Something went wrong";
        details = error.status === 404
            ? "The page you’re looking for has moved or doesn't exist anymore."
            : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="min-h-[80vh] w-full flex items-center justify-center pt-10 p-6 bg-slate-50/50">
            <div className="max-w-xl w-full text-center">
                {/* Visual Anchor */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-full bg-red-100 animate-pulse" />
                        <div className="relative bg-white p-4 rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 mb-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest">
                        Status {status}
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {message}
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto font-medium">
                        {details}
                    </p>
                </div>

                {/* Quick Navigation Pills */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Try these instead</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-sm font-semibold text-slate-700 transition-colors">
                            <Home className="h-4 w-4" /> Home
                        </Link>
                        <Link to="/events" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-sm font-semibold text-slate-700 transition-colors">
                            <Search className="h-4 w-4" /> Browse Events
                        </Link>
                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-sm font-semibold text-slate-700 transition-colors">
                            <User className="h-4 w-4" /> Dashboard
                        </Link>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="w-full sm:w-auto rounded-2xl h-14 px-8 text-base font-bold flex items-center gap-2 border-slate-200 hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Go Back
                    </Button>

                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto rounded-2xl h-14 px-8 text-base font-bold bg-primary-theme hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-100"
                    >
                        <RefreshCw className="h-5 w-5" />
                        Try Again
                    </Button>
                </div>

                {/* Developer Details - Only visible if stack exists */}
                {stack && (
                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <button
                            onClick={() => setShowStack(!showStack)}
                            className="flex items-center gap-2 mx-auto text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <ChevronDown className={`h-4 w-4 transition-transform ${showStack ? 'rotate-180' : ''}`} />
                            Technical Details (Developer Only)
                        </button>

                        {showStack && (
                            <div className="mt-4 text-left">
                                <pre className="p-6 bg-slate-900 rounded-2xl overflow-x-auto text-[10px] leading-relaxed text-indigo-300 font-mono shadow-inner">
                                    <code>{stack}</code>
                                </pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}