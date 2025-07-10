'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { DoctorCard } from './DoctorCard';
import { AddDoctorModal } from './AddDoctorModal';
import { useAppointment } from '@/context/AppointmentContext';
import { Button } from './ui/Button';

export const DoctorSchedule: React.FC = () => {
  const { state, addDoctor } = useAppointment();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);

  const departments = useMemo(() => {
    const deps = state.doctors.map(doctor => doctor.department);
    return Array.from(new Set(deps));
  }, [state.doctors]);

  const filteredDoctors = useMemo(() => {
    return state.doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doctor.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [state.doctors, searchQuery, selectedDepartment]);

  const handleAddDoctor = (doctorData: {
    name: string;
    department: string;
    specialization: string;
    avatar: string;
    dutyStart: string;
    dutyEnd: string;
  }) => {
    addDoctor(doctorData);
    setIsAddDoctorModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Schedule</h1>
        <div className="flex gap-2">
          <Button 
            variant="primary"
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </Button>
          <Button variant="primary">
            New Appointment
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by doctor name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No doctors found matching your search criteria.</p>
        </div>
      )}

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
        onAddDoctor={handleAddDoctor}
      />
    </div>
  );
};