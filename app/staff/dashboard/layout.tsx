"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/context/AuthContext";
import { Upload, List, Edit, User, Bell, Home } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
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
    const router = useRouter();
    const userName = authData?.fullName || "User";
    const role = authData?.role || "";
  
    useEffect(() => {
      if (!authData?.accessToken) {
        router.push('/');
      }
    }, [authData, router]);
    
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