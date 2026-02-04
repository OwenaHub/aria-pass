import { isRouteErrorResponse, Link } from "react-router";
import { Button } from "../ui/button";

export default function DefaultError({ error }: { error: unknown }) {
    let message = "Aww, snap!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details = error.status === 404
            ? "The requested page could not be found."
            : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="w-full max-w-5xl  py-20 container">
            <div>
                <h1 className="text-primary text-xl font-semibold mb-4">{message}</h1>
                <p className="text-primary text-sm font-light">{details}</p>
                {stack && (
                    <pre className="p-4 text-gray-400 max-w-4/5 overflow-x-auto text-xs">
                        <code>{stack}</code>
                    </pre>
                )}

                <div className="py-6">
                    <h2 className="text-sm">Try other links?</h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <Link
                            to={'/'}
                            className="underline underline-offset-2 text-blue-600 text-sm"
                        >
                            Home
                        </Link>
                        <Link
                            to={'/login'}
                            className="underline underline-offset-2 text-blue-600 text-sm"
                        >
                            Sign in
                        </Link>
                        <Link
                            to={'/dashboard'}
                            className="underline underline-offset-2 text-blue-600 text-sm"
                        >
                            Your dashbaord
                        </Link>
                    </div>
                </div>

                <hr className="my-6" />

                <div className="flex items-stretch md:items-center gap-3 mt-8">
                    <Button
                        onClick={() => window.history.back()}
                        variant={"outline"}
                        size={"sm"}
                        className="rounded-full shadow-none text-sm py-4.5 px-8 flex items-center gap-1"
                    >
                        <span>Back</span>
                    </Button>

                    <Button
                        onClick={() => window.location.reload()}
                        size={"sm"}
                        className="rounded-full text-sm text-white py-4.5 px-8 flex items-center gap-1"
                    >
                        <span>Reload</span>
                    </Button>
                </div>
            </div>
        </main>
    );
}