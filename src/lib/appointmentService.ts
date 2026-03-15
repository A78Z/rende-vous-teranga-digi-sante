import Parse from './parse';

export interface AppointmentData {
  patientFirstName: string;
  patientLastName: string;
  phone: string;
  email: string;
  doctor: string;
  service: string;
  hospital: string;
  appointmentType: string;
  reason?: string;
  medicalDocument?: any;
  date: Date;
  time: string;
  price: number;
}

export const createAppointment = async (data: AppointmentData) => {
  const Appointment = Parse.Object.extend('Appointment');
  const appointment = new Appointment();

  // Generate a random TDS-XXXXXX number
  const appointmentNumber = `TDS-${Math.floor(100000 + Math.random() * 900000)}`;

  appointment.set('appointmentNumber', appointmentNumber);
  appointment.set('patientFirstName', data.patientFirstName);
  appointment.set('patientLastName', data.patientLastName);
  appointment.set('phone', data.phone);
  appointment.set('email', data.email);
  appointment.set('doctor', data.doctor);
  appointment.set('service', data.service);
  appointment.set('hospital', data.hospital);
  appointment.set('appointmentType', data.appointmentType);
  if (data.reason) {
    appointment.set('reason', data.reason);
  }
  if (data.medicalDocument) {
    const parseFile = new Parse.File(data.medicalDocument.name, data.medicalDocument);
    appointment.set('medicalDocument', parseFile);
  }
  appointment.set('date', data.date);
  appointment.set('time', data.time);
  appointment.set('price', data.price);
  appointment.set('status', 'confirmed'); // Auto confirmed for the MVP

  try {
    // MOCK SAVE FOR LOCAL TESTING WITHOUT REAL BACK4APP KEYS
    // const result = await appointment.save();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      data: {
        id: 'mock_id_123',
        appointmentNumber,
        ...data,
      },
    };
  } catch (error: any) {
    console.error('Error creating appointment: ', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
