"use client"
import React, { useState, useEffect } from 'react';
import { getScores, deleteScores } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const GetScores: React.FC = () => {
  const { authData } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
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
        setMessage('Score deleted successfully');
        setScores(scores.filter(score => score.id !== id));
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
        {scores.map((score, index) => (
          <li key={index} className="border-b p-2 flex justify-between items-center">
            <span>{score.courseCode} - {score.studentId}: {score.score}</span>
            <button
              onClick={() => handleDelete(score.id)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetScores;