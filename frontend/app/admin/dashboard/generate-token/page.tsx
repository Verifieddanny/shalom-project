"use client"
import { generateToken } from '@/lib/api';
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext';

export default function GenerateToken() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { authData } = useAuth();


  const handleGenerateToken = async () => {
    try {
      if (authData?.accessToken) {
        const result = await generateToken(authData.accessToken);
        setToken(result?.data?.code || null);
        setError(null);
      } 
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      setToken(null);
    }
  };
    return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Token</h1>
      <div className="p-4 bg-white rounded shadow-md">
      <button
        onClick={handleGenerateToken}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Generate Token
      </button>
      {token && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Token: {token}
        </div>
      )}
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}
    </div>
    </div>
  )
}
