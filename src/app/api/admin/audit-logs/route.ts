import { NextRequest, NextResponse } from 'next/server';

export interface DailyAuditLogRecord {
  id: string;
  timestamp: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  adminName: string;
  adminEmail: string;
  adminRole: string;
  department: string;
  action: string;
  actionCategory: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'AUTH' | 'SETTINGS';
  targetEntity?: string;
  details: string;
  ipAddress?: string;
}

// In-memory + persistent fallback log storage
let MEMORY_LOGS: DailyAuditLogRecord[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString('en-IN', { hour12: false }),
    adminName: 'Materials & Store Lead',
    adminEmail: 'material@123',
    adminRole: 'inventory_admin',
    department: 'Lab Materials & Supply Chain',
    action: 'UPDATED_MATERIAL',
    actionCategory: 'UPDATE',
    targetEntity: 'Digital Storage Oscilloscope 100MHz (SKU: CSE-7712)',
    details: 'Adjusted lab equipment stock from 12 to 24 units; updated wholesale price to Rs. 14,500.',
    ipAddress: '103.21.14.82',
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString('en-IN', { hour12: false }),
    adminName: 'HR & Talent Acquisition Lead',
    adminEmail: 'hr@123',
    adminRole: 'hr_admin',
    department: 'HR & Careers Recruitment',
    action: 'POSTED_JOB_OPENING',
    actionCategory: 'CREATE',
    targetEntity: 'Senior STEM Robotics Curriculum Architect',
    details: 'Created full-time vacancy with salary 8.5 - 12.0 LPA across Delhi/NCR & Bangalore.',
    ipAddress: '49.36.128.4',
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() - 60 * 60 * 1000).toLocaleTimeString('en-IN', { hour12: false }),
    adminName: 'Institutional Relations Lead',
    adminEmail: 'school@123',
    adminRole: 'school_admin',
    department: 'School & Institutional Network',
    action: 'VERIFIED_PARTNER_SCHOOL',
    actionCategory: 'UPDATE',
    targetEntity: 'Delhi Public School, R.K. Puram (Code: SCH-1049)',
    details: 'Completed ATL laboratory safety compliance verification and upgraded to Tier 1 Lead Partner.',
    ipAddress: '182.74.19.11',
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() - 120 * 60 * 1000).toLocaleTimeString('en-IN', { hour12: false }),
    adminName: 'Master Super Administrator',
    adminEmail: 'super@123',
    adminRole: 'super_admin',
    department: 'Central Executive Governance',
    action: 'SECURITY_AUDIT_EXPORT',
    actionCategory: 'EXPORT',
    targetEntity: 'Central Master Audit Ledger',
    details: 'Exported daily departmental work report and security credentials ledger.',
    ipAddress: '122.161.80.3',
  },
  {
    id: 'log-105',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    date: new Date().toISOString().split('T')[0],
    time: new Date(Date.now() - 240 * 60 * 1000).toLocaleTimeString('en-IN', { hour12: false }),
    adminName: 'Teacher Training Coordinator',
    adminEmail: 'training@123',
    adminRole: 'programs_admin',
    department: 'Teacher Training & NEP Pedagogy',
    action: 'ENROLLED_FACULTY_BATCH',
    actionCategory: 'CREATE',
    targetEntity: 'NEP 2020 Hands-On Science Masterclass (Batch #48)',
    details: 'Approved 42 CBSE/ICSE science educators for the ATL tinkering certification workshop.',
    ipAddress: '157.34.201.8',
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date'); // YYYY-MM-DD
    const departmentParam = searchParams.get('department');
    const roleParam = searchParams.get('role');
    const categoryParam = searchParams.get('category');
    const format = searchParams.get('format') || 'json';

    let filtered = [...MEMORY_LOGS];

    if (dateParam && dateParam !== 'all') {
      filtered = filtered.filter((l) => l.date === dateParam);
    }

    if (departmentParam && departmentParam !== 'all') {
      filtered = filtered.filter((l) => l.department.toLowerCase().includes(departmentParam.toLowerCase()));
    }

    if (roleParam && roleParam !== 'all') {
      filtered = filtered.filter((l) => l.adminRole === roleParam);
    }

    if (categoryParam && categoryParam !== 'all') {
      filtered = filtered.filter((l) => l.actionCategory === categoryParam);
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // If requested as raw text log format
    if (format === 'text') {
      const header = `========================================================================================\n` +
        `CSEEL MASTER ADMINISTRATIVE WORK HISTORY & AUDIT LOG\n` +
        `Generated At: ${new Date().toLocaleString('en-IN')}\n` +
        `Date Filter: ${dateParam || 'All Dates'} | Total Actions Logged: ${filtered.length}\n` +
        `========================================================================================\n\n`;

      const lines = filtered.map((l, idx) => {
        return `[${idx + 1}] [${l.date} ${l.time}] [${l.adminRole.toUpperCase()}] [${l.actionCategory}]\n` +
          `  Admin: ${l.adminName} (${l.adminEmail})\n` +
          `  Department: ${l.department}\n` +
          `  Action: ${l.action}\n` +
          `  Target: ${l.targetEntity || 'N/A'}\n` +
          `  Details: ${l.details}\n` +
          `  IP Address: ${l.ipAddress || '127.0.0.1'}\n` +
          `----------------------------------------------------------------------------------------`;
      }).join('\n\n');

      return new NextResponse(header + lines, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="CSEEL_Daily_Work_History_${dateParam || 'All'}.txt"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      logs: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date();
    
    const newRecord: DailyAuditLogRecord = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-IN', { hour12: false }),
      adminName: body.adminName || 'System Administrator',
      adminEmail: body.adminEmail || 'admin@123',
      adminRole: body.adminRole || 'super_admin',
      department: body.department || 'General Administration',
      action: body.action || 'GENERAL_ACTION',
      actionCategory: body.actionCategory || 'UPDATE',
      targetEntity: body.targetEntity || '',
      details: body.details || 'No additional details specified.',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    };

    MEMORY_LOGS.unshift(newRecord);

    // Keep maximum 2000 in-memory records
    if (MEMORY_LOGS.length > 2000) {
      MEMORY_LOGS = MEMORY_LOGS.slice(0, 2000);
    }

    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
