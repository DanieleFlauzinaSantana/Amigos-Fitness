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
            <h1 className="text-xl font-semibold text-sidebar-foreground">Academia Inteligente</h1>
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
           {/* Placeholder for user profile/settings if needed later */}
           <div className="flex items-center gap-3 mb-4">
            <Image src="https://placehold.co/40x40.png" alt="Avatar do Usuário" data-ai-hint="user avatar" width={40} height={40} className="rounded-full" />
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Usuário Admin</p>
              <p className="text-xs text-sidebar-foreground/70">admin@example.com</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
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
