"use client";

import React, { useState, useEffect } from "react";
import {
  Sprout,
  Package,
  PlusCircle,
  Bell,
  TrendingUp,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  DollarSign,
  Users,
  Truck,
  Check,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";

import {
  Crop,
  ExpectedSupply,
  AvailableStock,
  DemandPost,
  OrderMatch,
  NotificationItem,
} from "@/types";

import {
  fetchCrops,
  createExpectedSupply,
  createAvailableStock,
  fetchExpectedSupplies,
  fetchAvailableStocks,
  fetchDemands,
  fetchOrders,
  fetchNotifications,
  markNotificationRead,
  fetchAdvisoryGuidance,
} from "@/services/api";

import { OrderTrackingView } from "@/components/tracking/OrderTrackingView";
import { useLanguage } from "@/i18n";
import { StatusBadge } from "../ui/StatusBadge";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";

interface FarmerWorkflowProps {
  language?: string;
}

export const FarmerWorkflow: React.FC<FarmerWorkflowProps> = () => {
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "supplies"
    | "stocks"
    | "demands"
    | "orders"
    | "notifications"
    | "earnings"
    | "guidance"
  >("dashboard");

  const [selectedTrackingId, setSelectedTrackingId] =
    useState<string | null>(null);

  const [crops, setCrops] = useState<Crop[]>([]);
  const [mySupplies, setMySupplies] = useState<ExpectedSupply[]>([]);
  const [myStocks, setMyStocks] = useState<AvailableStock[]>([]);
  const [demandOpps, setDemandOpps] = useState<DemandPost[]>([]);
  const [myOrders, setMyOrders] = useState<OrderMatch[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [userFriendlyMsg, setUserFriendlyMsg] = useState<string | null>(null);

  // 5-Step Crop Entry Wizard
  const [showCropWizard, setShowCropWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardMode, setWizardMode] =
    useState<"EXPECTED" | "STOCK">("EXPECTED");

  const [selectedCropId, setSelectedCropId] = useState("crop-tomato");
  const [selectedCropName, setSelectedCropName] = useState("Tomato");
  const [qtyKg, setQtyKg] = useState("2500");
  const [pricePerKg, setPricePerKg] = useState("25.0");
  const [targetDate, setTargetDate] = useState("2026-09-25");
  const [district, setDistrict] = useState("Nashik");
  const [grade, setGrade] = useState<
    "GRADE_A" | "GRADE_B" | "ORGANIC" | "EXPORT"
  >("GRADE_A");

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const cropsData = await fetchCrops();

      setCrops(cropsData);

      if (cropsData.length > 0 && !selectedCropId) {
        setSelectedCropId(cropsData[0].id);
        setSelectedCropName(cropsData[0].name);
      }

      const supData = await fetchExpectedSupplies();

      setMySupplies(
        supData.items || [
          {
            id: "sup-001",
            farmer_id: "usr-farm-01",
            crop_id: "crop-tomato",
            expected_quantity_kg: 5000,
            expected_harvest_date: "2026-09-22",
            min_price_per_kg: 24.5,
            quality_grade: "GRADE_A",
            farm_latitude: 20.1741,
            farm_longitude: 73.9871,
            status: "PROPOSED",
          },
          {
            id: "sup-002",
            farmer_id: "usr-farm-01",
            crop_id: "crop-onion",
            expected_quantity_kg: 8000,
            expected_harvest_date: "2026-09-30",
            min_price_per_kg: 22.0,
            quality_grade: "GRADE_A",
            farm_latitude: 20.1741,
            farm_longitude: 73.9871,
            status: "CONFIRMED",
          },
        ]
      );

      const stkData = await fetchAvailableStocks();

      setMyStocks(
        stkData.items || [
          {
            id: "stk-001",
            farmer_id: "usr-farm-01",
            crop_id: "crop-tomato",
            available_quantity_kg: 800,
            price_per_kg: 26.0,
            harvest_date: "2026-09-06",
            shelf_life_remaining_days: 4,
            quality_grade: "GRADE_A",
            location_latitude: 20.1741,
            location_longitude: 73.9871,
            status: "OPEN",
          },
        ]
      );

      const demData = await fetchDemands();

      setDemandOpps(
        demData.items || [
          {
            id: "dem-001",
            posted_by_user_id: "usr-buy-01",
            crop_id: "crop-tomato",
            required_quantity_kg: 25000,
            max_price_per_kg: 28.0,
            target_delivery_date: "2026-09-25",
            quality_requirement: "GRADE_A",
            is_bulk_demand: true,
            delivery_address: "Reliance Retail DC, Bhosari, Pune",
            delivery_latitude: 18.6298,
            delivery_longitude: 73.8477,
            status: "OPEN",
          },
          {
            id: "dem-002",
            posted_by_user_id: "usr-buy-02",
            crop_id: "crop-onion",
            required_quantity_kg: 40000,
            max_price_per_kg: 25.0,
            target_delivery_date: "2026-09-28",
            quality_requirement: "GRADE_A",
            is_bulk_demand: true,
            delivery_address: "DeHaat Hub, Nashik",
            delivery_latitude: 20.0112,
            delivery_longitude: 73.7902,
            status: "OPEN",
          },
        ]
      );

      const ordData = await fetchOrders();

      setMyOrders(
        ordData.items || [
          {
            id: "ord-a0813237",
            buyer_id: "usr-buy-01",
            matched_crop_id: "crop-tomato",
            total_matched_quantity_kg: 1000,
            agreed_farmer_price_per_kg: 25.75,
            total_amount_inr: 25750,
            participating_farmer_ids: [
              {
                farmer_id: "usr-farm-01",
                farmer_name: "Farmer (You)",
                allocated_quantity_kg: 1000,
                price_per_kg: 25.75,
              },
            ],
            match_score: 96.8,
            status: "IN_TRANSIT",
            created_at: "2026-09-06",
          },
        ]
      );

      const notifData = await fetchNotifications();

      setNotifications(
        notifData.length > 0
          ? notifData
          : [
            {
              id: "notif-1",
              user_id: "usr-farm-01",
              title: "Buyer Match Opportunity",
              message:
                "Reliance Retail DC needs 1,000 kg Tomato near your village.",
              notification_type: "MATCH",
              is_read: false,
              created_at: "10 mins ago",
            },
            {
              id: "notif-2",
              user_id: "usr-farm-01",
              title: "Pickup Route Scheduled",
              message:
                "Vehicle MH-15-AB-4020 will collect 1,000 kg Tomato on Sept 22 at 08:30 AM.",
              notification_type: "LOGISTICS",
              is_read: true,
              created_at: "2 hours ago",
            },
          ]
      );
    } catch (err) {
      console.warn("Fallback data activated for farmer dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCropWizard = (
    mode: "EXPECTED" | "STOCK" = "EXPECTED"
  ) => {
    setWizardMode(mode);
    setWizardStep(1);
    setFormError(null);
    setShowCropWizard(true);
  };

  const handleCropSelect = (cropId: string) => {
    setSelectedCropId(cropId);

    const found = crops.find((c) => c.id === cropId);

    if (found) {
      setSelectedCropName(found.name);

      if (found.indicative_base_price_per_kg) {
        setPricePerKg(found.indicative_base_price_per_kg.toString());
      }
    }
  };

  const handleStepNext = () => {
    setFormError(null);

    if (wizardStep === 2) {
      const q = parseFloat(qtyKg);

      if (isNaN(q) || q <= 0) {
        setFormError(t.farmer.wizard.validationQty);
        return;
      }
    } else if (wizardStep === 3) {
      const p = parseFloat(pricePerKg);

      if (isNaN(p) || p <= 0) {
        setFormError(t.farmer.wizard.validationPrice);
        return;
      }
    }

    setWizardStep((prev) => Math.min(prev + 1, 5));
  };

  const handleStepBack = () => {
    setFormError(null);
    setWizardStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (wizardMode === "EXPECTED") {
        const payload = {
          crop_id: selectedCropId || "crop-tomato",
          expected_quantity_kg: parseFloat(qtyKg),
          expected_harvest_date: targetDate,
          min_price_per_kg: parseFloat(pricePerKg),
          quality_grade: grade,
          farm_latitude: 20.1741,
          farm_longitude: 73.9871,
        };

        await createExpectedSupply(payload);

        setMySupplies((prev) => [
          {
            id: `sup-${Date.now()}`,
            farmer_id: "usr-farm-01",
            crop_id: selectedCropId,
            expected_quantity_kg: parseFloat(qtyKg),
            expected_harvest_date: targetDate,
            min_price_per_kg: parseFloat(pricePerKg),
            quality_grade: grade,
            farm_latitude: 20.1741,
            farm_longitude: 73.9871,
            status: "PROPOSED",
          },
          ...prev,
        ]);
      } else {
        const payload = {
          crop_id: selectedCropId || "crop-tomato",
          available_quantity_kg: parseFloat(qtyKg),
          price_per_kg: parseFloat(pricePerKg),
          harvest_date: targetDate,
          shelf_life_remaining_days: 8,
          quality_grade: grade,
          location_latitude: 20.1741,
          location_longitude: 73.9871,
        };

        await createAvailableStock(payload);

        setMyStocks((prev) => [
          {
            id: `stk-${Date.now()}`,
            farmer_id: "usr-farm-01",
            crop_id: selectedCropId,
            available_quantity_kg: parseFloat(qtyKg),
            price_per_kg: parseFloat(pricePerKg),
            harvest_date: targetDate,
            shelf_life_remaining_days: 8,
            quality_grade: grade,
            location_latitude: 20.1741,
            location_longitude: 73.9871,
            status: "OPEN",
          },
          ...prev,
        ]);
      }

      setShowCropWizard(false);
      setUserFriendlyMsg(t.farmer.wizard.successMsg);
    } catch (err) {
      setShowCropWizard(false);
      setUserFriendlyMsg(t.farmer.wizard.successMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReadNotification = async (id: string) => {
    try {
      await markNotificationRead(id);
    } catch (e) { }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  };

  const totalYield = mySupplies.reduce(
    (acc, s) => acc + (s.expected_quantity_kg || 0),
    0
  );

  const totalStock = myStocks.reduce(
    (acc, s) => acc + (s.available_quantity_kg || 0),
    0
  );

  const totalEarningsEst = mySupplies.reduce(
    (acc, s) =>
      acc +
      (s.expected_quantity_kg || 0) *
      (s.min_price_per_kg || 0) *
      0.938,
    0
  );

  const cropIcons: Record<string, string> = {
    Tomato: "🍅",
    Onion: "🧅",
    Potato: "🥔",
    Wheat: "🌾",
    "Moong (Green Gram)": "🌱",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* 1. Farmer Header */}
      <div
        className="glass-panel"
        style={{
          background:
            "linear-gradient(135deg, rgba(16,185,129,0.16) 0%, rgba(6,182,212,0.14) 100%)",
          border: "1.5px solid rgba(16,185,129,0.35)",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span className="badge-tag badge-rural">
                <Sprout size={14} /> {t.common.roles.FARMER}
              </span>

              <span
                style={{
                  fontSize: "0.82rem",
                  color: "#34d399",
                  fontWeight: 600,
                }}
              >
                ● Nashik District, Maharashtra
              </span>
            </div>

            <h1
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              {t.farmer.greeting}
            </h1>

            <p
              style={{
                fontSize: "0.92rem",
                color: "#cbd5e1",
                marginTop: "4px",
              }}
            >
              {t.farmer.greetingSub}
            </p>
          </div>

          <button
            className="btn-emerald"
            onClick={() => handleOpenCropWizard("EXPECTED")}
            style={{
              fontSize: "1.05rem",
              padding: "14px 26px",
              boxShadow: "0 6px 22px rgba(16,185,129,0.45)",
            }}
          >
            <PlusCircle size={22} />
            {t.farmer.addCropBtn}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {userFriendlyMsg && (
        <div
          style={{
            background: "rgba(16,185,129,0.18)",
            border: "1px solid #10b981",
            padding: "14px 18px",
            borderRadius: "14px",
            color: "#34d399",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle size={20} />
            <span>{userFriendlyMsg}</span>
          </div>

          <button
            onClick={() => setUserFriendlyMsg(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#cbd5e1",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          className="glass-panel"
          style={{ borderLeft: "5px solid #10b981" }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "#cbd5e1",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            🌾 {t.farmer.summary.declaredHarvest}
          </span>

          <div
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#10b981",
              marginTop: "4px",
            }}
          >
            {totalYield.toLocaleString("en-IN")} kg
          </div>

          <div
            style={{
              fontSize: "0.82rem",
              color: "#94a3b8",
              marginTop: "2px",
            }}
          >
            {mySupplies.length}{" "}
            {language === "ta"
              ? "செயலில் உள்ள பயிர்கள்"
              : language === "hi"
                ? "सक्रिय फसलें"
                : language === "te"
                  ? "క్రియాశీల పంటలు"
                  : language === "ml"
                    ? "സജീവ വിളകൾ"
                    : language === "kn"
                      ? "ಸಕ್ರಿಯ ಬೆಳೆಗಳು"
                      : "active listings"}
          </div>
        </div>

        <div
          className="glass-panel"
          style={{ borderLeft: "5px solid #38bdf8" }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "#cbd5e1",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            💡 {t.farmer.summary.activeDemands}
          </span>

          <div
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#38bdf8",
              marginTop: "4px",
            }}
          >
            {demandOpps.length}{" "}
            {language === "ta"
              ? "தேவைகள்"
              : language === "hi"
                ? "मांगें"
                : language === "te"
                  ? "డిమాండ్లు"
                  : language === "ml"
                    ? "ആവശ്യങ്ങൾ"
                    : language === "kn"
                      ? "ಬೇಡಿಕೆಗಳು"
                      : "demands"}
          </div>

          <div
            style={{
              fontSize: "0.82rem",
              color: "#94a3b8",
              marginTop: "2px",
            }}
          >
            verified institutional buyers
          </div>
        </div>

        <div
          className="glass-panel"
          style={{ borderLeft: "5px solid #a855f7" }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "#cbd5e1",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            📦 {t.farmer.summary.availableStock}
          </span>

          <div
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#c084fc",
              marginTop: "4px",
            }}
          >
            {totalStock.toLocaleString("en-IN")} kg
          </div>

          <div
            style={{
              fontSize: "0.82rem",
              color: "#94a3b8",
              marginTop: "2px",
            }}
          >
            Ready for instant dispatch
          </div>
        </div>

        <div
          className="glass-panel"
          style={{ borderLeft: "5px solid #06b6d4" }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "#cbd5e1",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            🚚 {t.farmer.summary.pendingOrders}
          </span>

          <div
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#38bdf8",
              marginTop: "4px",
            }}
          >
            {myOrders.length}{" "}
            {language === "ta"
              ? "ஆர்டர்கள்"
              : language === "hi"
                ? "सक्रिय ऑर्डर"
                : language === "te"
                  ? "క్రియాశీల ఆర్డర్లు"
                  : language === "ml"
                    ? "സജീവ ഓർഡറുകൾ"
                    : language === "kn"
                      ? "ಸಕ್ರಿಯ ಆದೇಶಗಳು"
                      : "active"}
          </div>

          <div
            style={{
              fontSize: "0.82rem",
              color: "#94a3b8",
              marginTop: "2px",
            }}
          >
            Scheduled for pickup
          </div>
        </div>

        <div
          className="glass-panel"
          style={{ borderLeft: "5px solid #f59e0b" }}
        >
          <span
            style={{
              fontSize: "0.82rem",
              color: "#cbd5e1",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            💰 {t.farmer.summary.estimatedPayout}
          </span>

          <div
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#fbbf24",
              marginTop: "4px",
            }}
          >
            ₹
            {totalEarningsEst.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </div>

          <div
            style={{
              fontSize: "0.82rem",
              color: "#34d399",
              marginTop: "2px",
            }}
          >
            93.8% direct farmer realization
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}
      >
        {[
          {
            id: "dashboard",
            label: t.farmer.tabs.overview,
          },
          {
            id: "supplies",
            label: `${t.farmer.tabs.myCrops} (${mySupplies.length})`,
          },
          {
            id: "stocks",
            label: `${t.farmer.tabs.currentStock} (${myStocks.length})`,
          },
          {
            id: "demands",
            label: `${t.farmer.tabs.demands} (${demandOpps.length})`,
          },
          {
            id: "orders",
            label: `${t.farmer.tabs.orders} (${myOrders.length})`,
          },
          {
            id: "notifications",
            label: `${t.farmer.tabs.alerts} (${notifications.filter((n) => !n.is_read).length
              })`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "10px 18px",
              borderRadius: "24px",
              border: "none",
              background:
                activeTab === tab.id
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "rgba(255,255,255,0.06)",
              color:
                activeTab === tab.id ? "#ffffff" : "#cbd5e1",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              minHeight: "42px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Dashboard */}
      {activeTab === "dashboard" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                marginBottom: "14px",
                color: "#cbd5e1",
              }}
            >
              {t.farmer.quickActionsTitle}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
              }}
            >
              <div
                className="action-card"
                onClick={() => handleOpenCropWizard("EXPECTED")}
                style={{ borderLeft: "4px solid #10b981" }}
              >
                <div style={{ fontSize: "1.8rem" }}>🌾</div>

                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: "#10b981",
                    }}
                  >
                    {t.farmer.quickActions.postStock}
                  </div>

                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#94a3b8",
                      marginTop: "2px",
                    }}
                  >
                    {t.farmer.quickActions.postStockSub}
                  </div>
                </div>
              </div>

              <div
                className="action-card"
                onClick={() => setActiveTab("demands")}
                style={{ borderLeft: "4px solid #38bdf8" }}
              >
                <div style={{ fontSize: "1.8rem" }}>📊</div>

                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: "#38bdf8",
                    }}
                  >
                    {t.farmer.quickActions.viewDemand}
                  </div>

                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#94a3b8",
                      marginTop: "2px",
                    }}
                  >
                    {t.farmer.quickActions.viewDemandSub}
                  </div>
                </div>
              </div>

              <div
                className="action-card"
                onClick={() => handleOpenCropWizard("STOCK")}
                style={{ borderLeft: "4px solid #a855f7" }}
              >
                <div style={{ fontSize: "1.8rem" }}>📦</div>

                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: "#c084fc",
                    }}
                  >
                    {language === "ta"
                      ? "அறுவடை இருப்பு பதிவு"
                      : language === "hi"
                        ? "बिक्री स्टॉक पोस्ट करें"
                        : language === "te"
                          ? "అమ్మకం కాని స్టాక్ పోస్ట్ చేయండి"
                          : language === "ml"
                            ? "വിൽക്കാത്ത സ്റ്റോക്ക് പോസ്റ്റ് ചെയ്യുക"
                            : language === "kn"
                              ? "ದಾಸ್ತಾನು ಪೋಸ್ಟ್ ಮಾಡಿ"
                              : "Post Unsold Stock"}
                  </div>

                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#94a3b8",
                      marginTop: "2px",
                    }}
                  >
                    Find nearby emergency buyers
                  </div>
                </div>
              </div>

              <div
                className="action-card"
                onClick={() => setActiveTab("orders")}
                style={{ borderLeft: "4px solid #f59e0b" }}
              >
                <div style={{ fontSize: "1.8rem" }}>🚚</div>

                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: "#fbbf24",
                    }}
                  >
                    {t.farmer.quickActions.trackOrders}
                  </div>

                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#94a3b8",
                      marginTop: "2px",
                    }}
                  >
                    {t.farmer.quickActions.trackOrdersSub}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Crops */}
          <div className="glass-panel">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                }}
              >
                🌾 {t.farmer.tabs.myCrops}
              </h2>

              <button
                className="btn-secondary"
                onClick={() => handleOpenCropWizard("EXPECTED")}
                style={{
                  padding: "6px 14px",
                  fontSize: "0.85rem",
                  minHeight: "36px",
                }}
              >
                + Add Crop
              </button>
            </div>

            {mySupplies.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "14px",
                }}
              >
                {mySupplies.map((sup) => {
                  const cropName =
                    crops.find((c) => c.id === sup.crop_id)?.name ||
                    "Tomato";

                  return (
                    <div
                      key={sup.id}
                      className="surface-card"
                      style={{
                        borderLeft: "4px solid #10b981",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <StatusBadge status={sup.status} />

                        <span
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: 800,
                            color: "#10b981",
                          }}
                        >
                          ₹{sup.min_price_per_kg}/kg
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: "1.15rem",
                          fontWeight: 800,
                          color: "#ffffff",
                        }}
                      >
                        {cropIcons[cropName] || "🌾"} {cropName}
                      </h3>

                      <div
                        style={{
                          fontSize: "0.88rem",
                          color: "#cbd5e1",
                          marginTop: "6px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <div>
                          Expected Quantity:{" "}
                          <strong style={{ color: "#fff" }}>
                            {sup.expected_quantity_kg.toLocaleString(
                              "en-IN"
                            )}{" "}
                            kg
                          </strong>
                        </div>

                        <div>
                          Harvest Date:{" "}
                          <strong style={{ color: "#38bdf8" }}>
                            {sup.expected_harvest_date}
                          </strong>
                        </div>

                        <div>
                          Quality Grade: {sup.quality_grade}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={t.common.emptyState.noSupplies}
                actionLabel={t.farmer.wizard.step1Title}
                onAction={() =>
                  handleOpenCropWizard("EXPECTED")
                }
              />
            )}
          </div>

          {/* Active Orders Preview */}
          <div className="glass-panel">
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                marginBottom: "16px",
                color: "#f8fafc",
              }}
            >
              🚚 {t.farmer.tabs.orders}
            </h2>

            {myOrders.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="surface-card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <StatusBadge status={ord.status} />

                        <strong
                          style={{
                            color: "#f8fafc",
                            fontSize: "1rem",
                          }}
                        >
                          Order #{ord.id}
                        </strong>
                      </div>

                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#94a3b8",
                          marginTop: "4px",
                        }}
                      >
                        Quantity:{" "}
                        <strong>
                          {ord.total_matched_quantity_kg} kg
                        </strong>{" "}
                        | Buyer Payout:{" "}
                        <strong style={{ color: "#10b981" }}>
                          ₹{ord.agreed_farmer_price_per_kg}/kg
                        </strong>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "1.35rem",
                          fontWeight: 800,
                          color: "#fbbf24",
                        }}
                      >
                        ₹
                        {ord.total_amount_inr?.toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#34d399",
                        }}
                      >
                        Guaranteed Direct Transfer
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title={t.common.emptyState.noOrders} />
            )}
          </div>
        </div>
      )}

      {/* 5. Supplies */}
      {activeTab === "supplies" && (
        <div className="glass-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              🌾 {t.farmer.tabs.myCrops}
            </h2>

            <button
              className="btn-emerald"
              onClick={() => handleOpenCropWizard("EXPECTED")}
            >
              <PlusCircle size={18} />
              {t.farmer.addCropBtn}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {mySupplies.map((sup) => {
              const cropName =
                crops.find((c) => c.id === sup.crop_id)?.name ||
                "Tomato";

              return (
                <div
                  key={sup.id}
                  className="surface-card"
                  style={{
                    borderLeft: "4px solid #10b981",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <StatusBadge status={sup.status} />

                    <span
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "#10b981",
                      }}
                    >
                      ₹{sup.min_price_per_kg}/kg
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    {cropIcons[cropName] || "🌾"} {cropName}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "#cbd5e1",
                      marginTop: "6px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div>
                      Quantity:{" "}
                      <strong>
                        {sup.expected_quantity_kg.toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg
                      </strong>
                    </div>

                    <div>
                      Target Date:{" "}
                      <strong style={{ color: "#38bdf8" }}>
                        {sup.expected_harvest_date}
                      </strong>
                    </div>

                    <div>
                      Grade: <strong>{sup.quality_grade}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Available Stock */}
      {activeTab === "stocks" && (
        <div className="glass-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              📦 {t.farmer.tabs.currentStock}
            </h2>

            <button
              className="btn-emerald"
              onClick={() => handleOpenCropWizard("STOCK")}
            >
              <PlusCircle size={18} />
              Add Stock Listing
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {myStocks.map((stk) => {
              const cropName =
                crops.find((c) => c.id === stk.crop_id)?.name ||
                "Tomato";

              return (
                <div
                  key={stk.id}
                  className="surface-card"
                  style={{
                    borderLeft: "4px solid #a855f7",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <StatusBadge status={stk.status} />

                    <span
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "#c084fc",
                      }}
                    >
                      ₹{stk.price_per_kg}/kg
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    {cropIcons[cropName] || "🌾"} {cropName}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "#cbd5e1",
                      marginTop: "6px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div>
                      Available Stock:{" "}
                      <strong>
                        {stk.available_quantity_kg.toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg
                      </strong>
                    </div>

                    <div>
                      Harvested On:{" "}
                      <strong>{stk.harvest_date}</strong>
                    </div>

                    <div>
                      Remaining Shelf Life:{" "}
                      <strong style={{ color: "#fbbf24" }}>
                        {stk.shelf_life_remaining_days} days
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Buyer Demands */}
      {activeTab === "demands" && (
        <div className="glass-panel">
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              marginBottom: "16px",
              color: "#f8fafc",
            }}
          >
            🤝 {t.farmer.tabs.demands}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {demandOpps.map((dem) => (
              <div
                key={dem.id}
                className="surface-card"
                style={{
                  borderLeft: "4px solid #38bdf8",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <StatusBadge status="HIGH_DEMAND" />

                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 800,
                      color: "#10b981",
                    }}
                  >
                    ₹{dem.max_price_per_kg}/kg
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "#ffffff",
                  }}
                >
                  🌾 Tomato
                </h3>

                <div
                  style={{
                    fontSize: "0.88rem",
                    color: "#cbd5e1",
                    marginTop: "6px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div>
                    Required:{" "}
                    <strong style={{ color: "#fff" }}>
                      {dem.required_quantity_kg?.toLocaleString(
                        "en-IN"
                      )}{" "}
                      kg
                    </strong>
                  </div>

                  <div>
                    Needed By: <strong>{dem.target_delivery_date}</strong>
                  </div>

                  <div>
                    Destination:{" "}
                    <span>{dem.delivery_address}</span>
                  </div>
                </div>

                <button
                  className="btn-emerald"
                  onClick={() =>
                    handleOpenCropWizard("EXPECTED")
                  }
                  style={{
                    marginTop: "14px",
                    width: "100%",
                    minHeight: "42px",
                    fontSize: "0.9rem",
                  }}
                >
                  {language === "ta"
                    ? "இந்தத் தேவைக்கு பயிர் ஒதுக்குக"
                    : language === "hi"
                      ? "इस मांग के लिए आपूर्ति प्रतिबद्ध करें"
                      : language === "te"
                        ? "ఈ డిమాండ్ కోసం సరఫరాను కేటాయించండి"
                        : language === "ml"
                          ? "ഈ ആവശ്യത്തിന് വിള നൽകുക"
                          : language === "kn"
                            ? "ಈ ಬೇಡಿಕೆಗೆ ಬೆಳೆ ನಿಯೋಜಿಸಿ"
                            : "Commit Supply to this Demand"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Orders + Live Tracking */}
      {activeTab === "orders" &&
        (selectedTrackingId ? (
          <OrderTrackingView
            trackingId={selectedTrackingId}
            language={language}
            onBack={() => setSelectedTrackingId(null)}
          />
        ) : (
          <div className="glass-panel">
            <div style={{ marginBottom: "18px" }}>
              <h2
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🚚 {t.farmer.tabs.orders}
              </h2>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#cbd5e1",
                }}
              >
                {language === "ta"
                  ? "உறுதிசெய்யப்பட்ட ஆர்டர்கள் மற்றும் போக்குவரத்து நிலை"
                  : "Confirmed crop sales and direct pickup status"}
              </p>
            </div>

            {myOrders.length === 0 ? (
              <EmptyState
                title={
                  language === "ta"
                    ? "இன்னும் ஆர்டர்கள் இல்லை"
                    : "No confirmed orders yet"
                }
                message={
                  language === "ta"
                    ? "பயிர் விவரங்களை உள்ளிட்ட பிறகு வாங்குபவர் ஆர்டர்கள் இங்கு தோன்றும்."
                    : "Post your crop details to receive buyer matches and purchase orders."
                }
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="surface-card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <StatusBadge status={ord.status} />

                        <h3
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "#f8fafc",
                          }}
                        >
                          {language === "ta"
                            ? "ஆர்டர் எண்"
                            : "Order"}{" "}
                          #{ord.id.substring(0, 8)}
                        </h3>
                      </div>

                      <div
                        style={{
                          fontSize: "0.88rem",
                          color: "#cbd5e1",
                          marginTop: "6px",
                        }}
                      >
                        {language === "ta"
                          ? "பயிர்"
                          : "Crop"}
                        : <strong>Tomato</strong>
                        {" | "}
                        {language === "ta"
                          ? "அளவு"
                          : "Quantity"}
                        :{" "}
                        <strong>
                          {ord.total_matched_quantity_kg.toLocaleString(
                            "en-IN"
                          )}{" "}
                          kg
                        </strong>
                      </div>

                      <div
                        style={{
                          fontSize: "0.84rem",
                          color: "#94a3b8",
                          marginTop: "2px",
                        }}
                      >
                        {language === "ta"
                          ? "இலக்கு: Reliance Retail DC, Bhosari, Pune"
                          : "Destination: Reliance Retail DC, Bhosari, Pune"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "1.35rem",
                            fontWeight: 800,
                            color: "#fbbf24",
                          }}
                        >
                          ₹
                          {ord.total_amount_inr?.toLocaleString(
                            "en-IN"
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "#34d399",
                            fontWeight: 700,
                          }}
                        >
                          ₹{ord.agreed_farmer_price_per_kg}/kg Direct
                          Payout
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedTrackingId(
                            "AGR-2026-00125"
                          )
                        }
                        className="btn-emerald"
                        style={{
                          padding: "10px 16px",
                          minHeight: "42px",
                          fontSize: "0.82rem",
                        }}
                      >
                        {language === "ta"
                          ? "🚚 நேரடி கண்காணிப்பு"
                          : "🚚 Track Live Map"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      {/* 9. Notifications */}
      {activeTab === "notifications" && (
        <div className="glass-panel">
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              marginBottom: "16px",
              color: "#f8fafc",
            }}
          >
            🔔 {t.farmer.tabs.alerts}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {notifications.length === 0 ? (
              <EmptyState
                title={
                  language === "ta"
                    ? "அறிவிப்புகள் இல்லை"
                    : "No notifications"
                }
              />
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleReadNotification(n.id)}
                  className="surface-card"
                  style={{
                    borderLeft: n.is_read
                      ? "4px solid #475569"
                      : "4px solid #10b981",
                    background: n.is_read
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(16,185,129,0.06)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.98rem",
                        color: n.is_read
                          ? "#cbd5e1"
                          : "#ffffff",
                      }}
                    >
                      {n.title}
                    </div>

                    <span
                      style={{
                        fontSize: "0.78rem",
                        color: "#94a3b8",
                      }}
                    >
                      {n.created_at || "Just now"}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "#94a3b8",
                      marginTop: "4px",
                    }}
                  >
                    {n.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 10. Crop Entry Wizard */}
      <Modal
        isOpen={showCropWizard}
        onClose={() => setShowCropWizard(false)}
        title={
          wizardMode === "EXPECTED"
            ? t.farmer.wizard.title
            : "Post Harvested Stock"
        }
        maxWidth="620px"
      >
        <div>
          {/* Stepper */}
          <div
            className="stepper-container"
            style={{ marginBottom: "20px" }}
          >
            {[1, 2, 3, 4, 5].map((stepNum) => {
              const isActive = wizardStep === stepNum;
              const isDone = wizardStep > stepNum;

              return (
                <div
                  key={stepNum}
                  className="stepper-step"
                >
                  <div
                    className={`stepper-circle ${isActive
                        ? "active"
                        : isDone
                          ? "completed"
                          : ""
                      }`}
                  >
                    {isDone ? "✓" : stepNum}
                  </div>

                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: isActive
                        ? "#34d399"
                        : "#94a3b8",
                    }}
                  >
                    {stepNum === 1
                      ? t.farmer.wizard.step1
                      : stepNum === 2
                        ? t.farmer.wizard.step2
                        : stepNum === 3
                          ? t.farmer.wizard.step3
                          : stepNum === 4
                            ? t.farmer.wizard.step4
                            : t.farmer.wizard.step5}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Error */}
          {formError && (
            <div
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid #ef4444",
                color: "#f87171",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "0.88rem",
                marginBottom: "16px",
              }}
            >
              ⚠️ {formError}
            </div>
          )}

          {/* STEP 1 */}
          {wizardStep === 1 && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginBottom: "4px",
                }}
              >
                {t.farmer.wizard.step1Title}
              </h3>

              <p
                style={{
                  fontSize: "0.86rem",
                  color: "#94a3b8",
                  marginBottom: "18px",
                }}
              >
                {t.farmer.wizard.step1Sub}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "10px",
                }}
              >
                {crops.map((c) => {
                  const isSelected =
                    selectedCropId === c.id;

                  const icon =
                    cropIcons[c.name] || "🌾";

                  return (
                    <div
                      key={c.id}
                      onClick={() =>
                        handleCropSelect(c.id)
                      }
                      style={{
                        padding: "16px 12px",
                        borderRadius: "12px",
                        background: isSelected
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(255,255,255,0.04)",
                        border: isSelected
                          ? "2px solid #10b981"
                          : "1px solid rgba(255,255,255,0.1)",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "2rem",
                          marginBottom: "6px",
                        }}
                      >
                        {icon}
                      </div>

                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          color: isSelected
                            ? "#34d399"
                            : "#f8fafc",
                        }}
                      >
                        {c.name}
                      </div>

                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "#94a3b8",
                          marginTop: "2px",
                        }}
                      >
                        Base: ₹
                        {c.indicative_base_price_per_kg}
                        /kg
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {wizardStep === 2 && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginBottom: "4px",
                }}
              >
                {t.farmer.wizard.step2Title}
              </h3>

              <p
                style={{
                  fontSize: "0.86rem",
                  color: "#94a3b8",
                  marginBottom: "18px",
                }}
              >
                {t.farmer.wizard.step2Sub}
              </p>

              <label className="input-label">
                {t.farmer.wizard.quantityLabel}
              </label>

              <input
                type="number"
                value={qtyKg}
                onChange={(e) =>
                  setQtyKg(e.target.value)
                }
                className="input-large"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#10b981",
                }}
                placeholder="e.g. 2500"
              />

              <div style={{ marginTop: "14px" }}>
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  {t.farmer.wizard.step2Presets}
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: "6px",
                  }}
                >
                  {["500", "1000", "2500", "5000", "10000"].map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setQtyKg(p)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border:
                            qtyKg === p
                              ? "1px solid #10b981"
                              : "1px solid rgba(255,255,255,0.1)",
                          background:
                            qtyKg === p
                              ? "rgba(16,185,129,0.2)"
                              : "rgba(255,255,255,0.04)",
                          color:
                            qtyKg === p
                              ? "#34d399"
                              : "#cbd5e1",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        {parseInt(p).toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {wizardStep === 3 && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginBottom: "4px",
                }}
              >
                {t.farmer.wizard.step3Title}
              </h3>

              <p
                style={{
                  fontSize: "0.86rem",
                  color: "#94a3b8",
                  marginBottom: "18px",
                }}
              >
                {t.farmer.wizard.step3Sub}
              </p>

              <label className="input-label">
                {t.farmer.wizard.priceLabel}
              </label>

              <input
                type="number"
                step="0.5"
                value={pricePerKg}
                onChange={(e) =>
                  setPricePerKg(e.target.value)
                }
                className="input-large"
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#fbbf24",
                }}
                placeholder="e.g. 24.50"
              />

              <div
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border:
                    "1px solid rgba(245,158,11,0.3)",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  marginTop: "14px",
                  fontSize: "0.84rem",
                  color: "#fbbf24",
                }}
              >
                💡 <strong>Advisory Market Guidance:</strong>{" "}
                Current Nashik district buyer willingness
                for {selectedCropName} ranges from
                <strong> ₹24.00 - ₹28.50/kg</strong>.
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {wizardStep === 4 && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginBottom: "4px",
                }}
              >
                {t.farmer.wizard.step4Title}
              </h3>

              <p
                style={{
                  fontSize: "0.86rem",
                  color: "#94a3b8",
                  marginBottom: "18px",
                }}
              >
                {t.farmer.wizard.step4Sub}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div>
                  <label className="input-label">
                    {t.farmer.wizard.dateLabel}
                  </label>

                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) =>
                      setTargetDate(e.target.value)
                    }
                    className="input-large"
                  />
                </div>

                <div>
                  <label className="input-label">
                    {t.farmer.wizard.districtLabel}
                  </label>

                  <select
                    value={district}
                    onChange={(e) =>
                      setDistrict(e.target.value)
                    }
                    className="input-large"
                  >
                    <option value="Nashik">
                      Nashik
                    </option>
                    <option value="Pune">
                      Pune
                    </option>
                    <option value="Ahmednagar">
                      Ahmednagar
                    </option>
                    <option value="Coimbatore">
                      Coimbatore
                    </option>
                  </select>
                </div>

                <div>
                  <label className="input-label">
                    {t.farmer.wizard.gradeLabel}
                  </label>

                  <select
                    value={grade}
                    onChange={(e) =>
                      setGrade(
                        e.target.value as
                        | "GRADE_A"
                        | "GRADE_B"
                        | "ORGANIC"
                        | "EXPORT"
                      )
                    }
                    className="input-large"
                  >
                    <option value="GRADE_A">
                      Grade A
                    </option>
                    <option value="ORGANIC">
                      Certified Organic
                    </option>
                    <option value="EXPORT">
                      Export Quality
                    </option>
                    <option value="GRADE_B">
                      Grade B
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {wizardStep === 5 && (
            <div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginBottom: "4px",
                }}
              >
                {t.farmer.wizard.step5Title}
              </h3>

              <p
                style={{
                  fontSize: "0.86rem",
                  color: "#94a3b8",
                  marginBottom: "18px",
                }}
              >
                {t.farmer.wizard.step5Sub}
              </p>

              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.06)",
                    paddingBottom: "8px",
                  }}
                >
                  <span style={{ color: "#94a3b8" }}>
                    {t.farmer.wizard.cropLabel}:
                  </span>

                  <strong
                    style={{
                      color: "#ffffff",
                      fontSize: "1.05rem",
                    }}
                  >
                    {selectedCropName}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.06)",
                    paddingBottom: "8px",
                  }}
                >
                  <span style={{ color: "#94a3b8" }}>
                    {t.farmer.wizard.quantityLabel}:
                  </span>

                  <strong
                    style={{
                      color: "#10b981",
                      fontSize: "1.1rem",
                    }}
                  >
                    {parseFloat(qtyKg).toLocaleString(
                      "en-IN"
                    )}{" "}
                    kg
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.06)",
                    paddingBottom: "8px",
                  }}
                >
                  <span style={{ color: "#94a3b8" }}>
                    {t.farmer.wizard.priceLabel}:
                  </span>

                  <strong
                    style={{
                      color: "#fbbf24",
                      fontSize: "1.1rem",
                    }}
                  >
                    ₹{pricePerKg}/kg
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom:
                      "1px solid rgba(255,255,255,0.06)",
                    paddingBottom: "8px",
                  }}
                >
                  <span style={{ color: "#94a3b8" }}>
                    {t.farmer.wizard.dateLabel}:
                  </span>

                  <strong style={{ color: "#38bdf8" }}>
                    {targetDate}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ color: "#94a3b8" }}>
                    Estimated Payout Realization:
                  </span>

                  <strong
                    style={{
                      color: "#34d399",
                      fontSize: "1.2rem",
                    }}
                  >
                    ₹
                    {(
                      parseFloat(qtyKg || "0") *
                      parseFloat(pricePerKg || "0")
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
              paddingTop: "16px",
              borderTop:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {wizardStep > 1 ? (
              <button
                className="btn-secondary"
                onClick={handleStepBack}
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} />
                {t.common.back}
              </button>
            ) : (
              <button
                className="btn-secondary"
                onClick={() =>
                  setShowCropWizard(false)
                }
                disabled={isSubmitting}
              >
                {t.common.cancel}
              </button>
            )}

            {wizardStep < 5 ? (
              <button
                className="btn-emerald"
                onClick={handleStepNext}
              >
                {t.common.continue}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn-emerald"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                style={{
                  padding: "12px 24px",
                }}
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <span>
                    {wizardMode === "EXPECTED"
                      ? t.farmer.wizard.publishExpectedBtn
                      : t.farmer.wizard.publishStockBtn}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};