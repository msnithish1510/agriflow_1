"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { OrderTrackingView } from '@/components/tracking/OrderTrackingView';
import { Navbar } from '@/components/Navbar';
import { Language } from '@/services/translations';
import { UserRole } from '@/types';

export default function TrackPage() {
  const params = useParams();
  const router = useRouter();
  const trackingId = (params?.trackingId as string) || 'AGR-2026-00125';

  const [language, setLanguage] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<UserRole>('CONSUMER');
  const [isUrbanMode, setIsUrbanMode] = useState(false);

  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px 40px 16px' }}>
      <Navbar
        activeView="track"
        onNavigate={() => router.push('/')}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        isUrbanMode={isUrbanMode}
        onModeToggle={setIsUrbanMode}
      />

      <div style={{ marginTop: '20px' }}>
        <OrderTrackingView
          trackingId={trackingId}
          language={language}
          onBack={() => router.push('/')}
        />
      </div>
    </main>
  );
}
