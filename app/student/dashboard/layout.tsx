"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Home, Book, BarChart, Bell, FileText } from "lucide-react";
import { MenuItem } from "@/components/app-sidebar";
import { useAuth } from "@/context/AuthContext";

const items: MenuItem[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "Profile",
  //   url: "/dashboard/profile",
  //   icon: User,
  // },
  {
    title: "Courses Registration",
    url: "/dashboard/register-course",
    icon: Book,
  },
  {
    title: "Registered Courses",
    url: "/dashboard/registered-course",
    icon: BarChart,
  },
  {
    title: "Transcript",
    url: "/dashboard/transcript",
    icon: FileText,
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
    <div className="flex w-full h-full min-h-screen">
      <SidebarProvider>
        <div className="flex flex-col md:flex-row w-full h-full bg-white">
          <div className="w-full md:w-64">
            <AppSidebar items={items} user={userName} role={role}/>
          </div>
          <section className="flex-1 p-4">
            <SidebarTrigger />
            {children}
          </section>
        </div>
      </SidebarProvider>
    </div>
  );
}