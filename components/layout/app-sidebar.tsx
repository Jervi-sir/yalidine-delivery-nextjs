'use client'
import * as React from "react"
import { BadgeCheck, CreditCard, GalleryVerticalEnd, LayoutDashboard, Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";

// This is sample data.
const data = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Orders",
    icon: Sparkles,
    isActive: true,
    items: [
      {
        title: "Create",
        url: "/order/create",
      },
      {
        title: "List",
        url: "/order/list",
      },
    ],
  },
  {
    title: "Wallet",
    icon: CreditCard,
    isActive: true,
    items: [
      {
        title: "Request Withdraw",
        url: "/wallet/withdraw",
      },
      {
        title: "History",
        url: "/wallet/history",
      },
    ],
  },
  {
    title: "Products",
    icon: BadgeCheck,
    items: [
      {
        title: "Create",
        url: "/product/create",
      },
      {
        title: "List",
        url: "/product/list",
      },
      {
        title: "Suggest",
        url: "/product/suggest",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Livrili</span>
                  <span className="">v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className={state === 'collapsed' && "pl-0"}>
          <SidebarMenu className="gap-2">
            <NavMain items={data} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
