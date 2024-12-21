"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { setToken } from "@/lib/auth";
import { register } from "@/lib/api";

const VerifyTokenPage = () => {
  const router = useRouter();
  const { authData, setAuthData } = useAuth();
  const [lecturerToken, setLecturerToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register({ ...authData, lecturerCode: lecturerToken, role: "lecturer" });
      if (response?.success) {
        setToken(response?.data?.accessToken);
        setAuthData({...response?.data?.user, accessToken: response?.data?.accessToken });
        router.push("/staff/dashboard");
      } else {
        setError("Invalid token. Please try again.");
      }
    } catch (err) {
      setError(`Error verifying token. Please try again. ${err}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Verify Lecturer Token</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lecturerToken" className="block text-sm font-medium text-gray-700">
            Lecturer Token
          </label>
          <input
            type="text"
            id="lecturerToken"
            name="lecturerToken"
            value={lecturerToken}
            onChange={(e) => setLecturerToken(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Verify Token
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyTokenPage;