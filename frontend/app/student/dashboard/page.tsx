'use client'
import React from 'react'
import { useAuth } from "@/context/AuthContext";


function Dashboard() {
  const { authData } = useAuth();
  return (
    <div className='p-8'>Hello {authData?.fullName}</div>
  )
}

export default Dashboard