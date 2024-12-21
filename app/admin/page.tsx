"use client"
import AuthForm from "@/components/auth-form";

export default function Admin() {


  return (
    <main className=" min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-[#010100]">Admin Login</h1>
      
      <AuthForm role="admin" type="login" />
    </main>
  );
}
