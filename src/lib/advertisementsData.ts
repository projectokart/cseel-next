export interface AdvertisementBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  badgeColor?: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  discountCode?: string;
  discountPercent?: number;
  validUntil: string;
  category: "lab-kits" | "institutional" | "events" | "workshops" | "general";
}

export const ALL_ADVERTISEMENTS: AdvertisementBanner[] = [];
