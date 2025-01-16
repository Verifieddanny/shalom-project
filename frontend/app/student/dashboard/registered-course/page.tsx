"use client"
import React, { useEffect, useState } from 'react';
import { getRegisteredCourses, deleteCourseRegistration } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Trash } from 'lucide-react';
import Loader from '@/components/dashboard-loader';

interface CourseRegistration {
  _id: string;
  session: string;
  semester: number;
  courses: string[];
  registeredAt: string;
}

const RegisteredCourses: React.FC = () => {
  const [registeredCourses, setRegisteredCourses] = useState<CourseRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { authData } = useAuth();

  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      setLoading(true);
      try {
        if (authData?.accessToken) {
          const courses = await getRegisteredCourses(authData.accessToken);
          setRegisteredCourses(courses);
        } else {
          console.log('No access token available');
          setLoading(false);

        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
        console.log('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredCourses();
  }, [authData]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      if (authData?.accessToken) {
        await deleteCourseRegistration(id, authData.accessToken);
        setRegisteredCourses(prevCourses => prevCourses.filter(course => course._id !== id));
      } else {
        setError('Access token is not available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.log('Error deleting course registration:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sort the registered courses by session and semester in descending order
  const sortedCourses = registeredCourses.sort((a, b) => {
    if (a.session > b.session) return -1;
    if (a.session < b.session) return 1;
    if (a.semester > b.semester) return -1;
    if (a.semester < b.semester) return 1;
    return 0;
  });

  return (
    <div className='w-full min-h-screen bg-gray-100 flex justify-center items-center p-4'>
      <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Registered Courses</h1>
        {loading ? <Loader/> : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            {error}
            </div>
        )}
        {sortedCourses.length > 0 ? (
          sortedCourses.map((registration) => (
            <div key={registration._id} className="mb-6 p-6 border rounded-lg bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">{registration.session} - {registration.semester === 1 ? "First" : "Second"} Semester</h2>
                <Trash
                  className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200"
                  onClick={() => handleDelete(registration._id)}
                />
              </div>
              <ul className="list-disc list-inside mb-4">
                {registration.courses.map((course: string) => (
                  <li key={course} className="text-gray-600">{course}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500">Registered at: {new Date(registration.registeredAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No registered courses found.</div>
        )}
      </>
      )}
      </div>
    </div>
  );
};

export default RegisteredCourses;