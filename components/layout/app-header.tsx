import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ThemeToggle } from "../theme-toggle";
import { Fragment } from "react";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { Skeleton } from "../ui/skeleton";

export function AppHeader() {
  const headerTitles = useHeadbarInsetStore((state: any) => state.headerTitles);

  return (
    <header className="flex shrink-0 items-center justify-between px-4">
      <div className="flex h-16 shrink-0 items-center gap-2 ">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {headerTitles.length === 0
              ? <Skeleton className="h-4 w-[150px]" />
              : (headerTitles?.map((title, index) => (
                <Fragment key={index}>
                  {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                  <BreadcrumbItem className="hidden md:block">
                    {index === headerTitles.length - 1 ? (
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href="#">{title}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))
              )
            }
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ThemeToggle />
    </header>
  );
}
