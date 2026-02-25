import * as React from "react"
import { Button } from "~/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "~/components/ui/drawer"
import { Book, Calendar1, ChevronDown, ChevronRight, Coins, Home, Users, UserStar, LogIn } from "lucide-react"
import { NavLink } from "react-router"

// 1. Data-driven configuration
const NAV_ITEMS = [
    { label: "Events", to: "/events", icon: Calendar1 },
    { label: "Organisers", to: "/organisers", icon: Users },
    { label: "Artists", to: "/artists", icon: UserStar },
    { label: "Pricing", to: "/pricing", icon: Coins },
    { label: "Digital Programs", to: "/event-programs", icon: Book },
]

export default function MobileNav({ user }: { user: any }) {
    const [open, setOpen] = React.useState(false)

    // Helper to close drawer on click
    const closeDrawer = () => setOpen(false)

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    className="tracking-tighter px-8 rounded-full border-0 bg-indigo-50 text-primary-theme hover:bg-indigo-100 flex items-center gap-2 font-bold transition-all active:scale-95"
                    variant="outline"
                >
                    Menu <ChevronDown strokeWidth={3} className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </Button>
            </DrawerTrigger>
            
            <DrawerContent className="rounded-t-[2.5rem] border-t-0 bg-slate-50 backdrop-blur-xl">
                <div className="mx-auto w-full max-w-md">
                    {/* Screen Reader Accessiblity */}
                    <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
                    
                    <div className="py-8 px-1 pb-16 flex flex-col gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-2">Explore Aria</p>
                        
                        {/* 2. Map through Nav Items */}
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={closeDrawer}
                                className={({ isActive }) => `
                                    flex items-center justify-between p-4 rounded-2xl transition-all
                                    ${isActive 
                                        ? 'bg-white shadow-sm border-slate-100 text-primary-theme' 
                                        : 'text-slate-600 hover:bg-slate-100/50 active:bg-slate-100'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl transition-colors ${open ? 'bg-indigo-50 text-primary-theme' : 'bg-slate-100'}`}>
                                        <item.icon strokeWidth={2.5} className="size-5" />
                                    </div>
                                    <span className="font-semibold tracking-tight text-lg">
                                        {item.label}
                                    </span>
                                </div>
                                <ChevronRight className="size-4 opacity-30" />
                            </NavLink>
                        ))}

                        <div className="h-px bg-slate-200 my-4 mx-4" />

                        {/* 3. Dynamic Auth Section */}
                        {user?.name ? (
                            <NavLink
                                to="/dashboard"
                                onClick={closeDrawer}
                                className="group flex items-center justify-between mx-3 p-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full p-2.5 bg-white/10 group-hover:bg-white/20 transition-colors">
                                        <Home strokeWidth={2.5} className="size-5" />
                                    </div>
                                    <span className="font-medium tracking-tight text-lg">Dashboard</span>
                                </div>
                                <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                    Pro
                                </div>
                            </NavLink>
                        ) : (
                            <NavLink
                                to="/login"
                                onClick={closeDrawer}
                                className="flex items-center justify-between p-4 bg-primary-theme rounded-2xl text-white shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full p-2.5 bg-white/20">
                                        <LogIn strokeWidth={2.5} className="size-5" />
                                    </div>
                                    <span className="font-medium tracking-tight text-lg">Sign In</span>
                                </div>
                                <ChevronRight className="size-5 text-white/50" />
                            </NavLink>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}