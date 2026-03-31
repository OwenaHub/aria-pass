import React from "react"
import { BookOpen, CalendarCheck, Plus, UserPlus } from "lucide-react"

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

        <section className="px-4 pb-1.5">
          <Link to={'/events'} className="py-2 mb-2 flex items-center gap-2">
            <CalendarCheck size={18} strokeWidth={2} />
            <span className="text-sm font-semibold tracking-tight">See Events</span>
          </Link>
          <Link to={'/event-programs'} className="py-2 mb-2 flex items-center gap-2">
            <BookOpen size={18} strokeWidth={2} />
            <span className="text-sm font-semibold tracking-tight">Digital Programs</span>
          </Link>
        </section>
        <SidebarSeparator className="mx-0" />
      </SidebarContent>

      <SidebarFooter className="shadow-[0px_0px_25px_#80808020]!">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to={"/my-events/new"}>
              <SidebarMenuButton variant={'outline'} className="bg-gray-200 hover:bg-gray-100 flex items-center justify-between px-4 py-5 rounded-lg cursor-pointer transition">
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
