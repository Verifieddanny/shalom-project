"use client"
import React, { useState } from 'react';
import { updateStudentScore } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const UpdateStudentScore: React.FC = () => {
  const { authData } = useAuth();
  const [courseCode, setCourseCode] = useState<string>('');
  const [session, setSession] = useState<string>('');
  const [semester, setSemester] = useState<number>(1);
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authData?.accessToken) {
        const scoreData = { courseCode, session, semester, registrationNumber, score };
        await updateStudentScore(authData.accessToken, scoreData);
        setMessage('Student score updated successfully');
      } else {
        setMessage('Access token is not available');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Student Score</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="courseCode"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="text"
          name="session"
          placeholder="Session (YYYY/YYYY)"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="number"
          name="semester"
          placeholder="Semester (1 or 2)"
          value={semester}
          onChange={(e) => setSemester(Number(e.target.value))}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <input
          type="number"
          name="score"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="border rounded w-full p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Update
        </button>
      </form>
      {message && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default UpdateStudentScore;