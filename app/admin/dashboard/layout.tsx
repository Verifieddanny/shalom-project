"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Home, Paperclip, Bell, Users } from "lucide-react";
import { MenuItem } from "@/components/app-sidebar";
import { useAuth } from "@/context/AuthContext";



const items: MenuItem[] = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Generate Token",
      url: "/dashboard/generate-token",
      icon: Paperclip,
    },
    {
      title: "Lecturers",
      url: "/dashboard/lecturers",
      icon: Users,
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: Users,
    },
    {
      title: "Notifications",
      url: "/dashboard",
      icon: Bell,
    }
  ];
  

export default function DashboardLayout({
    children, 
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