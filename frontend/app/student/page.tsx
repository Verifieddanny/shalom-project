"use client";

import { useState } from "react";
// import { loginUser, signUp } from "../api/apis";
import AuthForm from "@/components/auth-form";

export default function Student() {
  const [isSigningIn, setIsSigningIn] = useState(true);


  const toggleMode = () => setIsSigningIn(!isSigningIn);

  
  return (
    <main className=" min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-[#010100]">
        Student {isSigningIn ? "Sign In" : "Sign Up"}
      </h1>
      {!isSigningIn ? ( <AuthForm role="student" type="register" />) : ( <AuthForm role="student" type="login" />)

      }
      <button onClick={toggleMode} className="mt-4 text-blue-500 underline">
        {isSigningIn ? "Create an account" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
