import {
  BadgeCheck,
  Bell,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react"
import { Link, useFetcher } from "react-router"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"
import { Button } from "./ui/button"
import CustomAvatar from "./custom/custom-avatar"

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const fetcher = useFetcher();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gray-100 rounded-lg py-2 px-2 flex items-center gap-2"
            >
              <img src="/images/logos/app_logo.png" alt="AriaPass Logo" className="h-auto w-14 object-contain" />
              <ChevronRight className="ml-auto size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <CustomAvatar name={user.name} styles="h-10 w-10" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {user.organiserProfile?.status !== 'active' && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <Link to={"/organiser-request"}>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                      <Sparkles />
                      Upgrade Membership
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link to={"/account"} >
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <fetcher.Form
              method="POST"
              action="logout"
              title="Logout out your account"
            >
              <Button
                className="w-full text-start flex justify-start" variant={"ghost"}
                type="submit"
                disabled={fetcher.state === "loading" || fetcher.state === "submitting"}
              >
                <LogOut className="text-gray-500" />
                Log out
              </Button>
            </fetcher.Form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
