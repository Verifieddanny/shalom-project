
"use client"
import React, { useState } from 'react';
import { registerCourses } from '@/lib/api';

const RegisterCourses: React.FC = () => {
  const [session, setSession] = useState('');
  const [semester, setSemester] = useState(1);
  const [courses, setCourses] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      const result = await registerCourses({ session, semester, courses });
      setMessage('Courses registered successfully');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Register Courses</h1>
      <input
        type="text"
        placeholder="Session (YYYY/YYYY)"
        value={session}
        onChange={(e) => setSession(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      />
      <input
        type="number"
        placeholder="Semester"
        value={semester}
        onChange={(e) => setSemester(Number(e.target.value))}
        className="border rounded w-full p-2 mb-4"
      />
      <input
        type="text"
        placeholder="Courses (comma separated)"
        value={courses.join(', ')}
        onChange={(e) => setCourses(e.target.value.split(',').map(course => course.trim()))}
        className="border rounded w-full p-2 mb-4"
      />
      <button onClick={handleRegister} className="bg-blue-500 text-white p-2 rounded">
        Register
      </button>
      {message && <div className="mt-4">{message}</div>}
    </div>
  );
};

export default RegisterCourses;