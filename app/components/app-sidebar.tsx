import React from "react"
import { Plus, UserPlus } from "lucide-react"

import { DatePicker } from "~/components/date-picker"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "~/components/ui/sidebar"
import { Link } from "react-router"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16">
        <NavUser user={user} />
      </SidebarHeader>

      <section className="border mx-2 mt-2 mb-2 bg-white rounded-xl">
        <div className="px-4 py-3">
          <div className="text-sm font-bold tracking-tight">
            {user.name}
          </div>
          <div className="text-xs font-light text-gray-600">
            {user.email}
          </div>
        </div>

        {user.organiserProfile?.status === 'active' && (
          <>
            <hr />
            <Link to={"/my-events"} className="px-4 py-4 block hover:bg-primary hover:text-white rounded-b-2xl transition cursor-pointer">
              <div className="text-xs font-medium flex items-center gap-2">
                <UserPlus size={16} />
                <span>Invite teammates</span>
              </div>
            </Link>
          </>
        )}
      </section>

      <SidebarContent>
        <DatePicker />

        <section className="px-2 pb-1.5">
          <Link to={'/events'} className="flex justify-between items-center gap-2 px-3 py-3 border shadow rounded-xl bg-white hover:shadow-lg transition">
            <span className="text-sm font-medium tracking-tight">Explore events</span>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-indigo-500"></span>
            </span>

          </Link>
        </section>
        <SidebarSeparator className="mx-0" />
      </SidebarContent>

      <SidebarFooter className="bg-white shadow-[0px_0px_25px_#80808020]!">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to={"/my-events/new"}>
              <SidebarMenuButton className="flex items-center justify-between bg-primary-theme hover:bg-primary-theme/80 hover:text-white text-white px-4 py-5 rounded-xl cursor-pointer">
                <span className="font-semibold tracking-tight text-sm">Add Event</span>
                <Plus strokeWidth={4} className="size-5" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar >
  )
}
