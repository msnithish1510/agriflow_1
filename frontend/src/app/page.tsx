"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomeView } from '@/components/views/HomeView';
import { MarketPulseView } from '@/components/views/MarketPulseView';
import { PriceTransparencyView } from '@/components/views/PriceTransparencyView';
import { InteractiveDemoView } from '@/components/views/InteractiveDemoView';
import { FarmerWorkflow } from '@/components/views/FarmerWorkflow';
import { FPOWorkflow } from '@/components/views/FPOWorkflow';
import { BulkBuyerWorkflow } from '@/components/views/BulkBuyerWorkflow';
import { ConsumerWorkflow } from '@/components/views/ConsumerWorkflow';
import { LogisticsWorkflow } from '@/components/views/LogisticsWorkflow';
import { AdminWorkflow } from '@/components/views/AdminWorkflow';
import { PriceBreakdownWidget } from '@/components/PriceBreakdownWidget';
import { VoiceAssistantWidget } from '@/components/VoiceAssistantWidget';
import { UserRole } from '@/types';
import { useLanguage } from '@/i18n';

export default function Home() {
  const { t, language } = useLanguage();
  const [activeView, setActiveView] = useState<string>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('FARMER');
  const [isUrbanMode, setIsUrbanMode] = useState<boolean>(false);

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'CONSUMER') {
      setIsUrbanMode(true);
    }
  };

  const handleNavigate = (view: string) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Application Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        onRoleChange={handleRoleSelect}
        isUrbanMode={isUrbanMode}
        onModeToggle={setIsUrbanMode}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1, paddingBottom: '40px' }}>
        
        {/* 1. HOMEPAGE */}
        {activeView === 'home' && (
          <HomeView 
            onNavigate={handleNavigate} 
            onRoleSelect={handleRoleSelect} 
          />
        )}

        {/* 2. HOW IT WORKS (Direct navigation to explainer section) */}
        {activeView === 'how-it-works' && (
          <HomeView 
            onNavigate={handleNavigate} 
            onRoleSelect={handleRoleSelect} 
          />
        )}

        {/* 3. MARKET PULSE */}
        {activeView === 'market-pulse' && (
          <MarketPulseView />
        )}

        {/* 4. PRICE TRANSPARENCY */}
        {activeView === 'price-transparency' && (
          <PriceTransparencyView />
        )}

        {/* 5. INTERACTIVE DEMO */}
        {activeView === 'demo' && (
          <InteractiveDemoView />
        )}

        {/* 6. ROLE DASHBOARDS */}
        {activeView === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {currentRole === 'FARMER' && <FarmerWorkflow />}
            {currentRole === 'BULK_BUYER' && <BulkBuyerWorkflow />}
            {currentRole === 'CONSUMER' && <ConsumerWorkflow />}
            {currentRole === 'LOGISTICS_PARTNER' && <LogisticsWorkflow />}
            {currentRole === 'FPO' && <FPOWorkflow />}
            {currentRole === 'ADMIN' && <AdminWorkflow />}

            {/* Auxiliary Supporting Modules for Farmer/Consumer */}
            {(currentRole === 'FARMER' || currentRole === 'CONSUMER') && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginTop: '12px' }}>
                <PriceBreakdownWidget />
                <VoiceAssistantWidget />
              </div>
            )}
          </div>
        )}

      </main>

      {/* Global Application Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onRoleSelect={handleRoleSelect} 
      />
    </div>
  );
}
