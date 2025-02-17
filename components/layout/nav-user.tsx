"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "../ui/skeleton"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: session } = useSession()
  const { toast } = useToast();

  const fetchLogout = async () => {
    try {
      signOut();
      toast({
        title: "Success",
        description: "Logged Out Successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error happened.",
        variant: "destructive",
      });
    }
  }

  if (!session)
    return (
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <Skeleton className="h-8 w-8 rounded-full" />
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight gap-1">
          <Skeleton className="h-2.5 w-[100px]" />
          <Skeleton className="h-2 w-[69px]" />
        </div>
        <Skeleton className="h-4 w-4" />
      </SidebarMenuButton>
    )
  else
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={'user.avatar'} alt={session.user.email} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session.user.name}</span>
                  <span className="truncate text-xs">{session.user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "top"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuItem className="cursor-pointer" onClick={fetchLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
}
