import Link from "next/link";
import { Input } from "./ui/input";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "./ui/sidebar";
import { BrainCogIcon, LayoutDashboardIcon, ListCollapse } from "lucide-react";

export function AppSidebar() {
    return <Sidebar collapsible="icon" variant="inset" >
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton className="font-bold text-xl">
                        <BrainCogIcon />
                        ESTUDOS
                    </SidebarMenuButton>
                    {/* <SidebarMenuAction>
                        <SidebarTrigger />
                    </SidebarMenuAction> */}
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>

            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={`/`}>
                        <LayoutDashboardIcon />
                        Dahsboard
                        </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton asChild>
                        <Link href={`/disciplinas`}>
                        <ListCollapse />
                        Disciplinas
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
    </Sidebar>
}