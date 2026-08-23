'use client';

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { useHomepageCms } from "@/features/homepage-cms/hooks/useHomepageCms";

interface PromoItem {
  id: string;
  title: string;
  content: string;
  cta_text: string | null;
  cta_link: string | null;
  bg_color: string;
  accent_color: string;
}

const AnnouncementBar = () => {
  const { isSectionEnabled } = useHomepageCms();
  const [item, setItem] = useState<PromoItem | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const dismissed = sessionStorage.getItem("announcement-dismissed");
        if (dismissed) return;
      }
    } catch {}

    const load = async () => {
      try {
        const { data } = await (supabase as any)
          .from("promotions")
          .select("id,title,content,cta_text,cta_link,bg_color,accent_color")
          .eq("type", "announcement")
          .eq("is_active", true)
          .order("sort_order")
          .limit(1)
          .single();
        if (data) setItem(data as PromoItem);
      } catch {}
    };
    load();
  }, []);

  if (!isSectionEnabled('announcement_bar') || !item) return null;

  const dismiss = () => {
    setItem(null);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("announcement-dismissed", "true");
      }
    } catch {}
  };

  return (
    <div style={{
      background: item.bg_color || "#0a5c8a",
      color: item.accent_color || "#ffffff",
      padding: "10px 48px 10px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontSize: 14,
      fontWeight: 500,
      position: "relative",
      zIndex: 300,
    }}>
      <span dangerouslySetInnerHTML={{ __html: item.content }} />
      {item.cta_text && item.cta_link && (
        <a
          href={item.cta_link}
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "inherit",
            padding: "2px 10px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {item.cta_text} &rarr;
        </a>
      )}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
          opacity: 0.7,
          padding: 4,
          display: "flex",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBar;