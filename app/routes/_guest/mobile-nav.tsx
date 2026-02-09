import * as React from "react"
import { Button } from "~/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "~/components/ui/drawer"
import { Calendar1, ChevronDown, ChevronRight, Home, Users, UserStar } from "lucide-react"
import { Link } from "react-router"

export default function MobileNav({ user }: { user: User }) {
    // 1. Create state to control the drawer
    const [open, setOpen] = React.useState(false)

    return (
        // 2. Pass the open state and the setter to the Drawer component
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    className="tracking-tighter px-10 rounded-full border-0 bg-indigo-50 text-primary-theme flex items-center"
                    variant="outline"
                >
                    <span>Menu</span> <ChevronDown strokeWidth={3} />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <div className="py-6 px-2 pb-20 flex flex-col gap-3">
                        {/* 3. Add onClick={() => setOpen(false)} to every Link */}
                        <Link
                            to={'/events'}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <div className="rounded-full p-4 bg-gray-100">
                                <Calendar1 strokeWidth={2} className="size-6" />
                            </div>
                            <span className="tracking-tighter text-lg">
                                Events
                            </span>
                        </Link>

                        <Link
                            to={'/organisers'}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <div className="rounded-full p-4 bg-gray-100">
                                <Users strokeWidth={2} className="size-6" />
                            </div>
                            <span className="tracking-tighter text-lg">
                                Organisers
                            </span>
                        </Link>

                        <Link
                            to={'/artists'}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <div className="rounded-full p-4 bg-gray-100">
                                <UserStar strokeWidth={2} className="size-6" />
                            </div>
                            <span className="tracking-tighter text-lg">
                                Artists
                            </span>
                        </Link>

                        <hr className="my-4" />

                        {(user && user.name) ? (
                            <Link
                                to={'/dashboard'}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 border bg-gray-100 rounded-full"
                            >
                                <div className="rounded-full p-4 bg-gray-700 text-white">
                                    <Home strokeWidth={2} className="size-6" />
                                </div>
                                <span className="tracking-tighter text-lg">
                                    Dashboard
                                </span>
                            </Link>
                        ) : (
                            <Link
                                to={'/login'}
                                onClick={() => setOpen(false)}
                                className="flex rounded-full border items-center gap-3 bg-gray-100"
                            >
                                <div className="rounded-full p-4 bg-gray-700 text-white">
                                    <ChevronRight strokeWidth={2} className="size-6" />
                                </div>
                                <span className="tracking-tighter text-lg">
                                    Login
                                </span>
                            </Link>
                        )}
                    </div>

                </div>
            </DrawerContent>
        </Drawer>
    )
}