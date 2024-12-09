import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// Menu items.
export interface MenuItem {
  title: string
  url: string
  icon: React.FC
}

interface AppSidebarProps {
  items: MenuItem[] 
}

export function AppSidebar({ items }: AppSidebarProps) {
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
                    <Link href={item.url}>
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
    </Sidebar>
  )
}
