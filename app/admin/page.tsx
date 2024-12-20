"use client"
import AuthForm from "@/components/auth-form";
import { useState } from "react";

export default function Admin() {


  return (
    <main className="bg-[#f8f3e8] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-[#010100]">Admin Login</h1>
      
      <AuthForm role="admin" type="login" />
    </main>
  );
}
