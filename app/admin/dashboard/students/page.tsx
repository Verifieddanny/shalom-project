"use client"
import React, { useState, useEffect } from 'react';
import { getStudents } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/dashboard-loader';

interface Student {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

const Students: React.FC = () => {
  const { authData } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        if (authData?.accessToken) {
          const result = await getStudents(authData.accessToken);
          setStudents(result);
        } else {
          setError('Access token is not available');
          setLoading(false);

        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);

      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [authData]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      {loading ? <Loader/> :  (<>
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
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="py-2 px-4 border-b">{student.fullName}</td>
              <td className="py-2 px-4 border-b">{student.email}</td>
              <td className="py-2 px-4 border-b">{student.role}</td>
              <td className="py-2 px-4 border-b">{new Date(student.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </>)}
    </div>
  );
};

export default Students;