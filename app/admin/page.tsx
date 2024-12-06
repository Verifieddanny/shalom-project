"use client"
import { useState } from "react";

export default function Admin() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "admin123") {
      alert("Welcome Admin");
    } else {
      alert("Invalid login credentials");
    }
  };

  return (
    <main className="bg-[#f8f3e8] min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-[#010100]">Admin Login</h1>
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
        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
          Login
        </button>
      </form>
    </main>
  );
}
