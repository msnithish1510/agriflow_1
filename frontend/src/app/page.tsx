"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { SIHDemoRunner } from '@/components/SIHDemoRunner';
import { FarmerWorkflow } from '@/components/views/FarmerWorkflow';
import { FPOWorkflow } from '@/components/views/FPOWorkflow';
import { BulkBuyerWorkflow } from '@/components/views/BulkBuyerWorkflow';
import { ConsumerWorkflow } from '@/components/views/ConsumerWorkflow';
import { LogisticsWorkflow } from '@/components/views/LogisticsWorkflow';
import { AdminWorkflow } from '@/components/views/AdminWorkflow';
import { PriceBreakdownWidget } from '@/components/PriceBreakdownWidget';
import { VoiceAssistantFAB } from '@/components/voice/VoiceAssistantFAB';
import { VoicePanel } from '@/components/voice/VoicePanel';
import { UserRole, NavigateToTarget } from '@/types';
import { Language } from '@/services/translations';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('FARMER');
  const [isUrbanMode, setIsUrbanMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null);

  // Voice assistant hook
  const assistant = useVoiceAssistant(language, currentRole, setLanguage);

  // Handle voice-driven navigation
  useEffect(() => {
    if (assistant.pendingNavigation) {
      const nav = assistant.pendingNavigation;
      if (nav.role && nav.role !== currentRole) {
        setCurrentRole(nav.role);
      }
      // Tab navigation is handled by the NavigateToTarget signal
      // Individual workflow components can pick this up via prop
      assistant.clearNavigation();
    }
  }, [assistant.pendingNavigation, currentRole, assistant.clearNavigation]);

  const handleScenarioSelect = (id: number) => {
    setActiveScenarioId(id);
    if (id === 1 || id === 2) setCurrentRole('FARMER');
    else if (id === 3) { setCurrentRole('CONSUMER'); setIsUrbanMode(true); }
    else if (id === 4) setCurrentRole('ADMIN');
    else if (id === 5) setCurrentRole('LOGISTICS_PARTNER');
    else if (id === 6) setCurrentRole('FARMER');
  };

  return (
    <>
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px 40px 16px' }}>
        <Navbar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          isUrbanMode={isUrbanMode}
          onModeToggle={setIsUrbanMode}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Interactive SIH 2026 Demo Controller Bar */}
        <SIHDemoRunner onSelectScenario={handleScenarioSelect} />

        {/* Active Role Workflow View */}
        <div style={{ marginBottom: '24px' }}>
          {currentRole === 'FARMER' && <FarmerWorkflow language={language} />}
          {currentRole === 'FPO' && <FPOWorkflow />}
          {currentRole === 'BULK_BUYER' && <BulkBuyerWorkflow />}
          {currentRole === 'CONSUMER' && <ConsumerWorkflow />}
          {currentRole === 'LOGISTICS_PARTNER' && <LogisticsWorkflow />}
          {currentRole === 'ADMIN' && <AdminWorkflow />}
        </div>

        {/* Auxiliary Supporting Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          <PriceBreakdownWidget />
        </div>
      </main>

      {/* ============================================================
          Floating Voice Assistant (Global Overlay)
          ============================================================ */}
      <VoiceAssistantFAB
        isListening={assistant.isListening}
        isOpen={assistant.isOpen}
        onClick={assistant.togglePanel}
      />

      {assistant.isOpen && (
        <VoicePanel
          assistant={assistant}
          userRole={currentRole}
          onLanguageChange={setLanguage}
        />
      )}
    </>
  );
}
