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
    url: "/dashboard/register-courses",
    icon: Book,
  },
  {
    title: "Registered Courses",
    url: "/dashboard/registered-courses",
    icon: BarChart,
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