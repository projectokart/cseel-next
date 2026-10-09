import { NextRequest, NextResponse } from 'next/server';
import { getMaintenanceStatus, saveMaintenanceConfig } from '@/features/maintenance/maintenanceService';
import { MaintenanceConfig } from '@/features/maintenance/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = getMaintenanceStatus();
    return NextResponse.json({
      success: true,
      data: status,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to fetch maintenance status',
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const {
      enabled,
      durationPreset, // '1h' | '6h' | '12h' | '1d' | '2d' | '7d' | 'custom' | 'indefinite'
      customExpiresAt,
      title,
      message,
      contactPhone,
      contactPerson,
      updatedBy,
    } = body;

    const updates: Partial<MaintenanceConfig> = {};

    if (typeof enabled === 'boolean') {
      updates.enabled = enabled;
      if (enabled) {
        updates.startDate = new Date().toISOString();
      }
    }

    if (durationPreset) {
      const now = Date.now();
      let expiresAt: string | null = null;
      let label = 'Custom';

      switch (durationPreset) {
        case '1h':
          expiresAt = new Date(now + 1 * 60 * 60 * 1000).toISOString();
          label = '1 Hour';
          break;
        case '6h':
          expiresAt = new Date(now + 6 * 60 * 60 * 1000).toISOString();
          label = '6 Hours';
          break;
        case '12h':
          expiresAt = new Date(now + 12 * 60 * 60 * 1000).toISOString();
          label = '12 Hours';
          break;
        case '1d':
          expiresAt = new Date(now + 24 * 60 * 60 * 1000).toISOString();
          label = '1 Day';
          break;
        case '2d':
          expiresAt = new Date(now + 48 * 60 * 60 * 1000).toISOString();
          label = '2 Days';
          break;
        case '7d':
          expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
          label = '7 Days';
          break;
        case 'indefinite':
          expiresAt = null;
          label = 'Until Disabled';
          break;
        case 'custom':
          if (customExpiresAt) {
            const parsed = new Date(customExpiresAt);
            if (!isNaN(parsed.getTime())) {
              expiresAt = parsed.toISOString();
              label = 'Custom Date';
            }
          }
          break;
      }

      if (expiresAt !== undefined) {
        updates.expiresAt = expiresAt;
        updates.durationLabel = label;
      }
    } else if (customExpiresAt) {
      const parsed = new Date(customExpiresAt);
      if (!isNaN(parsed.getTime())) {
        updates.expiresAt = parsed.toISOString();
        updates.durationLabel = 'Custom Date';
      }
    }

    if (typeof title === 'string') updates.title = title;
    if (typeof message === 'string') updates.message = message;
    if (typeof contactPhone === 'string') updates.contactPhone = contactPhone;
    if (typeof contactPerson === 'string') updates.contactPerson = contactPerson;
    if (typeof updatedBy === 'string') updates.updatedBy = updatedBy;

    saveMaintenanceConfig(updates);
    const updatedStatus = getMaintenanceStatus();

    const response = NextResponse.json({
      success: true,
      message: 'Maintenance settings updated successfully',
      data: updatedStatus,
    });

    response.cookies.set('cseel_maintenance_active', updatedStatus.isActive ? '1' : '0', {
      path: '/',
      maxAge: 30 * 24 * 3600,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to update maintenance settings',
    }, { status: 500 });
  }
}
