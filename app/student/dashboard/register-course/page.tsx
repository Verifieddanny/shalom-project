"use client"
import React, { useState } from 'react';
import { registerCourses } from '@/lib/api';
import { Trash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const RegisterCourses: React.FC = () => {
  const [session, setSession] = useState('2024/2025');
  const [semester, setSemester] = useState(1);
  const [courseCode, setCourseCode] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { authData } = useAuth();
  const router = useRouter();
  
  const handleAddCourse = () => {
    if (courseCode && !courses.includes(courseCode)) {
      setCourses([...courses, courseCode]);
      setCourseCode('');
    }
  };

  const handleRemoveCourse = (course: string) => {
    setCourses(courses.filter(c => c !== course));
  };

  const handleRegister = async () => {
    try {
        if (authData?.accessToken) {
        await registerCourses({ session, semester, courses }, authData.accessToken);
        setMessage('Courses registered successfully');
        setCourses([]);
        setSession('2024/2025');
        setSemester(1);
      router.push('/dashboard/registered-course');
      } else {
        setMessage('Access token is not available');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className='w-full min-h-screen bg-white flex justify-center items-center p-4'>
      <div className="p-4 bg-white rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Register Courses</h1>
        <div className="mb-4">
          <label htmlFor="session" className="block text-sm font-medium text-gray-700">
            Session
          </label>
          <select
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="border rounded w-full p-2"
          >
            <option value="2024/2025">2024/2025</option>
            <option value="2023/2024">2023/2024</option>
            <option value="2022/2023">2022/2023</option>
            <option value="2021/2022">2021/2022</option>
            <option value="2020/2021">2020/2021</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
            Semester
          </label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="border rounded w-full p-2"
          >
            <option value={1}>First</option>
            <option value={2}>Second</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">
            Course Code
          </label>
          <div className="flex gap-x-4 items-center">
            <input
              id="courseCode"
              type="text"
              placeholder="Course Code (e.g., MTH121)"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
              className="border rounded w-full p-2 uppercase"
            />
            <button
              onClick={handleAddCourse}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Course
            </button>
          </div>
        </div>
        <ul className="mb-4">
          {courses.map((course, index) => (
            <li key={index} className="flex items-center justify-between p-2 border-b">
              {course}
              <Trash
                className="text-red-500 cursor-pointer"
                onClick={() => handleRemoveCourse(course)}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={handleRegister}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Register
        </button>
        {message && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterCourses;