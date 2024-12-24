"use client"
import React, { useState, useEffect } from 'react';
import { getLecturers } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/dashboard-loader';

interface Lecturer {
  _id: string;
  fullName: string;
  email: string;
  lecturerCode: string;
  role: string;
  createdAt: string;
}

const Lecturers: React.FC = () => {
  const { authData } = useAuth();
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturers = async () => {
      setLoading(true);
      try {
        if (authData?.accessToken) {
          const result = await getLecturers(authData.accessToken);
          setLecturers(result);
        } else {
          setError('Access token is not available');
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, [authData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lecturers</h1>
      {loading ? <Loader/> : (<>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Lecturer Code</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map((lecturer) => (
            <tr key={lecturer._id}>
              <td className="py-2 px-4 border-b">{lecturer.fullName}</td>
              <td className="py-2 px-4 border-b">{lecturer.email}</td>
              <td className="py-2 px-4 border-b">{lecturer.lecturerCode}</td>
              <td className="py-2 px-4 border-b">{lecturer.role}</td>
              <td className="py-2 px-4 border-b">{new Date(lecturer.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </>) }
    </div>
  );
};

export default Lecturers;