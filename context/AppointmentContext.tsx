'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { IDoctor, IAppointment, IBookingForm } from '@/types';

interface AppointmentState {
  doctors: IDoctor[];
  appointments: IAppointment[];
  selectedDate: Date;
  isBookingModalOpen: boolean;
  selectedSlot: { doctorId: string; time: string; date: string } | null;
}

type AppointmentAction =
  | { type: 'SET_DOCTORS'; payload: IDoctor[] }
  | { type: 'SET_APPOINTMENTS'; payload: IAppointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: IAppointment }
  | { type: 'ADD_DOCTOR'; payload: IDoctor }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'OPEN_BOOKING_MODAL'; payload: { doctorId: string; time: string; date: string } }
  | { type: 'CLOSE_BOOKING_MODAL' }
  | { type: 'UPDATE_APPOINTMENT_STATUS'; payload: { id: string; status: IAppointment['status'] } };

const AppointmentContext = createContext<{
  state: AppointmentState;
  dispatch: React.Dispatch<AppointmentAction>;
  bookAppointment: (booking: IBookingForm) => void;
  addDoctor: (doctor: Omit<IDoctor, 'id' | 'isOnDuty' | 'isMultipleDuties'>) => void;
} | null>(null);

const appointmentReducer = (state: AppointmentState, action: AppointmentAction): AppointmentState => {
  switch (action.type) {
    case 'SET_DOCTORS':
      return { ...state, doctors: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'ADD_DOCTOR':
      return { ...state, doctors: [...state.doctors, action.payload] };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'OPEN_BOOKING_MODAL':
      return { ...state, isBookingModalOpen: true, selectedSlot: action.payload };
    case 'CLOSE_BOOKING_MODAL':
      return { ...state, isBookingModalOpen: false, selectedSlot: null };
    case 'UPDATE_APPOINTMENT_STATUS':
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt.id === action.payload.id ? { ...apt, status: action.payload.status } : apt
        )
      };
    default:
      return state;
  }
};

const initialState: AppointmentState = {
  doctors: [],
  appointments: [],
  selectedDate: new Date(),
  isBookingModalOpen: false,
  selectedSlot: null,
};

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  const bookAppointment = (booking: IBookingForm) => {
    const newAppointment: IAppointment = {
      id: Date.now().toString(),
      doctorId: booking.doctorId,
      patientName: `${booking.patientFirstName} ${booking.patientLastName}`,
      patientEmail: booking.patientEmail,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: 'confirmed',
      department: state.doctors.find(d => d.id === booking.doctorId)?.department || '',
      agent: 'System',
    };

    dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
    dispatch({ type: 'CLOSE_BOOKING_MODAL' });
  };

  const addDoctor = (doctorData: Omit<IDoctor, 'id' | 'isOnDuty' | 'isMultipleDuties'>) => {
    const newDoctor: IDoctor = {
      ...doctorData,
      id: Date.now().toString(),
      isOnDuty: true,
      isMultipleDuties: false,
    };

    dispatch({ type: 'ADD_DOCTOR', payload: newDoctor });
  };

  return (
    <AppointmentContext.Provider value={{ state, dispatch, bookAppointment, addDoctor }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};