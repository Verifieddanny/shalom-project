import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Home, Book, User, BarChart, Bell } from "lucide-react";
import { MenuItem } from "@/components/app-sidebar";


const items: MenuItem[] = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Courses Registration",
      url: "/dashboard",
      icon: Book,
    },
    {
      title: "Grades",
      url: "/dashboard",
      icon: BarChart,
    },
    {
      title: "Notifications",
      url: "/dashboard",
      icon: Bell,
    }
  ]
  

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <section>
      <SidebarTrigger />
        {children}
      </section>
      </SidebarProvider>
    )
  }