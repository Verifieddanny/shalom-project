"use client"
import React, { useState } from 'react';
import { updateScores } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/dashboard-loader';

const UpdateScores: React.FC = () => {
  const { authData } = useAuth();
  const [courseCode, setCourseCode] = useState<string>('');
  const [session, setSession] = useState<string>('');
  const [semester, setSemester] = useState<number>(1);
  const [scores, setScores] = useState<{ registrationNumber: string; score: number }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScoreChange = (index: number, field: string, value: string | number) => {
    const newScores = [...scores];
    newScores[index] = { ...newScores[index], [field]: value };
    setScores(newScores);
  };

  const addScoreField = () => {
    setScores([...scores, { registrationNumber: '', score: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authData?.accessToken) {
        const scoresData = { courseCode, session, semester, scores };
        await updateScores(authData.accessToken, scoresData);
        setMessage('Scores updated successfully');
        // Reset state variables to default values
        setCourseCode('');
        setSession('');
        setSemester(1);
        setScores([]);
      } else {
        setError('Access token is not available');
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
      <h1 className="text-2xl font-bold mb-4">Update Scores</h1>
      {loading ? <Loader /> : (<>
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
        {scores.map((score, index) => (
          <div key={index} className="space-y-2">
            <label htmlFor="regNo" className="text-sm font-medium text-gray-700">
              Registration number
            </label>
            <input
              id="regNo"
              type="text"
              name={`registrationNumber-${index}`}
              placeholder="Registration Number"
              value={score.registrationNumber}
              onChange={(e) => handleScoreChange(index, 'registrationNumber', e.target.value)}
              className="border rounded w-full p-2"
              required
              />
            <label htmlFor="score" className="text-sm font-medium text-gray-700">
              Score
            </label>
            <input
              id="score"
              type="number"
              min={0}
              max={100}
              name={`score-${index}`}
              placeholder="Score"
              value={score.score}
              onChange={(e) => handleScoreChange(index, 'score', Number(e.target.value))}
              className="border rounded w-full p-2"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addScoreField} className="bg-gray-500 text-white p-2 rounded w-full">
          Add Student Score
        </button>
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

export default UpdateScores;