export interface MaintenanceConfig {
  enabled: boolean;
  startDate: string | null;       // ISO string when maintenance started
  expiresAt: string | null;       // ISO string when maintenance ends, or null if indefinite
  durationLabel: string;          // e.g. "1 Hour", "1 Day", "2 Days", "Custom"
  title: string;
  message: string;
  allowedPaths: string[];         // paths allowed during maintenance, e.g. ['/admin', '/under-construction', '/api']
  bypassSecret: string;
  contactPhone: string;
  contactPerson: string;
  updatedAt: string;
  updatedBy: string;
}

export interface MaintenanceStatus extends MaintenanceConfig {
  isActive: boolean;
  remainingSeconds: number;
  formattedExpiresAt: string | null;
}
