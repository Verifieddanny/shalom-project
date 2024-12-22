"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MenuItem } from "@/components/app-sidebar";
import { useAuth } from "@/context/AuthContext";
import { Upload, List, Edit, Trash, User, Bell } from 'lucide-react';

const items = [
  {
    title: "Upload Scores",
    url: "/dashboard/upload-scores",
    icon: Upload,
  },
  {
    title: "Get Scores",
    url: "/dashboard/get-scores",
    icon: List,
  },
  {
    title: "Update Scores",
    url: "/dashboard/update-scores",
    icon: Edit,
  },
  {
    title: "Update Student Score",
    url: "/dashboard/update-student-score",
    icon: User,
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