'use client';

import React, { useState } from 'react';
import { AppointmentForm } from '@/components/appointment/AppointmentForm';
import { AppointmentCard } from '@/components/appointment/AppointmentCard';

export const AppointmentPageClient = () => {
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const handleSuccess = (data: any) => {
    setAppointmentData(data);
    // Smooth scroll to top of card if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {!appointmentData ? (
        <AppointmentForm onSuccess={handleSuccess} />
      ) : (
        <AppointmentCard data={appointmentData} />
      )}
    </div>
  );
};
