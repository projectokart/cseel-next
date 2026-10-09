import fs from 'fs';
import path from 'path';
import { MaintenanceConfig, MaintenanceStatus } from './types';

const DATA_DIR = path.join(process.cwd(), 'src', 'features', 'maintenance', 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'maintenance_config.json');

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enabled: true,
  startDate: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day default
  durationLabel: '1 Day',
  title: 'CSEEL Platform Under Active Upgrade & Construction',
  message: 'Our engineering and pedagogical directorate is currently upgrading the experiential learning laboratories and NEP 2020 digital modules. The system will resume full operations shortly.',
  allowedPaths: ['/admin', '/faculty-admin', '/under-construction', '/api', '/auth'],
  bypassSecret: 'cseel_admin_bypass_2026',
  contactPhone: '+91 90507 78830',
  contactPerson: 'Dev Sharma',
  updatedAt: new Date().toISOString(),
  updatedBy: 'Dev Sharma (Super Admin)',
};

export function loadMaintenanceConfig(): MaintenanceConfig {
  if ((globalThis as any).__maintenanceConfig) {
    return (globalThis as any).__maintenanceConfig;
  }

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const conf = { ...DEFAULT_MAINTENANCE_CONFIG, ...parsed };
        (globalThis as any).__maintenanceConfig = conf;
        return conf;
      }
    }
  } catch (err) {
    // Vercel serverless or filesystem sandbox
    console.warn('[MaintenanceService] File read skipped or sandbox:', err);
  }

  const fallback = { ...DEFAULT_MAINTENANCE_CONFIG };
  (globalThis as any).__maintenanceConfig = fallback;
  return fallback;
}

export function saveMaintenanceConfig(nextConfig: Partial<MaintenanceConfig>): MaintenanceConfig {
  const current = loadMaintenanceConfig();
  const merged: MaintenanceConfig = {
    ...current,
    ...nextConfig,
    updatedAt: new Date().toISOString(),
  };

  (globalThis as any).__maintenanceConfig = merged;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (err) {
    // Graceful on Vercel read-only filesystem
    console.warn('[MaintenanceService] File write skipped in serverless environment:', err);
  }

  return merged;
}

export function getMaintenanceStatus(): MaintenanceStatus {
  const config = loadMaintenanceConfig();

  let isExpired = false;
  let remainingSeconds = 0;

  if (config.expiresAt) {
    const expireTime = new Date(config.expiresAt).getTime();
    const now = Date.now();
    if (!isNaN(expireTime)) {
      if (expireTime <= now) {
        isExpired = true;
        remainingSeconds = 0;
      } else {
        remainingSeconds = Math.max(0, Math.floor((expireTime - now) / 1000));
      }
    }
  } else {
    remainingSeconds = Infinity;
  }

  const isActive = Boolean(config.enabled && !isExpired);

  let formattedExpiresAt: string | null = null;
  if (config.expiresAt) {
    try {
      const d = new Date(config.expiresAt);
      formattedExpiresAt = d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) + ' IST';
    } catch {
      formattedExpiresAt = config.expiresAt;
    }
  }

  return {
    ...config,
    isActive,
    remainingSeconds: isFinite(remainingSeconds) ? remainingSeconds : -1,
    formattedExpiresAt,
  };
}
