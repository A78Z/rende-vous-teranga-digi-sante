import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-brand-gray/30">
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-brand-primary tracking-tight">
          Téranga Digi Santé
        </h1>
        <p className="max-w-xl mx-auto text-xl text-brand-secondary">
          La technologie au service de la santé avec l'esprit de la Téranga 🇸🇳.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <Link href="/rendez-vous">
            <Button size="lg" className="bg-brand-medical hover:bg-brand-medical/90 text-white rounded-xl shadow-lg hover:scale-105 transition-all text-lg font-semibold px-8 py-6">
              Prendre un rendez-vous
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
