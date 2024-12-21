"use client"
import React, { useEffect, useState } from 'react';
import { getRegisteredCourses } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface CourseRegistration {
  _id: string;
  session: string;
  semester: number;
  courses: string[];
  registeredAt: string;
}

const RegisteredCourses: React.FC = () => {
  const [registeredCourses, setRegisteredCourses] = useState<CourseRegistration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { authData } = useAuth();

  useEffect(() => {

    const fetchRegisteredCourses = async () => {
      try {
        if (authData?.accessToken) {
          const courses = await getRegisteredCourses(authData.accessToken);
          setRegisteredCourses(courses);
        } else {
          console.log('No access token available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.log('Error fetching courses:', err);
      }
    };

    fetchRegisteredCourses();
  }, [authData]);

  // Sort the registered courses by session and semester in descending order
  const sortedCourses = registeredCourses.sort((a, b) => {
    if (a.session > b.session) return -1;
    if (a.session < b.session) return 1;
    if (a.semester > b.semester) return -1;
    if (a.semester < b.semester) return 1;
    return 0;
  });

  return (
    <div className='w-full min-h-screen bg-white flex justify-center items-center p-4'>
      <div className="p-4 bg-white rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Registered Courses</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}
        {sortedCourses.length > 0 ? (
          sortedCourses.map((registration) => (
            <div key={registration._id} className="mb-4 p-4 border rounded">
              <h2 className="text-xl font-semibold mb-2">{registration.session} - {registration.semester === 1 ? "First" : "Second"} Semester</h2>
              <ul className="list-disc list-inside">
                {registration.courses.map((course: string) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-2">Registered at: {new Date(registration.registeredAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No registered courses found.</div>
        )}
      </div>
    </div>
  );
};

export default RegisteredCourses;