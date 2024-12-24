"use client"
import React, { useState } from 'react';
import { updateStudentScore } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/dashboard-loader';

const UpdateStudentScore: React.FC = () => {
  const { authData } = useAuth();
  const [courseCode, setCourseCode] = useState<string>('');
  const [session, setSession] = useState<string>('');
  const [semester, setSemester] = useState<number>(1);
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authData?.accessToken) {
        const scoreData = { courseCode, session, semester, registrationNumber, newScore: score };
        await updateStudentScore(authData.accessToken, scoreData);
        setMessage('Student score updated successfully');
        // Reset state variables to default values
        setCourseCode('');
        setSession('');
        setSemester(1);
        setRegistrationNumber('');
        setScore(0);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Student Score</h1>
      {loading ? <Loader/> : (<>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="courseCode" className="text-sm font-medium text-gray-700">
          Course code
        </label>
        <input
          id='courseCode'
          type="text"
          name="courseCode"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode((e.target.value).toUpperCase())}
          className="border rounded w-full p-2"
          required
        />
        <label htmlFor="session" className="text-sm font-medium text-gray-700">
          Session
        </label>
        <select
          id="session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
          className="border rounded w-full p-2"
          required
        >
          <option value="">YYYY/YYYY</option>
          <option value="2024/2025">2024/2025</option>
          <option value="2023/2024">2023/2024</option>
          <option value="2022/2023">2022/2023</option>
          <option value="2021/2022">2021/2022</option>
          <option value="2020/2021">2020/2021</option>
        </select>
        <label htmlFor="semester" className="text-sm font-medium text-gray-700">
          Semester
        </label>
        <select
          id="semester"
          value={semester}
          onChange={(e) => setSemester(Number(e.target.value))}
          className="border rounded w-full p-2"
          required
          >
          <option value={1}>First</option>
          <option value={2}>Second</option>
        </select>
        <label htmlFor="regNo" className="text-sm font-medium text-gray-700">
          Registration number
        </label>
        <input
          id="regNo"
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
        <label htmlFor="score" className="text-sm font-medium text-gray-700">
          Score
        </label>
        <input
          id="score"
          type="number"
          name="score"
          min={0}
          max={100}
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
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      </>)}
    </div>
  );
};

export default UpdateStudentScore;