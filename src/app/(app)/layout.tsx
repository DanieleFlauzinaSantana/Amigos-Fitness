
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { Dumbbell, LogOut, Settings } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-sidebar-foreground" />
            <h1 className="text-xl font-semibold text-sidebar-foreground">Amigos Fitness</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {NAV_LINKS.map((link) => (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={link.exact ? pathname === link.href : pathname.startsWith(link.href)}
                  className="justify-start"
                  tooltip={{ children: link.label, className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
           {/* Conteúdo do rodapé removido conforme solicitado */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6 lg:px-8">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div className="flex-1 text-center md:text-left">
                {/* Breadcrumbs or dynamic title can go here */}
            </div>
            {/* Additional header actions can go here */}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
