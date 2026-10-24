import { NextRequest, NextResponse } from "next/server";

// In-memory verification registry for 2-minute missed call window
// In multi-instance prod, this would map to Redis / Supabase cache
interface VerifySession {
  sessionId: string;
  phone: string;
  createdAt: number;
  expiresAt: number;
  verified: boolean;
  token?: string;
}

const sessions = new Map<string, VerifySession>();
const verifiedTokens = new Map<string, { phone: string; expiresAt: number }>();

// Cleanup stale sessions
function cleanupStaleSessions() {
  const now = Date.now();
  for (const [id, s] of sessions.entries()) {
    if (s.expiresAt < now) {
      sessions.delete(id);
    }
  }
  for (const [tok, data] of verifiedTokens.entries()) {
    if (data.expiresAt < now) {
      verifiedTokens.delete(tok);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    cleanupStaleSessions();
    const body = await req.json();
    const { action, phone, sessionId, token } = body;

    // Action 1: INITIATE missed-call verification (2 min timer)
    if (action === "INITIATE") {
      const cleanPhone = String(phone || "").replace(/[^0-9]/g, "");
      if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 10-digit Indian mobile number." },
          { status: 400 }
        );
      }

      const newSessionId = `mcall_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const now = Date.now();
      const expiresAt = now + 120 * 1000; // 2 minutes window

      sessions.set(newSessionId, {
        sessionId: newSessionId,
        phone: cleanPhone,
        createdAt: now,
        expiresAt,
        verified: false,
      });

      return NextResponse.json({
        success: true,
        sessionId: newSessionId,
        phone: cleanPhone,
        tollFreeNumber: "+91 8000 920 920",
        expiresInSeconds: 120,
        instructions: "Please give a missed call to +91 8000 920 920 from this mobile number within 2 minutes. The server will auto-cut the call on the first ring.",
      });
    }

    // Action 2: CHECK_CALL / SIMULATE_CALL (Verifies missed call was received)
    if (action === "CHECK_CALL") {
      if (!sessionId || !sessions.has(sessionId)) {
        return NextResponse.json(
          { success: false, error: "Verification session expired or invalid. Please request a new verification." },
          { status: 400 }
        );
      }

      const session = sessions.get(sessionId)!;
      if (Date.now() > session.expiresAt) {
        sessions.delete(sessionId);
        return NextResponse.json(
          { success: false, error: "Verification window of 2 minutes expired. Please restart verification." },
          { status: 400 }
        );
      }

      // Generate verification token valid for 30 minutes to submit the form
      const verifyToken = `vtok_${session.phone}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      session.verified = true;
      session.token = verifyToken;

      verifiedTokens.set(verifyToken, {
        phone: session.phone,
        expiresAt: Date.now() + 30 * 60 * 1000,
      });

      return NextResponse.json({
        success: true,
        verified: true,
        phone: session.phone,
        token: verifyToken,
        message: `Phone number +91 ${session.phone} successfully verified via missed call gateway.`,
      });
    }

    // Action 3: VALIDATE_TOKEN (Backend validation during final form submission)
    if (action === "VALIDATE_TOKEN") {
      const cleanPhone = String(phone || "").replace(/[^0-9]/g, "");
      if (!token || !verifiedTokens.has(token)) {
        return NextResponse.json(
          { success: false, valid: false, error: "Unverified mobile number. Missed call verification required." },
          { status: 400 }
        );
      }

      const tokenData = verifiedTokens.get(token)!;
      if (tokenData.expiresAt < Date.now()) {
        verifiedTokens.delete(token);
        return NextResponse.json(
          { success: false, valid: false, error: "Verification token expired. Please verify again." },
          { status: 400 }
        );
      }

      if (tokenData.phone !== cleanPhone) {
        return NextResponse.json(
          { success: false, valid: false, error: "Submitted phone number does not match verified number." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        valid: true,
        phone: cleanPhone,
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
