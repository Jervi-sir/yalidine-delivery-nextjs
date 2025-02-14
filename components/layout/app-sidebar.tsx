'use client'
import * as React from "react"
import { BadgeCheck, CreditCard, GalleryVerticalEnd, Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";

// This is sample data.
const data = [
  {
    title: "Orders",
    url: "#",
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
    title: "Products",
    url: "#",
    icon: BadgeCheck,
    items: [
      {
        title: "Create",
        url: "/product/create",
      },
      {
        title: "List",
        url: "/product/list",
        isActive: true,
      },
      {
        title: "Suggest",
        url: "/product/suggest",
      },
    ],
  },
  {
    title: "Wallet",
    url: "#",
    icon: CreditCard,
    items: [
      {
        title: "Request Withdraw",
        url: "/wallet/withdraw",
      },
      {
        title: "History",
        url: "#",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Delivery</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <NavMain items={data} />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <div className="p-2">
        <NavUser />
      </div>
    </Sidebar>
  )
}
