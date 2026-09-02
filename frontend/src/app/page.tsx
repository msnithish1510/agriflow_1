"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { SIHDemoRunner } from '@/components/SIHDemoRunner';
import { FarmerWorkflow } from '@/components/views/FarmerWorkflow';
import { FPOWorkflow } from '@/components/views/FPOWorkflow';
import { BulkBuyerWorkflow } from '@/components/views/BulkBuyerWorkflow';
import { ConsumerWorkflow } from '@/components/views/ConsumerWorkflow';
import { LogisticsWorkflow } from '@/components/views/LogisticsWorkflow';
import { AdminWorkflow } from '@/components/views/AdminWorkflow';
import { PriceBreakdownWidget } from '@/components/PriceBreakdownWidget';
import { VoiceAssistantWidget } from '@/components/VoiceAssistantWidget';
import { UserRole } from '@/types';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('FARMER');
  const [isUrbanMode, setIsUrbanMode] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null);

  const handleScenarioSelect = (id: number) => {
    setActiveScenarioId(id);
    if (id === 1 || id === 2) setCurrentRole('FARMER');
    else if (id === 3) { setCurrentRole('CONSUMER'); setIsUrbanMode(true); }
    else if (id === 4) setCurrentRole('ADMIN');
    else if (id === 5) setCurrentRole('LOGISTICS_PARTNER');
    else if (id === 6) setCurrentRole('FARMER');
  };

  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px 20px' }}>
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        isUrbanMode={isUrbanMode}
        onModeToggle={setIsUrbanMode}
      />

      {/* Interactive SIH 2026 Demo Controller Bar */}
      <SIHDemoRunner onSelectScenario={handleScenarioSelect} />

      {/* Active Role Workflow View */}
      <div style={{ marginBottom: '24px' }}>
        {currentRole === 'FARMER' && <FarmerWorkflow />}
        {currentRole === 'FPO' && <FPOWorkflow />}
        {currentRole === 'BULK_BUYER' && <BulkBuyerWorkflow />}
        {currentRole === 'CONSUMER' && <ConsumerWorkflow />}
        {currentRole === 'LOGISTICS_PARTNER' && <LogisticsWorkflow />}
        {currentRole === 'ADMIN' && <AdminWorkflow />}
      </div>

      {/* Auxiliary SIH Supporting Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        <PriceBreakdownWidget />
        <VoiceAssistantWidget />
      </div>
    </main>
  );
}
