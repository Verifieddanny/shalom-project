"use client"
import { useAuth } from '@/context/AuthContext'; // Removed useState

export default function AdminPage() {
  const { authData } = useAuth();
  const userName = authData?.fullName || "Admin";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {userName}</h1>
    </div>
  );
}