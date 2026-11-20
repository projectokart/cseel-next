import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB Strict Limit
const DRIVE_FOLDER_ID = '1lYUEpLdCEQUClCLVyijly4vDnuA7oCU8';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name')?.toString().trim();
    const address = formData.get('address')?.toString().trim();
    const subject = formData.get('subject')?.toString().trim();
    const jobTitle = formData.get('jobTitle')?.toString().trim() || 'Direct';
    const jobId = formData.get('jobId')?.toString().trim() || 'direct';
    const schoolName = formData.get('schoolName')?.toString().trim() || 'CSEEL';
    const file = formData.get('resume') as File | null;

    if (!name || !address || !subject) {
      return NextResponse.json(
        { error: 'Name, address, and subject are required fields.' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: 'Resume file is required.' },
        { status: 400 }
      );
    }

    // Strict Size Limit: 5 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the strict 5 MB limit. Please compress your PDF or Word document before uploading.` 
        },
        { status: 400 }
      );
    }

    // Format extension and filename
    const originalName = file.name || 'resume.pdf';
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'pdf';

    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const safeSubject = subject.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const generatedFileName = `${safeName}_${safeSubject}_${timestamp}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    // 1. Forward to Google Apps Script Webhook (Google Drive + Google Sheet)
    let driveFileUrl = '';
    const webhookUrl = process.env.GOOGLE_RESUME_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folderId: DRIVE_FOLDER_ID,
            name,
            address,
            subject,
            jobTitle,
            jobId,
            schoolName,
            fileName: generatedFileName,
            mimeType: file.type || 'application/pdf',
            fileBase64: base64Data,
          }),
        });

        if (webhookResponse.ok) {
          const webhookResult = await webhookResponse.json();
          if (webhookResult && webhookResult.fileUrl) {
            driveFileUrl = webhookResult.fileUrl;
          }
        }
      } catch (webhookErr) {
        console.error('[upload-resume] Webhook forward error:', webhookErr);
      }
    }

    // 2. Local Fallback & Permanent Storage (Ensure zero lost data)
    try {
      const storageDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      const localFilePath = path.join(storageDir, generatedFileName);
      fs.writeFileSync(localFilePath, buffer);

      const applicationsLogPath = path.join(process.cwd(), 'src', 'data', 'job_applications.json');
      let applications: any[] = [];
      if (fs.existsSync(applicationsLogPath)) {
        try {
          applications = JSON.parse(fs.readFileSync(applicationsLogPath, 'utf8'));
        } catch {}
      }

      applications.unshift({
        id: `app_${Date.now()}`,
        name,
        address,
        subject,
        jobTitle,
        jobId,
        schoolName,
        fileName: generatedFileName,
        fileUrl: driveFileUrl || `/uploads/resumes/${generatedFileName}`,
        driveFileUrl,
        sizeBytes: file.size,
        submittedAt: new Date().toISOString(),
      });

      fs.writeFileSync(applicationsLogPath, JSON.stringify(applications, null, 2), 'utf8');
    } catch (localErr) {
      console.error('[upload-resume] Local log save error:', localErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Resume received and stored successfully.',
      fileName: generatedFileName,
      driveFileUrl: driveFileUrl || null,
    });
  } catch (err: any) {
    console.error('[upload-resume] Server error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while uploading resume.' },
      { status: 500 }
    );
  }
}
