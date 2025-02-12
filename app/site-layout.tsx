'use client'
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/provider/theme-provider';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AuthLayout } from './auth/auth-layout';

export const SiteLayout = ({ children }) => {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  return (
    <>
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
            {children}
          </SidebarProvider>
        )}
      </ThemeProvider>
    </>
  );
};