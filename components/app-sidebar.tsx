import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChevronUp, Loader2, User2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { clearToken, clearTokenAndRedirect } from "@/lib/auth"
import { useState } from "react"

// Menu items.
export interface MenuItem {
  title: string
  url: string
  icon: React.FC
}

interface AppSidebarProps {
  items: MenuItem[];
  user: string; 
  role: string;
}

export function AppSidebar({ items, user, role }: AppSidebarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    setIsLoading(true);
    clearTokenAndRedirect(() => setIsLoading(true));
  };
  return (
    <Sidebar variant="floating" collapsible="icon" >
      <SidebarContent className="text-[#0099ff] ">
        <SidebarGroup >
          <SidebarGroupLabel className="font-bold text-[#72b4ee]">Shalom Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={`/${role}${item.url}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> <span className="truncate">
                      {user ? user : "User"}
                      </span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <Link className="w-full h-full" href={`/${role}/dashboard/profile`}>
                    <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <span>Sign out</span>
                    {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
