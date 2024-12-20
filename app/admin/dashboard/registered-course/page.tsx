"use client"
import React, { useState, useEffect } from 'react';
import { getRegisteredCourses, deleteCourseRegistration } from '@/lib/api';

const RegisteredCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getRegisteredCourses();
        setCourses(result.courses);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCourseRegistration(id);
      setCourses(courses.filter(course => course.id !== id));
      setMessage('Course registration deleted successfully');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Registered Courses</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map(course => (
            <li key={course.id} className="mb-2">
              {course.name} ({course.code})
              <button onClick={() => handleDelete(course.id)} className="ml-2 text-red-500">
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No registered courses found</div>
      )}
      {message && <div className="mt-4">{message}</div>}
    </div>
  );
};

export default RegisteredCourses;