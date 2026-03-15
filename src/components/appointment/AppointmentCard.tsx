'use client';

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AppointmentQRCode } from './AppointmentQRCode';
import { Calendar, Clock, MapPin, User, Stethoscope, Download, Printer, CalendarPlus, CheckCircle2, ClipboardList, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AppointmentCardProps {
  data: {
    appointmentNumber: string;
    patientFirstName: string;
    patientLastName: string;
    date: Date;
    time: string;
    doctor: string;
    service: string;
    hospital: string;
    appointmentType: string;
    reason?: string;
    medicalDocumentUrl?: string;
    price: number;
  };
}

export const AppointmentCard = ({ data }: AppointmentCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`RDV_${data.appointmentNumber}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCalendarAdd = () => {
    const startObj = new Date(data.date);
    const [hours, mins] = data.time.split(':');
    startObj.setHours(parseInt(hours), parseInt(mins));
    const endObj = new Date(startObj.getTime() + 30 * 60000);
    
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consultation+${encodeURIComponent(data.service)}&dates=${formatTime(startObj)}/${formatTime(endObj)}&details=RDV+avec+${encodeURIComponent(data.doctor)}&location=${encodeURIComponent(data.hospital)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      
      <div className="text-center space-y-2 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-brand-medical/20 p-3 rounded-full inline-block mb-2">
           <CheckCircle2 className="w-12 h-12 text-brand-medical" />
        </div>
        <h2 className="text-2xl font-bold text-brand-primary">🎉 Rendez-vous confirmé !</h2>
        <p className="text-brand-secondary">Votre carte de rendez-vous est prête.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card 
          ref={cardRef} 
          className="w-full bg-white shadow-2xl overflow-hidden border-t-[12px] border-t-brand-primary rounded-2xl print:shadow-none print:border-none print:m-0"
        >
        <CardHeader className="text-center border-b pb-6 pt-8 bg-brand-gray/30">
          <CardTitle className="text-3xl font-bold text-brand-primary uppercase tracking-wider">
            Téranga Digi Santé
          </CardTitle>
          <CardDescription className="text-sm text-brand-secondary font-medium mt-2 max-w-sm mx-auto">
            La technologie au service de la santé avec l'esprit de la Téranga 🇸🇳
          </CardDescription>
          <div className="mt-6 flex justify-center">
            <span className="bg-brand-light/20 text-brand-primary text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
              Carte de rendez-vous
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-6 flex-1 w-full">
              
              <div className="flex items-start gap-4">
                <div className="bg-brand-gray p-2 rounded-lg text-brand-primary mt-1">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Patient</p>
                  <p className="font-bold text-lg text-brand-primary">
                    {data.patientFirstName} {data.patientLastName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-gray p-2 rounded-lg text-brand-primary mt-1">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Médecin / Service</p>
                  <p className="font-bold text-brand-primary text-base">{data.doctor}</p>
                  <p className="text-brand-secondary text-sm">{data.service}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="text-brand-medical">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Date</p>
                    <p className="font-bold text-brand-primary">{data.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="text-brand-medical">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Heure</p>
                    <p className="font-bold text-brand-primary">{data.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="text-brand-medical">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Établissement</p>
                  <p className="font-bold text-brand-primary">{data.hospital}</p>
                  <p className="text-brand-secondary text-sm capitalize">
                    {{ service: 'Consultation au service', cabinet: 'Consultation au cabinet', online: 'Consultation en ligne', biologie: 'Biologie', imagerie: 'Imagerie' }[data.appointmentType] || data.appointmentType}
                  </p>
                </div>
              </div>

              {data.reason && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 shadow-sm mt-4">
                  <div className="text-amber-600">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-amber-700/80 uppercase tracking-wider font-semibold">Motif du patient</p>
                    <p className="font-medium text-amber-900 mt-1">{data.reason}</p>
                    {data.medicalDocumentUrl && (
                      <a href={data.medicalDocumentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#1E6F8F] hover:underline bg-white px-3 py-1.5 rounded border border-[#CFE6EC]">
                        <FileText size={14} /> Télécharger le document joint
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>

            <div className="flex flex-col items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Numéro RDV</p>
                <p className="font-mono font-bold text-xl text-brand-primary bg-brand-gray px-3 py-1 rounded-md">
                  {data.appointmentNumber}
                </p>
              </div>

              <div className="flex justify-center md:justify-end w-full">
                <div className="max-w-[140px] w-full">
                  <AppointmentQRCode 
                    data={{
                      appointmentNumber: data.appointmentNumber,
                      patientName: `${data.patientFirstName} ${data.patientLastName}`,
                      date: data.date,
                      time: data.time
                    }} 
                  />
                </div>
              </div>
              
              <div className="text-center">
                 <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Tarif</p>
                 <div className="text-3xl font-bold text-[#1E6F8F] mb-3">{data.price} FCFA</div>
                 <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                   Paiement sur place
                 </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-dashed border-border text-center space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center max-w-lg mx-auto">
              <p className="text-sm font-semibold text-amber-800">⚠️ Merci de présenter cette carte à l'accueil du service.</p>
              <p className="text-sm text-amber-700/80 mt-1">Présentez-vous 30 minutes avant l'heure de votre rendez-vous.</p>
            </div>
            <p className="text-xs text-brand-secondary font-medium mt-4 pt-2">www.teranga-digi-sante.com</p>
          </div>
        </CardContent>
      </Card>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center print:hidden w-full animate-in fade-in zoom-in-95 duration-500 delay-300">
        <Button onClick={handleDownloadPDF} className="bg-[#0F2A44] hover:bg-[#163A5C] text-white rounded-xl px-6 py-6 shadow-lg gap-2 flex-1 md:flex-none">
          <Download size={18} />
          Télécharger PDF
        </Button>
        <Button onClick={handlePrint} variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-gray gap-2 flex-1 md:flex-none">
          <Printer size={18} />
          Imprimer
        </Button>
        <Button onClick={handleCalendarAdd} variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-gray gap-2 flex-1 md:flex-none">
          <CalendarPlus size={18} />
          Ajouter au calendrier
        </Button>
      </div>
    </div>
  );
};
