'use client'

import { useEffect } from 'react'
import { DoctorSchedule } from '@/components/DoctorSchedule'
import { useAppointment } from '@/context/AppointmentContext'
import { mockDoctors, mockAppointments } from '@/data/mockData'

export default function Home() {
  const { dispatch } = useAppointment()

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_DOCTORS', payload: mockDoctors })
    dispatch({ type: 'SET_APPOINTMENTS', payload: mockAppointments })
  }, [dispatch])

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DoctorSchedule />
      </div>
    </main>
  )
}
