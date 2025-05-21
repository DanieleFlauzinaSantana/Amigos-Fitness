// src/app/(app)/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { Dumbbell, LogOut, Settings, UserCircle, Loader2 } from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext"; 
import { useEffect } from "react"; 

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, loading: authLoading } = useAuth(); 

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login'); 
    }
  }, [currentUser, authLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      // O AuthContext já redireciona para /login após o logout bem-sucedido
      // ou o useEffect acima cuidará disso quando currentUser se tornar null.
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, tentar redirecionar, embora o AuthContext possa já ter feito.
      router.push('/login');
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Redirecionando para login...</p>
      </div>
    );
  }

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
        <SidebarFooter className="p-4 border-t border-sidebar-border space-y-3">
          {currentUser && (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.photoURL || "https://placehold.co/40x40.png"} alt={currentUser.displayName || currentUser.email || "Admin"} data-ai-hint="admin avatar"/>
                  <AvatarFallback>
                    {currentUser.email ? currentUser.email[0].toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{currentUser.displayName || "Admin"}</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate max-w-[150px]">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={() => router.push('/settings')}>
                        <Settings className="mr-2 h-4 w-4" /> Configurações
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="bg-sidebar-accent text-sidebar-accent-foreground">
                      <p>Acessar configurações do sistema</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="bg-sidebar-accent text-sidebar-accent-foreground">
                      <p>Encerrar sessão e voltar para tela de login</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          )}
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
