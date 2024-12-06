"use client"
import { useState } from "react";

export default function Student() {
  const [isSigningIn, setIsSigningIn] = useState(true);

  const toggleMode = () => setIsSigningIn(!isSigningIn);

  return (
    <main className="bg-[#e8f7f8] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-[#010100]">Student {isSigningIn ? "Sign In" : "Sign Up"}</h1>
      <form className="bg-white p-6 rounded shadow-md w-80">
        {!isSigningIn && (
            <>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="border rounded w-full p-2"
            />
          </div>

            <div className="mb-4">
            <label className="block mb-2 text-sm font-bold">Email</label>
            <input
            type="email"
            placeholder="Enter your email"
            className="border rounded w-full p-2"
            />
            </div>
            </>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Registration Number</label>
          <input
            type="text"
            placeholder="Enter your Registration Number"
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="border rounded w-full p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          {isSigningIn ? "Sign In" : "Sign Up"}
        </button>
      </form>
      <button
        onClick={toggleMode}
        className="mt-4 text-blue-500 underline"
      >
        {isSigningIn ? "Create an account" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
