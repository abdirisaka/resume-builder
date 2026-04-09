import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    }>
      <HomeClient />
    </Suspense>
  );
}
