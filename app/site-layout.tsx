'use client'
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/provider/theme-provider';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AuthLayout } from './auth/auth-layout';
import { AppHeader } from '@/components/layout/app-header';
import { SessionProvider } from 'next-auth/react';

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
          <SidebarProvider
            style={
              {
                "--sidebar-width": "19rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
        )}
      </ThemeProvider>
    </SessionProvider>
  );
};