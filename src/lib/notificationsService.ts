export const sendConfirmationNotification = async (details: { appointmentNumber: string, patientFirstName: string, patientLastName: string, date: Date; time: string; doctor: string; price: number }) => {
  // In a real application, make an API call to your backend/Parse Cloud Code to send emails/SMS
  console.log('--- SENT CONFIRMATION NOTIFICATION ---');
  console.log(`✅ Votre consultation en ligne est confirmée`);
  console.log(`Date: ${details.date.toLocaleDateString()}`);
  console.log(`Heure: ${details.time}`);
  console.log(`Médecin: ${details.doctor}`);
  console.log(`Tarif: ${details.price} FCFA`);
  console.log('----------------------------------------');
  return true;
};

export const sendReminder24hNotification = async (details: any) => {
  console.log('--- SENT 24H REMINDER NOTIFICATION ---');
  console.log(`⏰ Rappel consultation`);
  console.log(`Votre consultation aura lieu demain.`);
  console.log('--------------------------------------');
  return true;
};

export const sendReminder15mNotification = async (details: any) => {
  console.log('--- SENT 15M REMINDER NOTIFICATION ---');
  console.log(`⏰ La consultation commence dans 15 minutes`);
  console.log(`Rejoindre la consultation`);
  console.log('--------------------------------------');
  return true;
};

export const handleTeleconsultationNotifications = async (details: any) => {
  if (details.consultationType === 'Téléconsultation') {
    // Send immediate confirmation
    await sendConfirmationNotification(details);
    
    // Simulate scheduling for 24h and 15m reminders
    // Usually handled by crons or Parse Cloud Background Jobs
    console.log('Scheduled 24h Reminder');
    console.log('Scheduled 15m Reminder');
  }
};
