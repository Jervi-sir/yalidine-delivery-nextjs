'use client'
import * as React from "react"
import { BadgeCheck, CreditCard, GalleryVerticalEnd, GhostIcon, LayoutDashboard, Sparkles } from "lucide-react"

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
import { useTranslation } from "@/provider/language-provider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const doTranslate = useTranslation(translations);
  const data = [
    {
      title: doTranslate('Dashboard'),
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: doTranslate('Orders'),
      icon: Sparkles,
      isActive: true,
      items: [
        {
          title: doTranslate('Create'),
          url: "/order/create",
        },
        {
          title: doTranslate('List'),
          url: "/order/list",
        },
      ],
    },
    {
      title: doTranslate('Wallet'),
      icon: CreditCard,
      isActive: true,
      items: [
        {
          title: doTranslate('Request Withdraw'),
          url: "/wallet/withdraw",
        },
        {
          title: doTranslate('History'),
          url: "/wallet/history",
        },
      ],
    },
    {
      title: doTranslate('Products'),
      icon: BadgeCheck,
      items: [
        {
          title: doTranslate('Create'),
          url: "/product/create",
        },
        {
          title: doTranslate('List'),
          url: "/product/list",
        },
        {
          title: doTranslate('Suggest'),
          url: "/product/suggest",
        },
      ],
    },
  ];

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GhostIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{process.env.NEXT_PUBLIC_BRAND}</span>
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

const translations = {
  "Dashboard": {
    "English": "Dashboard",
    "French": "Tableau de bord",
    "Arabic": "لوحة التحكم"
  },
  "Orders": {
    "English": "Orders",
    "French": "Commandes",
    "Arabic": "الطلبات"
  },
  "Create": {
    "English": "Create",
    "French": "Créer",
    "Arabic": "إنشاء"
  },
  "List": {
    "English": "List",
    "French": "Liste",
    "Arabic": "قائمة"
  },
  "Wallet": {
    "English": "Wallet",
    "French": "Portefeuille",
    "Arabic": "محفظة"
  },
  "Request Withdraw": {
    "English": "Request Withdraw",
    "French": "Demande de retrait",
    "Arabic": "طلب سحب"
  },
  "History": {
    "English": "History",
    "French": "Historique",
    "Arabic": "سجل"
  },
  "Products": {
    "English": "Products",
    "French": "Produits",
    "Arabic": "المنتجات"
  },
  "Suggest": {
    "English": "Suggest",
    "French": "Suggérer",
    "Arabic": "اقتراح"
  }
}