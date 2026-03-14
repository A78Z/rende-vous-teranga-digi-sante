import { AppointmentPageClient } from './AppointmentPageClient';

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF3F6] via-[#DCEFF3] to-[#CFE6EC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10 text-center">
          <img src="/logo.png" alt="Teranga Digi Santé Logo" className="h-[70px] mb-4 object-contain drop-shadow-sm" />
          <h1 className="text-4xl font-bold text-[#0F2A44] mb-2">
            TERANGA DIGI SANTÉ
          </h1>
          <p className="max-w-xl mx-auto text-[#1E6F8F] text-lg font-medium">
            La technologie au service de la santé
          </p>
        </div>
        
        <AppointmentPageClient />
      </div>
    </div>
  );
}
