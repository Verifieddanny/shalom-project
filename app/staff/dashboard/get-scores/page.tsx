"use client"
import React, { useState, useEffect } from 'react';
import { getScores, deleteScores } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface StudentScore {
  registrationNumber: string;
  score: number;
  _id: string;
}

interface Score {
  _id: string;
  courseCode: string;
  session: string;
  semester: number;
  scores: StudentScore[];
}

const GetScores: React.FC = () => {
  const { authData } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (authData?.accessToken) {
          const result = await getScores(authData.accessToken);
          setScores(result.data);
        } else {
          setError('Access token is not available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchScores();
  }, [authData]);

  const handleDelete = async (id: string) => {
    try {
      if (authData?.accessToken) {
        await deleteScores(authData.accessToken, id);
        setMessage('Scoresheet deleted successfully');
        setScores(scores.filter(score => score._id !== id));
      } else {
        setError('Access token is not available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scores</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}
      <ul>
        {scores.map((score) => (
          <li key={score._id} className="border-b p-2">
            <div className="flex justify-between items-center">
              <span>{score.courseCode} - {score.session} - {score.semester === 1 ? "First" : "Second"} Semester </span>
              <button
                onClick={() => handleDelete(score._id)}
                className="bg-red-500 text-white p-2 rounded ml-4"
              >
                Delete Scoresheet
              </button>
            </div>
            <h3 className="mt-2 font-semibold">Students Scores</h3>
            <ul className="mt-2">
              {score.scores.map((studentScore) => (
                <li key={studentScore._id} className="flex justify-between items-center">
                  <span className="w-1/2">{studentScore.registrationNumber}</span>
                  <span className="w-1/4">{studentScore.score}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetScores;