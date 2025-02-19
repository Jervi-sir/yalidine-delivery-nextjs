'use client'
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/provider/theme-provider';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from "@/components/ui/toaster"

export const SiteLayout = ({ children }) => {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {isAuthRoute ? (
          // Render AuthLayout or specific provider for /auth routes
          <>{children}</> // Replace with your AuthLayout
        ) : (
          <SidebarProvider style={{"--sidebar-width": "16rem",} as React.CSSProperties}>
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        )}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
};