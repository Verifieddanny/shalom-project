"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { setToken } from "@/lib/auth"
import { register } from "@/lib/api";

const VerifyTokenPage = () => {
  const router = useRouter();
  const { authData } = useAuth();
  const [lecturerToken, setLecturerToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const response = await register({...authData, lecturerCode: lecturerToken, role: "lecturer"});
      if (response?.success) {
        setToken(response?.data?.accessToken
        );
        router.push("/staff/dashboard");
      } else {
        setError("Invalid token. Please try again.");
      }
    } catch (err) {
      setError(`Error verifying token. Please try again. ${err}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Verify Lecturer Token</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Token"
          value={lecturerToken}
          onChange={(e) => setLecturerToken(e.target.value)}
          className="input"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn-primary">
          Verify Token
        </button>
      </form>
    </div>
  );
};

export default VerifyTokenPage;
