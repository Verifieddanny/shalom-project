"use client"
import React, { useState, useEffect } from 'react';
import { getScores, deleteScores } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/dashboard-loader';

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
  unit: number;
  scores: StudentScore[];
}

const GetScores: React.FC = () => {
  const { authData } = useAuth();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        if (authData?.accessToken) {
          const result = await getScores(authData.accessToken);
          setScores(result.data);
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

    fetchScores();
  }, [authData]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      if (authData?.accessToken) {
        await deleteScores(authData.accessToken, id);
        setMessage('Scoresheet deleted successfully');
        setScores(scores.filter(score => score._id !== id));
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
      <h1 className="text-2xl font-bold mb-4">ScoreSheet</h1>
      {loading ? <Loader /> : (<>
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
          <li key={score._id} className="border-b p-4 mb-4 bg-gray-50 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-lg">{score.courseCode} - {score.session} - {score.semester === 1 ? "First" : "Second"} Semester</p>
                <p className="text-sm text-gray-600">Unit Load: {score.unit}</p>
              </div>
              <button
                onClick={() => handleDelete(score._id)}
                className="bg-red-500 ml-4 text-white p-2 rounded"
                >
                Delete Scoresheet
              </button>
            </div>
            <h3 className="mt-2 font-semibold">Students Scores</h3>
            <table className="min-w-full bg-white mt-2">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Registration Number</th>
                  <th className="py-2 px-4 border-b">Score</th>
                </tr>
              </thead>
              <tbody>
                {score.scores.map((studentScore) => (
                  <tr key={studentScore._id}>
                    <td className="py-2 px-4 border-b">{studentScore.registrationNumber}</td>
                    <td className="py-2 px-4 border-b">{studentScore.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
        ))}
      </ul>
    </>)}
    </div>
  );
};

export default GetScores;