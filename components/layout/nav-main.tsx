"use client";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import * as React from "react";

export function NavMain({ items }) {
  const pathname = usePathname();
  const [openStates, setOpenStates] = React.useState({});

  React.useEffect(() => {
    const initialOpenStates = {};
    items.forEach((item) => {
      initialOpenStates[item.title] = item.items?.some(
        (subItem) => pathname === subItem.url
      );
    });
    setOpenStates(initialOpenStates);
  }, [pathname, items]);

  const toggleCollapse = (title) => {
    setOpenStates((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            // open={openStates[item.title] || false}
            // onOpenChange={(open) => {
            //   setOpenStates((prev) => ({ ...prev, [item.title]: open }));
            // }}
            defaultOpen={true}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => toggleCollapse(item.title)}
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.url}
                          >
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
