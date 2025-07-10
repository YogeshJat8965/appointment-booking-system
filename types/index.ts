export interface IDoctor {
  id: string;
  name: string;
  department: string;
  specialization: string;
  avatar: string;
  dutyStart: string;
  dutyEnd: string;
  isOnDuty: boolean;
  isMultipleDuties: boolean;
}

export interface IAppointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientEmail: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  department: string;
  agent?: string;
}

export interface ITimeSlot {
  time: string;
  isAvailable: boolean;
  appointmentId?: string;
  patientName?: string;
}

export interface IBookingForm {
  doctorId: string;
  date: string;
  timeSlot: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
}
