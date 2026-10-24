import { NextRequest, NextResponse } from "next/server";

const MAX_BYTES = 10 * 1024; // Strictly 10KB = 10,240 bytes

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { dataUrl } = body;

      if (!dataUrl || typeof dataUrl !== "string") {
        return NextResponse.json(
          { success: false, error: "Image data URL is required." },
          { status: 400 }
        );
      }

      // Format check: data:image/(webp|avif|jpeg|png);base64,...
      const match = dataUrl.match(/^data:(image\/(webp|avif|jpeg|png|jpg));base64,(.+)$/i);
      if (!match) {
        return NextResponse.json(
          { success: false, error: "Invalid image format. Only WebP, AVIF, JPEG, or PNG are accepted." },
          { status: 400 }
        );
      }

      const mimeType = match[1].toLowerCase();
      const base64Data = match[3];

      // Calculate binary buffer size
      const buffer = Buffer.from(base64Data, "base64");
      const byteSize = buffer.length;

      if (byteSize > MAX_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `Payload exceeds strict 10KB server limit. Size: ${(byteSize / 1024).toFixed(2)} KB (Max: 10 KB).`,
            byteSize,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        url: dataUrl,
        sizeBytes: byteSize,
        sizeKb: (byteSize / 1024).toFixed(2),
        mimeType,
        message: "Avatar verified and uploaded successfully within 10KB limit.",
      });
    }

    return NextResponse.json(
      { success: false, error: "Content-Type must be application/json with dataUrl" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
