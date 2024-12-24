"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { getStudentTranscript } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import Loader from '@/components/dashboard-loader';

interface Course {
  courseCode: string;
  unit: number;
  grade: string;
  score: number;
}

interface TranscriptData {
  courses: Course[];
  gpa: string;
  isComplete: boolean;
  semester: number;
  session: string;
  totalCreditEarned: number;
  totalCreditUnit: number;
}

interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

const APPLICATION_SERVER_KEY: string = process.env.NEXT_PUBLIC_APPLICATION_SERVER_KEY || "";
const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

const Transcript: React.FC = () => {
  const { authData } = useAuth();
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState('default');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const fetchTranscript = useMemo(() => {
    return async () => {
      if (selectedSession && selectedSemester) {
        setLoading(true);
        try {
          if (authData?.accessToken) {
            const result = await getStudentTranscript(authData.accessToken, selectedSession, selectedSemester);
            console.log(result);
            setTranscript(result);
          } else {
            setError('Access token is not available');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      }
    };
  }, [authData, selectedSession, selectedSemester]);

  useEffect(() => {
    fetchTranscript();
  }, [fetchTranscript]);

  const requestedNotificationPermission = async (): Promise<boolean> => {
    if (permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        console.log('Notification permission granted!');
        return true;
      } else if (result === 'denied') {
        console.log('Notification permission denied.');
        return false;
      }
    }
    return permission === 'granted';
  };

  async function enablePushNotification() {
    const isPermissionGranted: boolean = await requestedNotificationPermission();

    if (!isPermissionGranted) {
      alert('You need to allow notification to receive updates.');
      return;
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(async (registration) => {
        try {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: APPLICATION_SERVER_KEY,
          });
          console.log('Push Subscription: ', subscription);

          if (authData?.accessToken) {
            const response = await fetch(`${BASE_URL}/api/student/save-subscription`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authData.accessToken,
              },
              body: JSON.stringify({ subscription }),
            });

            if (response.ok) {
              console.log('Subscription saved successfully');
            } else {
              console.error('Failed to save subscription on the server');
            }
          }
        } catch (error) {
          console.error('Failed to subscribe to push notifications:', error);
        }
      });
    } else {
      console.error('Service Workers are not supported in this browser.');
    }
  }

  const handleDownload = () => {
    const doc = new jsPDF() as jsPDFWithPlugin;
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Shalom Project', doc.internal.pageSize.getWidth() / 2, 16, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Student Transcript', doc.internal.pageSize.getWidth() / 2, 24, { align: 'center' });

    if (transcript) {
      autoTable(doc, {
        head: [['Course Code', 'Unit', 'Grade', 'Score']],
        body: transcript.courses.map(entry => [
          entry.courseCode,
          entry.unit,
          entry.grade,
          entry.score
        ]),
        startY: 30,
      });
      const finalY = doc.lastAutoTable.finalY;
      doc.text(`GPA: ${transcript.gpa}`, 14, finalY + 10);
      doc.text(`Total Credit Earned: ${transcript.totalCreditEarned}`, 14, finalY + 20);
      doc.text(`Total Credit Unit: ${transcript.totalCreditUnit}`, 14, finalY + 30);
      doc.save('transcript.pdf');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transcript</h1>
      {loading ? <Loader /> : (
        <>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="session" className="block text-sm font-medium text-gray-700">Session</label>
            <select
              id="session"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="border rounded w-full p-2"
            >
              <option value="">Select Session</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2022/2023">2022/2023</option>
              <option value="2021/2022">2021/2022</option>
              <option value="2020/2021">2020/2021</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700">Semester</label>
            <select
              id="semester"
              value={selectedSemester ?? ''}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="border rounded w-full p-2"
            >
              <option value="">Select Semester</option>
              <option value={1}>First</option>
              <option value={2}>Second</option>
            </select>
          </div>
          <button onClick={handleDownload} className="bg-blue-500 text-white p-2 rounded mb-4">
            Download Transcript
          </button>
          {permission !== 'granted' && (
            <button
              onClick={enablePushNotification}
              className="bg-green-500 text-white p-2 rounded mb-4 hover:bg-green-700 transition duration-300 ml-4"
            >
              Subscribe to notification for transcript
            </button>
          )}
          {transcript && transcript.courses && (
            <>
              <div className="mb-4">
                <p><strong>GPA:</strong> {transcript.gpa}</p>
                <p><strong>Total Credit Earned:</strong> {transcript.totalCreditEarned}</p>
                <p><strong>Total Credit Unit:</strong> {transcript.totalCreditUnit}</p>
              </div>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Course Code</th>
                    <th className="py-2 px-4 border-b text-left">Unit</th>
                    <th className="py-2 px-4 border-b text-left">Grade</th>
                    <th className="py-2 px-4 border-b text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {transcript.courses.map((entry, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{entry.courseCode}</td>
                      <td className="py-2 px-4 border-b">{entry.unit}</td>
                      <td className="py-2 px-4 border-b">{entry.grade}</td>
                      <td className="py-2 px-4 border-b">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Transcript;