'use client';

import { useState, useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface PromoItem {
  id: string;
  title: string;
  content: string;
  cta_text: string | null;
  cta_link: string | null;
  accent_color: string;
}

const STORAGE_KEY = "offer-popup-closed";

const OfferPopup = () => {
  const [item, setItem] = useState<PromoItem | null>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    try {
      if (typeof window !== 'undefined') {
        const closed = localStorage.getItem(STORAGE_KEY);
        if (closed) {
          const hoursAgo = (Date.now() - Number(closed)) / 3600000;
          if (hoursAgo < 24) return;
        }
      }
    } catch {}

    const load = async () => {
      try {
        const { data } = await (supabase as any)
          .from("promotions")
          .select("id,title,content,cta_text,cta_link,accent_color")
          .eq("type", "popup")
          .eq("is_active", true)
          .order("sort_order")
          .limit(1)
          .single();
        if (data) setTimeout(() => setItem(data as PromoItem), 2000);
      } catch {}
    };
    load();
  }, []);

  const close = () => {
    setItem(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    } catch {}
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 9998,
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />

          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              pointerEvents: "none",
            }}
          >
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              style={{
                pointerEvents: "auto",
                width: "min(480px, 100%)",
                background: "#ffffff",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
                position: "relative",
              }}
            >
              {/* Top Accent Strip */}
              <div style={{
                height: 6,
                background: item.accent_color || "#0a5c8a",
              }} />

              {/* Close Button */}
              <button
                onClick={close}
                aria-label="Close offer"
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#6b7280",
                  zIndex: 10,
                }}
              >
                <X size={16} />
              </button>

              {/* Content */}
              <div style={{ padding: "28px 28px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${item.accent_color || "#0a5c8a"}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Sparkles size={18} color={item.accent_color || "#0a5c8a"} />
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.3,
                  }}>
                    {item.title}
                  </h3>
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: "#4b5563",
                    lineHeight: 1.6,
                    marginBottom: 20,
                  }}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />

                {item.cta_text && item.cta_link && (
                  <a
                    href={item.cta_link}
                    onClick={close}
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: item.accent_color || "#0a5c8a",
                      color: "#ffffff",
                      padding: "12px 24px",
                      borderRadius: 12,
                      fontWeight: 600,
                      fontSize: 15,
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {item.cta_text} &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OfferPopup;