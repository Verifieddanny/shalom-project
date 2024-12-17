"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const VerifyTokenPage = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = {success:true}; //this should be an await call for lecturer sign up
      if (response.success) {
        router.push("/staff/dashboard");
      } else {
        setError("Invalid token. Please try again.");
      }
    } catch (err) {
      setError("Error verifying token. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Verify Lecturer Token</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
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
