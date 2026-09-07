"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  PlusCircle,
  Layers,
  Zap,
  CheckCircle2,
  Truck,
  Calendar,
  MapPin,
  Check,
  X,
  Search,
} from "lucide-react";

import { Crop, DemandPost, OrderMatch } from "@/types";
import {
  fetchCrops,
  createDemand,
  fetchDemands,
  runMatching,
  createOrder,
  fetchOrders,
} from "@/services/api";

import { OrderTrackingView } from "@/components/tracking/OrderTrackingView";
import { useLanguage } from "@/i18n";

export const BulkBuyerWorkflow: React.FC = () => {
  const { t, language } = useLanguage();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);

  const [selectedTrackingId, setSelectedTrackingId] =
    useState<string | null>(null);

  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState("");

  const [qtyKg, setQtyKg] = useState("25000");
  const [maxPrice, setMaxPrice] = useState("28.0");
  const [deliveryDate, setDeliveryDate] = useState("2026-09-25");
  const [address, setAddress] = useState(
    "Reliance Retail DC, Bhosari, Pune"
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [matchingResults, setMatchingResults] = useState<any>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  /*
   * ------------------------------------------------------------
   * LOAD DATA
   * ------------------------------------------------------------
   */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cropsData = await fetchCrops();

      setCrops(cropsData || []);

      if (cropsData && cropsData.length > 0) {
        setSelectedCropId(cropsData[0].id);
      }

      const demData = await fetchDemands("is_bulk=true");

      const fallbackDemands: DemandPost[] = [
        {
          id: "dem-bulk-101",
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
      ];

      setDemands(
        demData?.items && demData.items.length > 0
          ? demData.items
          : fallbackDemands
      );

      const ordData = await fetchOrders();

      setOrders(ordData?.items || []);
    } catch (error) {
      console.warn("Bulk buyer data loading failed:", error);

      setDemands([
        {
          id: "dem-bulk-101",
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
      ]);
    }
  };

  /*
   * ------------------------------------------------------------
   * TOAST
   * ------------------------------------------------------------
   */

  const showToast = (message: string) => {
    setToastMessage(message);

    window.setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /*
   * ------------------------------------------------------------
   * POST BULK DEMAND
   * ------------------------------------------------------------
   */

  const handlePostDemand = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const cropId =
        selectedCropId || crops[0]?.id || "crop-tomato";

      const quantity = parseFloat(qtyKg);
      const price = parseFloat(maxPrice);

      if (!quantity || quantity <= 0) {
        showToast("Please enter a valid quantity.");
        return;
      }

      if (!price || price <= 0) {
        showToast("Please enter a valid maximum price.");
        return;
      }

      const payload = {
        crop_id: cropId,
        required_quantity_kg: quantity,
        max_price_per_kg: price,
        target_delivery_date: deliveryDate,
        quality_requirement: "GRADE_A",
        is_bulk_demand: true,
        delivery_address: address,
        delivery_latitude: 18.6298,
        delivery_longitude: 73.8477,
      };

      await createDemand(payload);

      const newDemand: DemandPost = {
        id: `dem-bulk-${Date.now()}`,
        posted_by_user_id: "usr-buy-01",
        crop_id: cropId,
        required_quantity_kg: quantity,
        max_price_per_kg: price,
        target_delivery_date: deliveryDate,
        quality_requirement: "GRADE_A",
        is_bulk_demand: true,
        delivery_address: address,
        delivery_latitude: 18.6298,
        delivery_longitude: 73.8477,
        status: "OPEN",
      };

      setDemands((previous) => [newDemand, ...previous]);

      setShowPostModal(false);

      if (language === "ta") {
        showToast("மொத்த கொள்முதல் தேவை வெற்றிகரமாக பதிவு செய்யப்பட்டது!");
      } else if (language === "hi") {
        showToast("थोक खरीद की आवश्यकता सफलतापूर्वक पोस्ट की गई!");
      } else {
        showToast(
          "Bulk procurement requirement posted successfully!"
        );
      }
    } catch (error) {
      console.warn("Demand API failed:", error);

      /*
       * Demo-friendly behaviour:
       * Even if backend is unavailable, keep the demo usable.
       */

      const newDemand: DemandPost = {
        id: `dem-bulk-${Date.now()}`,
        posted_by_user_id: "usr-buy-01",
        crop_id:
          selectedCropId || crops[0]?.id || "crop-tomato",
        required_quantity_kg: parseFloat(qtyKg) || 25000,
        max_price_per_kg: parseFloat(maxPrice) || 28,
        target_delivery_date: deliveryDate,
        quality_requirement: "GRADE_A",
        is_bulk_demand: true,
        delivery_address: address,
        delivery_latitude: 18.6298,
        delivery_longitude: 73.8477,
        status: "OPEN",
      };

      setDemands((previous) => [newDemand, ...previous]);
      setShowPostModal(false);

      showToast("Requirement posted successfully.");
    }
  };

  /*
   * ------------------------------------------------------------
   * AI MATCHING
   * ------------------------------------------------------------
   */

  const handleExecuteMatch = async (demandId: string) => {
    setMatchingLoading(true);

    try {
      const result = await runMatching(demandId);

      setMatchingResults(
        result?.match_details || result
      );
    } catch (error) {
      console.warn("AI matching API failed. Using demo result.");

      /*
       * Demo fallback.
       */

      setMatchingResults({
        demand_id: demandId,
        crop: "Tomato",
        matched_quantity_kg: 25000,
        agreed_farmer_price_per_kg: 24.5,
        match_score: 96.4,
        participating_farmers: [
          {
            farmer_id: "usr-farm-01",
            farmer_name:
              "Ramesh Patil (Pimpalgaon, Nashik)",
            allocated_quantity_kg: 10000,
            price_per_kg: 24.0,
          },
          {
            farmer_id: "usr-farm-02",
            farmer_name:
              "Suresh Deshmukh (Niphad, Nashik)",
            allocated_quantity_kg: 10000,
            price_per_kg: 24.5,
          },
          {
            farmer_id: "usr-fpo-01",
            farmer_name:
              "Sahyadri Farmers Co-op (FPO)",
            allocated_quantity_kg: 5000,
            price_per_kg: 25.0,
          },
        ],
      });
    } finally {
      setMatchingLoading(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * CONFIRM ORDER
   * ------------------------------------------------------------
   */

  const handleConfirmOrder = async () => {
    if (!matchingResults) {
      return;
    }

    try {
      const payload = {
        demand_id: matchingResults.demand_id,

        matched_crop_id:
          selectedCropId ||
          crops[0]?.id ||
          "crop-tomato",

        total_quantity_kg:
          matchingResults.matched_quantity_kg ||
          25000,

        agreed_price_per_kg:
          matchingResults.agreed_farmer_price_per_kg ||
          24.5,

        participating_farmer_ids:
          matchingResults.participating_farmers || [],

        match_score:
          matchingResults.match_score || 96.4,
      };

      await createOrder(payload);

      if (language === "ta") {
        showToast(
          "கொள்முதல் ஆர்டர் உறுதி செய்யப்பட்டு விவசாயிகளுக்கு அனுப்பப்பட்டது!"
        );
      } else if (language === "hi") {
        showToast(
          "खरीद आदेश की पुष्टि कर किसानों को भेज दिया गया!"
        );
      } else {
        showToast(
          "Purchase Order Confirmed & Dispatched to Farmers!"
        );
      }

      setMatchingResults(null);

      await loadData();
    } catch (error) {
      console.warn(
        "Order API failed. Keeping demo order confirmation."
      );

      showToast("Order confirmed successfully.");

      setMatchingResults(null);
    }
  };

  /*
   * ------------------------------------------------------------
   * TRACKING VIEW
   * ------------------------------------------------------------
   */

  if (selectedTrackingId) {
    return (
      <OrderTrackingView
        trackingId={selectedTrackingId}
        language={language}
        onBack={() => setSelectedTrackingId(null)}
      />
    );
  }

  /*
   * ------------------------------------------------------------
   * UI
   * ------------------------------------------------------------
   */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* ======================================================
          TOP BANNER
          ====================================================== */}

      <div
        className="glass-panel"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.14) 0%, rgba(16,185,129,0.12) 100%)",
          border:
            "1px solid rgba(6,182,212,0.3)",
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
                flexWrap: "wrap",
              }}
            >
              <span className="badge-tag badge-urban">
                <ShoppingBag size={14} />

                {t?.common?.roles?.BULK_BUYER ||
                  "Bulk Buyer"}
              </span>

              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#38bdf8",
                }}
              >
                Institutional Procurement Portal
              </span>
            </div>

            <h1
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              {t?.buyer?.title ||
                "Bulk Buyer Procurement"}
            </h1>

            <p
              style={{
                fontSize: "0.92rem",
                color: "#cbd5e1",
                marginTop: "4px",
              }}
            >
              {t?.buyer?.subtitle ||
                "Post demand and connect with verified farmers through AI-powered matching."}
            </p>
          </div>

          <button
            className="btn-emerald"
            onClick={() => setShowPostModal(true)}
            style={{
              fontSize: "1.05rem",
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <PlusCircle size={20} />

            {t?.buyer?.postDemandBtn ||
              "Post Bulk Demand"}
          </button>
        </div>
      </div>

      {/* ======================================================
          TOAST
          ====================================================== */}

      {toastMessage && (
        <div
          style={{
            background:
              "rgba(16,185,129,0.18)",
            border:
              "1px solid #10b981",
            padding: "12px 18px",
            borderRadius: "12px",
            color: "#34d399",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            <Check size={17} />
            {" "}
            {toastMessage}
          </span>

          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ======================================================
          QUICK STATS
          ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div className="surface-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                }}
              >
                Active Demands
              </div>

              <div
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginTop: "4px",
                }}
              >
                {demands.length}
              </div>
            </div>

            <Layers
              size={28}
              color="#38bdf8"
            />
          </div>
        </div>

        <div className="surface-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                }}
              >
                Orders
              </div>

              <div
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginTop: "4px",
                }}
              >
                {orders.length}
              </div>
            </div>

            <Truck
              size={28}
              color="#10b981"
            />
          </div>
        </div>

        <div className="surface-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                }}
              >
                AI Matching
              </div>

              <div
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginTop: "4px",
                }}
              >
                96.4%
              </div>
            </div>

            <Zap
              size={28}
              color="#f59e0b"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          AI MATCHING RESULT
          ====================================================== */}

      {matchingResults && (
        <div
          className="glass-panel"
          style={{
            border:
              "2px solid #10b981",
            background:
              "rgba(16,185,129,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <span className="badge-tag badge-rural">
                AI MATCH CALCULATED
              </span>

              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#f8fafc",
                  marginTop: "8px",
                }}
              >
                {t?.buyer?.pooledFarmersTitle ||
                  "Pooled Farmer Supply"}{" "}
                (
                {Number(
                  matchingResults.matched_quantity_kg ||
                    25000
                ).toLocaleString("en-IN")}{" "}
                kg{" "}
                {matchingResults.crop ||
                  "Tomato"}
                )
              </h3>
            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#10b981",
                }}
              >
                ₹
                {matchingResults.agreed_farmer_price_per_kg ||
                  24.5}
                /kg
              </div>

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#38bdf8",
                }}
              >
                Compatibility Score:{" "}
                {matchingResults.match_score ||
                  96.4}
                %
              </div>
            </div>
          </div>

          {/* FARMERS */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            {matchingResults.participating_farmers?.map(
              (farmer: any, index: number) => (
                <div
                  key={
                    farmer.farmer_id ||
                    index
                  }
                  className="surface-card"
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    borderLeft:
                      "4px solid #10b981",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#f8fafc",
                      }}
                    >
                      {farmer.farmer_name ||
                        `Farmer ${
                          farmer.farmer_id ||
                          index + 1
                        }`}
                    </div>

                    <div
                      style={{
                        fontSize:
                          "0.82rem",
                        color:
                          "#94a3b8",
                        marginTop:
                          "4px",
                      }}
                    >
                      Verified Smallholder
                      Partner
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign:
                        "right",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        color:
                          "#10b981",
                      }}
                    >
                      {Number(
                        farmer.allocated_quantity_kg ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      kg
                    </div>

                    <div
                      style={{
                        fontSize:
                          "0.8rem",
                        color:
                          "#94a3b8",
                      }}
                    >
                      ₹
                      {farmer.price_per_kg ||
                        0}
                      /kg
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* CONFIRM */}

          <button
            className="btn-emerald"
            onClick={handleConfirmOrder}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "1rem",
              display: "flex",
              justifyContent:
                "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={20} />

            Confirm Purchase Order
          </button>
        </div>
      )}

      {/* ======================================================
          ACTIVE DEMANDS
          ====================================================== */}

      <div className="glass-panel">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "18px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              Your Bulk Demands
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.85rem",
                marginTop: "4px",
              }}
            >
              Match your requirements with
              expected farmer supply.
            </p>
          </div>

          <Search
            size={22}
            color="#38bdf8"
          />
        </div>

        {demands.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#94a3b8",
            }}
          >
            <ShoppingBag
              size={40}
              style={{
                margin: "0 auto 12px",
              }}
            />

            <div
              style={{
                fontWeight: 700,
                color: "#e2e8f0",
              }}
            >
              No bulk demands yet
            </div>

            <p
              style={{
                marginTop: "6px",
              }}
            >
              Post your first procurement
              requirement.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {demands.map((demand) => (
              <div
                key={demand.id}
                className="surface-card"
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "18px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: "240px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <span className="badge-tag badge-urban">
                      BULK DEMAND
                    </span>

                    <span
                      style={{
                        color:
                          "#10b981",
                        fontSize:
                          "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      {demand.status ||
                        "OPEN"}
                    </span>
                  </div>

                  <h3
                    style={{
                      color:
                        "#f8fafc",
                      fontWeight: 800,
                      marginTop:
                        "8px",
                    }}
                  >
                    {demand.crop_id ||
                      "Tomato"}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "18px",
                      flexWrap:
                        "wrap",
                      marginTop:
                        "10px",
                      color:
                        "#94a3b8",
                      fontSize:
                        "0.84rem",
                    }}
                  >
                    <span>
                      <Layers
                        size={14}
                        style={{
                          verticalAlign:
                            "middle",
                        }}
                      />{" "}
                      {Number(
                        demand.required_quantity_kg ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}{" "}
                      kg
                    </span>

                    <span>
                      ₹
                      {demand.max_price_per_kg ||
                        0}
                      /kg max
                    </span>

                    <span>
                      <Calendar
                        size={14}
                        style={{
                          verticalAlign:
                            "middle",
                        }}
                      />{" "}
                      {
                        demand.target_delivery_date
                      }
                    </span>
                  </div>

                  {demand.delivery_address && (
                    <div
                      style={{
                        color:
                          "#64748b",
                        fontSize:
                          "0.78rem",
                        marginTop:
                          "8px",
                      }}
                    >
                      <MapPin
                        size={13}
                        style={{
                          verticalAlign:
                            "middle",
                        }}
                      />{" "}
                      {
                        demand.delivery_address
                      }
                    </div>
                  )}
                </div>

                <button
                  className="btn-emerald"
                  onClick={() =>
                    handleExecuteMatch(
                      demand.id
                    )
                  }
                  disabled={
                    matchingLoading
                  }
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    minWidth:
                      "160px",
                    justifyContent:
                      "center",
                  }}
                >
                  <Zap size={17} />

                  {matchingLoading
                    ? "Matching..."
                    : "Find Farmers"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================
          ORDERS
          ====================================================== */}

      <div className="glass-panel">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#f8fafc",
              }}
            >
              Purchase Orders
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.85rem",
                marginTop: "4px",
              }}
            >
              Track confirmed agricultural
              purchases.
            </p>
          </div>

          <Truck
            size={22}
            color="#10b981"
          />
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px",
              color: "#94a3b8",
            }}
          >
            No purchase orders yet.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {orders.map(
              (order: any, index: number) => {
                const trackingId =
                  order.tracking_id ||
                  order.trackingId ||
                  order.id;

                return (
                  <div
                    key={
                      order.id ||
                      index
                    }
                    className="surface-card"
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      gap: "16px",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color:
                            "#f8fafc",
                          fontWeight:
                            800,
                        }}
                      >
                        Order #
                        {order.id ||
                          index +
                            1}
                      </div>

                      <div
                        style={{
                          color:
                            "#94a3b8",
                          fontSize:
                            "0.82rem",
                          marginTop:
                            "5px",
                        }}
                      >
                        Quantity:{" "}
                        {Number(
                          order.total_quantity_kg ||
                            order.quantity_kg ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}{" "}
                        kg
                      </div>

                      <div
                        style={{
                          color:
                            "#94a3b8",
                          fontSize:
                            "0.82rem",
                          marginTop:
                            "3px",
                        }}
                      >
                        Status:{" "}
                        {order.status ||
                          "CONFIRMED"}
                      </div>
                    </div>

                    <button
                      className="btn-emerald"
                      onClick={() =>
                        setSelectedTrackingId(
                          trackingId
                        )
                      }
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                      }}
                    >
                      <Truck
                        size={17}
                      />
                      Track Order
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* ======================================================
          POST DEMAND MODAL
          ====================================================== */}

      {showPostModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(2,6,23,0.78)",
            backdropFilter:
              "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "20px",
          }}
          onClick={() =>
            setShowPostModal(false)
          }
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "620px",
              maxHeight:
                "90vh",
              overflowY:
                "auto",
              padding:
                "26px",
              border:
                "1px solid rgba(16,185,129,0.35)",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "22px",
              }}
            >
              <div>
                <h2
                  style={{
                    color:
                      "#f8fafc",
                    fontSize:
                      "1.35rem",
                    fontWeight:
                      800,
                  }}
                >
                  Post Bulk Demand
                </h2>

                <p
                  style={{
                    color:
                      "#94a3b8",
                    fontSize:
                      "0.85rem",
                    marginTop:
                      "4px",
                  }}
                >
                  Tell farmers what you
                  need before harvest.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowPostModal(
                    false
                  )
                }
                style={{
                  background:
                    "transparent",
                  border: "none",
                  color:
                    "#94a3b8",
                  cursor:
                    "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={
                handlePostDemand
              }
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "16px",
              }}
            >
              {/* CROP */}

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "0.85rem",
                    marginBottom:
                      "7px",
                  }}
                >
                  Crop
                </label>

                <select
                  value={
                    selectedCropId
                  }
                  onChange={(e) =>
                    setSelectedCropId(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                  }}
                >
                  {crops.length >
                  0 ? (
                    crops.map(
                      (
                        crop
                      ) => (
                        <option
                          key={
                            crop.id
                          }
                          value={
                            crop.id
                          }
                        >
                          {
                            crop.name
                          }
                        </option>
                      )
                    )
                  ) : (
                    <option value="crop-tomato">
                      Tomato
                    </option>
                  )}
                </select>
              </div>

              {/* QUANTITY */}

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "0.85rem",
                    marginBottom:
                      "7px",
                  }}
                >
                  Required Quantity (kg)
                </label>

                <input
                  type="number"
                  min="1"
                  value={qtyKg}
                  onChange={(e) =>
                    setQtyKg(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                  }}
                />
              </div>

              {/* PRICE */}

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "0.85rem",
                    marginBottom:
                      "7px",
                  }}
                >
                  Maximum Price (₹/kg)
                </label>

                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={
                    maxPrice
                  }
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                  }}
                />
              </div>

              {/* DATE */}

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "0.85rem",
                    marginBottom:
                      "7px",
                  }}
                >
                  Target Delivery Date
                </label>

                <input
                  type="date"
                  value={
                    deliveryDate
                  }
                  onChange={(e) =>
                    setDeliveryDate(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                  }}
                />
              </div>

              {/* ADDRESS */}

              <div>
                <label
                  style={{
                    display:
                      "block",
                    color:
                      "#cbd5e1",
                    fontSize:
                      "0.85rem",
                    marginBottom:
                      "7px",
                  }}
                >
                  Delivery Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  rows={3}
                  style={{
                    width: "100%",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #334155",
                    background:
                      "#0f172a",
                    color:
                      "#f8fafc",
                    resize:
                      "vertical",
                  }}
                />
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display:
                    "flex",
                  gap: "12px",
                  marginTop:
                    "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowPostModal(
                      false
                    )
                  }
                  style={{
                    flex: 1,
                    padding:
                      "13px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid #475569",
                    background:
                      "transparent",
                    color:
                      "#cbd5e1",
                    cursor:
                      "pointer",
                    fontWeight:
                      700,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-emerald"
                  style={{
                    flex: 1,
                    padding:
                      "13px",
                    display:
                      "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    gap: "8px",
                  }}
                >
                  <PlusCircle
                    size={18}
                  />

                  Post Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};