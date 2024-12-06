"use client"
import { useState } from "react";

export default function Staff() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "admin123") {
      alert("Access Granted");
    } else {
      alert("Invalid login credentials");
    }
  };

  return (
    <main className="bg-[#f8e8fa] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-[#010100]">Staff Onboarding</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
         <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className="border rounded w-full p-2"
          />
        </div>
        <button type="submit" className="bg-purple-500 text-white p-2 rounded w-full">
          Submit
        </button>
      </form>
    </main>
  );
}
