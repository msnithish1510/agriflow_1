"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HomeView } from "@/components/views/HomeView";
import { MarketPulseView } from "@/components/views/MarketPulseView";
import { PriceTransparencyView } from "@/components/views/PriceTransparencyView";
import { InteractiveDemoView } from "@/components/views/InteractiveDemoView";
import { FarmerWorkflow } from "@/components/views/FarmerWorkflow";
import { FPOWorkflow } from "@/components/views/FPOWorkflow";
import { BulkBuyerWorkflow } from "@/components/views/BulkBuyerWorkflow";
import { ConsumerWorkflow } from "@/components/views/ConsumerWorkflow";
import { LogisticsWorkflow } from "@/components/views/LogisticsWorkflow";
import { AdminWorkflow } from "@/components/views/AdminWorkflow";
import { PriceBreakdownWidget } from "@/components/PriceBreakdownWidget";

import { VoiceAssistantFAB } from "@/components/voice/VoiceAssistantFAB";
import { VoicePanel } from "@/components/voice/VoicePanel";
import { UserRole } from "@/types";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { useLanguage } from "@/i18n";

export default function Home() {
const { language, setLanguage } = useLanguage();

const [activeView, setActiveView] = useState<string>("home");
const [currentRole, setCurrentRole] = useState<UserRole>("FARMER");
const [isUrbanMode, setIsUrbanMode] = useState<boolean>(false);

// Voice assistant
const assistant = useVoiceAssistant(
language,
currentRole,
setLanguage
);

// Handle role selection
const handleRoleSelect = (role: UserRole) => {
setCurrentRole(role);


if (role === "CONSUMER") {
  setIsUrbanMode(true);
}


};

// Handle main navigation
const handleNavigate = (view: string) => {
setActiveView(view);


window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

// Handle voice-driven role navigation
useEffect(() => {
  if (assistant.pendingNavigation) {
    const nav = assistant.pendingNavigation;

    if (nav.role && nav.role !== currentRole) {
      setCurrentRole(nav.role);
    }

    assistant.clearNavigation();
  }
}, [
  assistant.pendingNavigation,
  currentRole,
  assistant.clearNavigation,
]);


return (
<div
style={{
minHeight: "100vh",
display: "flex",
flexDirection: "column",
}}
>
{/* Top Application Navbar */} <Navbar
     activeView={activeView}
     onNavigate={handleNavigate}
     currentRole={currentRole}
     onRoleChange={handleRoleSelect}
     isUrbanMode={isUrbanMode}
     onModeToggle={setIsUrbanMode}
   />


  {/* Main Content Area */}
  <main
    className="app-container"
    style={{
      flex: 1,
      paddingBottom: "40px",
    }}
  >
    {/* HOME */}
    {activeView === "home" && (
      <HomeView
        onNavigate={handleNavigate}
        onRoleSelect={handleRoleSelect}
      />
    )}

    {/* HOW IT WORKS */}
    {activeView === "how-it-works" && (
      <HomeView
        onNavigate={handleNavigate}
        onRoleSelect={handleRoleSelect}
      />
    )}

    {/* MARKET PULSE */}
    {activeView === "market-pulse" && (
      <MarketPulseView />
    )}

    {/* PRICE TRANSPARENCY */}
    {activeView === "price-transparency" && (
      <PriceTransparencyView />
    )}

    {/* INTERACTIVE DEMO */}
    {activeView === "demo" && (
      <InteractiveDemoView />
    )}

    {/* ROLE DASHBOARDS */}
    {activeView === "dashboard" && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {currentRole === "FARMER" && (
          <FarmerWorkflow language={language} />
        )}

        {currentRole === "BULK_BUYER" && (
          <BulkBuyerWorkflow />
        )}

        {currentRole === "CONSUMER" && (
          <ConsumerWorkflow />
        )}

        {currentRole === "LOGISTICS_PARTNER" && (
          <LogisticsWorkflow />
        )}

        {currentRole === "FPO" && (
          <FPOWorkflow />
        )}

        {currentRole === "ADMIN" && (
          <AdminWorkflow />
        )}

        {/* Supporting Modules */}
        {(currentRole === "FARMER" ||
          currentRole === "CONSUMER") && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "24px",
              marginTop: "12px",
            }}
          >
            <PriceBreakdownWidget />
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

  {/* Global Voice Assistant */}
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
</div>



);
}
