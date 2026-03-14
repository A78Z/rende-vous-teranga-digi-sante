'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, User, Stethoscope, CalendarClock, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { createAppointment, AppointmentData } from '@/lib/appointmentService';
import { handleTeleconsultationNotifications } from '@/lib/notificationsService';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';

const formSchema = z.object({
  patientFirstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' }),
  patientLastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  phone: z.string().min(8, { message: 'Numéro de téléphone invalide.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }),
  doctor: z.string().min(1, { message: 'Veuillez sélectionner un médecin/service.' }),
  hospital: z.string().min(1, { message: 'Veuillez sélectionner un établissement.' }),
  consultationType: z.string().min(1, { message: 'Veuillez sélectionner un type de consultation.' }),
  date: z.date({
    message: 'Une date est requise.',
  }),
  time: z.string().min(1, { message: 'Veuillez sélectionner une heure.' }),
});

const doctors = [
  { id: 'dr-diop', name: 'Dr. Amadou Diop', service: 'Cardiologie' },
  { id: 'dr-fall', name: 'Dr. Fatou Fall', service: 'Pédiatrie' },
  { id: 'dr-ndiaye', name: 'Dr. Ousmane Ndiaye', service: 'Neurologie' },
  { id: 'dr-sow', name: 'Dr. Aissatou Sow', service: 'Médecine Générale' },
];

const hospitals = [
  'Hôpital Principal de Dakar',
  'Clinique de la Madeleine',
  'Centre Médical Téranga',
  'Hôpital Général Idrissa Pouye',
];

const consultationTypes = ['Consultation', 'Contrôle', 'Suivi', 'Téléconsultation'];

const availableTimes = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

const calculatePrice = (type: string, service: string) => {
  if (type === 'Téléconsultation') return 15000;
  if (type === 'Contrôle') return 10000;
  if (service === 'Médecine Générale') return 15000;
  return 20000;
};

interface AppointmentFormProps {
  onSuccess: (data: any) => void;
}

export const AppointmentForm = ({ onSuccess }: AppointmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientFirstName: '',
      patientLastName: '',
      phone: '',
      email: '',
      doctor: '',
      hospital: '',
      consultationType: '',
      time: '',
    },
  });

  const watchConsultationType = form.watch('consultationType');
  const watchDoctor = form.watch('doctor');
  
  const selectedDoctor = doctors.find((d) => d.id === watchDoctor);
  const currentPrice = watchConsultationType && selectedDoctor 
    ? calculatePrice(watchConsultationType, selectedDoctor.service) 
    : 0;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const doc = doctors.find(d => d.id === values.doctor);
      
      const appointmentData: AppointmentData = {
        ...values,
        doctor: doc ? doc.name : values.doctor,
        service: doc ? doc.service : 'Général',
        price: currentPrice,
      };

      const res = await createAppointment(appointmentData);

      if (res.success) {
        toast.success("Rendez-vous confirmé !", {
          description: "Votre carte de rendez-vous est prête.",
        });
        
        if (values.consultationType === 'Téléconsultation') {
            await handleTeleconsultationNotifications(appointmentData);
        }

        onSuccess(res.data);
      } else {
        toast.error("Erreur", { description: res.error || "Une erreur s'est produite." });
      }
    } catch (error) {
      toast.error("Erreur", { description: "Une erreur inattendue s'est produite. Veuillez réessayer." });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/40 p-6 md:p-8 lg:p-10 w-full max-w-4xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#0F2A44] mb-2">Prendre un rendez-vous</h2>
        <p className="text-[#1E6F8F]">Renseignez vos informations pour réserver votre consultation.</p>
      </div>

      <div className="flex justify-between items-center mb-10 text-sm font-medium text-brand-secondary relative px-2 sm:px-4 text-[#1E6F8F] hidden sm:flex">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-[#CFE6EC] -z-10 transform -translate-y-1/2" />
        <div className="flex flex-col items-center gap-2 bg-[#EAF3F6] px-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[#36B37E] text-white flex justify-center items-center font-bold shadow-md">1</div>
          <span className="text-[#0F2A44] font-semibold">Patient</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-[#EAF3F6] px-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-[#CFE6EC] text-[#1E6F8F] flex justify-center items-center font-bold">2</div>
          <span>Consultation</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-[#EAF3F6] px-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-[#CFE6EC] text-[#1E6F8F] flex justify-center items-center font-bold">3</div>
          <span>Confirmation</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#0F2A44] flex items-center gap-2 border-b border-[#CFE6EC] pb-2">
              <User className="w-6 h-6 text-[#1E6F8F]" /> 1. Informations patient
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="patientFirstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0F2A44]">Prénom</FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Input placeholder="Votre prénom" className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white" {...field} />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientLastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0F2A44]">Nom</FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Input placeholder="Votre nom" className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white" {...field} />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0F2A44]">Téléphone</FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Input placeholder="+221 77 000 00 00" type="tel" className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white" {...field} />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0F2A44]">Email</FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Input placeholder="patient@example.com" type="email" className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white" {...field} />
                      </motion.div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#0F2A44] flex items-center gap-2 border-b border-[#CFE6EC] pb-2">
              <Stethoscope className="w-6 h-6 text-[#1E6F8F]" /> 2. Consultation
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0F2A44]">Médecin / Service</FormLabel>
                    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white">
                            <SelectValue placeholder="Sélectionnez un médecin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-lg border-gray-100 max-w-[320px]">
                          {doctors.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id} className="rounded-lg cursor-pointer">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-semibold truncate">{doc.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{doc.service}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hospital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0F2A44]">Établissement</FormLabel>
                    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white">
                            <SelectValue placeholder="Sélectionnez un établissement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-lg border-gray-100">
                          {hospitals.map((hosp) => (
                            <SelectItem key={hosp} value={hosp} className="rounded-lg cursor-pointer">{hosp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationType"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-[#0F2A44]">Type de consultation</FormLabel>
                    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white">
                            <SelectValue placeholder="Sélectionnez le type de consultation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-lg border-gray-100">
                          {consultationTypes.map((type) => (
                            <SelectItem key={type} value={type} className="rounded-lg cursor-pointer">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-[#0F2A44] flex items-center gap-2 border-b border-[#CFE6EC] pb-2">
              <CalendarClock className="w-6 h-6 text-[#1E6F8F]" /> 3. Date et heure
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[#0F2A44]">Date de rendez-vous</FormLabel>
                    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger
                            className={cn(
                              "inline-flex items-center justify-between whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground",
                              "h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all w-full pl-3 text-left font-normal bg-white",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
                          </PopoverTrigger>
                        </FormControl>
                      <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-gray-100" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0)) || date.getDay() === 0
                          }
                          initialFocus
                          className="rounded-xl bg-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#0F2A44]">Heure souhaitée</FormLabel>
                    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                      <Select onValueChange={field.onChange} value={field.value || ""} disabled={!form.watch('date')}>
                        <FormControl>
                          <SelectTrigger className="h-12 px-4 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#36B37E] focus:border-[#36B37E] shadow-sm transition-all duration-200 bg-white">
                            <SelectValue placeholder="Sélectionnez une heure" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl shadow-lg border-gray-100">
                          {availableTimes.map((time) => (
                            <SelectItem key={time} value={time} className="rounded-lg cursor-pointer">{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {currentPrice > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#EAF3F6] p-4 rounded-xl border border-[#CFE6EC] flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-[#0F2A44]">Tarif de la consultation</p>
                <p className="text-sm text-[#1E6F8F]">Calculé automatiquement</p>
              </div>
              <div className="text-2xl font-bold text-[#36B37E]">
                {currentPrice} FCFA
              </div>
            </motion.div>
          )}

          <div className="pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-[#36B37E] to-[#1E6F8F] text-white shadow-lg border-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  'Confirmer le rendez-vous'
                )}
              </Button>
            </motion.div>
            
            <p className="text-sm text-gray-500 text-center mt-4 flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4" /> Vos informations sont sécurisées et confidentielles.
            </p>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};
