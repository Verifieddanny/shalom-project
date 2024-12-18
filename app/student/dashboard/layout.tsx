"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Home, Book, User, BarChart, Bell } from "lucide-react";
import { MenuItem } from "@/components/app-sidebar";
import { useAuth } from "@/context/AuthContext";



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
  const { authData } = useAuth();
  const userName = authData?.fullName || "User";
  const role = authData?.role || "";


    return (
    <SidebarProvider>
  <AppSidebar items={items} user={userName} role={role}/>
      <section>
      <SidebarTrigger />
        {children}
      </section>
      </SidebarProvider>
    )
  }