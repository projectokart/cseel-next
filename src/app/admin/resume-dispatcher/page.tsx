'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Mail, Send, Play, Pause, Upload, FileText, CheckCircle2,
  XCircle, AlertCircle, RefreshCw, Download, Search, ShieldCheck,
  Eye, Code, Smartphone, Monitor, Database, Terminal, Check, Info, Sparkles
} from 'lucide-react';

interface Recipient {
  id: string;
  email: string;
  name?: string;
  school?: string;
  city?: string;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  error?: string;
  messageId?: string;
  timestamp?: string;
}

const DEFAULT_RESUME_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f9; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #003c6e 0%, #005689 100%); color: #ffffff; padding: 32px 28px; }
    .header h1 { margin: 0 0 6px 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
    .header .subtitle { font-size: 15px; color: #bae6fd; font-weight: 500; margin: 0 0 12px 0; }
    .header .contact-bar { font-size: 13px; color: #e0f2fe; display: flex; flex-wrap: wrap; gap: 14px; }
    .content { padding: 28px; }
    .salutation { font-size: 15px; line-height: 1.6; margin-bottom: 20px; color: #334155; }
    .section-title { font-size: 16px; font-weight: 700; color: #003c6e; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 24px 0 14px 0; }
    .summary-box { background: #f0f7fc; border-left: 4px solid #005689; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; color: #1e293b; }
    .item { margin-bottom: 16px; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; }
    .item-title { font-weight: 600; font-size: 15px; color: #0f172a; }
    .item-sub { font-size: 13px; color: #64748b; font-weight: 500; }
    .item-desc { font-size: 13.5px; color: #475569; line-height: 1.5; margin-top: 4px; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .skill-tag { background: #e2e8f0; color: #1e293b; font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 9999px; }
    .cta-card { background: #003c6e; color: #ffffff; text-align: center; padding: 20px; border-radius: 8px; margin: 28px 0 10px 0; }
    .cta-btn { display: inline-block; background: #38bdf8; color: #003c6e; font-weight: 700; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-size: 14px; margin-top: 10px; }
    .footer { text-align: center; font-size: 12px; color: #94a3b8; padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Devender Kaushik</h1>
      <div class="subtitle">STEM Educator • Virtual Labs Curriculum Specialist • Academic Coordinator</div>
      <div class="contact-bar">
        <span>📍 Haryana / Delhi NCR, India</span>
        <span>✉️ resumes@mailer.cseel.org</span>
        <span>🌐 cseel.org</span>
      </div>
    </div>
    
    <div class="content">
      <div class="salutation">
        Respected Principal / Hiring Coordinator{{#if school}} at <strong>{{school}}</strong>{{/if}},<br><br>
        I am writing to express my keen interest in joining your prestigious institution as a Science Educator / STEM Curriculum Lead. With comprehensive experiential learning pedagogical expertise and practical lab integration experience, I am eager to contribute to your students' academic excellence.
      </div>

      <div class="section-title">Professional Summary</div>
      <div class="summary-box">
        Dedicated educator and STEM curriculum developer with expertise in NEP 2020 experiential learning frameworks, virtual laboratory simulations (Physics, Chemistry & Robotics), and high-engagement classroom instruction. Proven track record in mentoring students for state/national STEM competitions and modernizing school science infrastructure.
      </div>

      <div class="section-title">Core Competencies</div>
      <div class="skills-grid">
        <span class="skill-tag">Experiential STEM Pedagogy</span>
        <span class="skill-tag">Virtual Labs & Simulations</span>
        <span class="skill-tag">NEP 2020 Curriculum Mapping</span>
        <span class="skill-tag">CBSE / ICSE Practical Standards</span>
        <span class="skill-tag">Robotics & Tinkering Labs</span>
        <span class="skill-tag">Teacher Training & Mentorship</span>
      </div>

      <div class="section-title">Key Experience</div>
      <div class="item">
        <div class="item-header">
          <span class="item-title">Lead Science Educator & Curriculum Coordinator</span>
          <span class="item-sub">Centre for Science, Engineering & Experiential Learning (CSEEL)</span>
        </div>
        <div class="item-desc">
          • Developed interactive multi-disciplinary lab practicals covering Class 6–12 CBSE/ICSE curriculum.<br>
          • Spearheaded digital science adoption across partner schools, enhancing practical learning comprehension by over 40%.<br>
          • Designed student hands-on kits and assisted teachers in integrating active inquiry-based science pedagogy.
        </div>
      </div>

      <div class="cta-card">
        <div style="font-size: 15px; font-weight: 600;">Looking forward to connecting with your academic leadership.</div>
        <a href="mailto:ptdevkaushik104@gmail.com?subject=Interview%20Invitation%20-%20Devender%20Kaushik" class="cta-btn">Reply to ptdevkaushik104@gmail.com</a>
      </div>
    </div>

    <div class="footer">
      This professional communication is sent via CSEEL Faculty Network (resumes@mailer.cseel.org).<br>
      To opt out of future academic communications, <a href="mailto:ptdevkaushik104@gmail.com?subject=Unsubscribe" style="color: #64748b; text-decoration: underline;">click here to unsubscribe</a>.
    </div>
  </div>
</body>
</html>`;

export default function ResumeDispatcherPage() {
  const [activeTab, setActiveTab] = useState<'recipients' | 'template' | 'dispatch'>('recipients');
  const [smtpStatus, setSmtpStatus] = useState<{ ready: boolean; message: string; host?: string; from?: string; replyTo?: string } | null>(null);
  const [checkingSmtp, setCheckingSmtp] = useState(true);

  // Recipients State
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [pasteInput, setPasteInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Template State
  const [subject, setSubject] = useState('Application for Faculty / STEM Educator - Devender Kaushik');
  const [fromName, setFromName] = useState('Devender Kaushik | CSEEL Faculty Network');
  const [replyTo, setReplyTo] = useState('ptdevkaushik104@gmail.com');
  const [htmlContent, setHtmlContent] = useState(DEFAULT_RESUME_HTML);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');

  // Dispatch Settings & State
  const [delayMs, setDelayMs] = useState(1200); // 1.2s delay to keep healthy sending rate
  const [batchSize, setBatchSize] = useState(5);
  const [isDispatching, setIsDispatching] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logs, setLogs] = useState<Array<{ timestamp: string; type: 'success' | 'error' | 'info'; text: string }>>([]);

  const dispatchCancelRef = useRef(false);
  const dispatchPauseRef = useRef(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Persistence State
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load state from Disk & LocalStorage on initial mount
  const loadPersistedState = async () => {
    try {
      const res = await fetch('/api/mailer/state');
      const data = await res.json();
      if (data.exists && data.state) {
        const s = data.state;
        if (Array.isArray(s.recipients) && s.recipients.length > 0) setRecipients(s.recipients);
        if (s.subject) setSubject(s.subject);
        if (s.fromName) setFromName(s.fromName);
        if (s.replyTo) setReplyTo(s.replyTo);
        if (s.htmlContent) setHtmlContent(s.htmlContent);
        if (s.delayMs) setDelayMs(s.delayMs);
        if (typeof s.currentIndex === 'number') setCurrentIndex(s.currentIndex);
        if (Array.isArray(s.logs)) setLogs(s.logs);
        setLastSaved(new Date().toLocaleTimeString());
        return;
      }
    } catch (err) {
      console.error('Failed to load disk state, trying localStorage:', err);
    }

    try {
      const local = localStorage.getItem('cseel_resume_campaign_state');
      if (local) {
        const s = JSON.parse(local);
        if (Array.isArray(s.recipients) && s.recipients.length > 0) setRecipients(s.recipients);
        if (s.subject) setSubject(s.subject);
        if (s.fromName) setFromName(s.fromName);
        if (s.replyTo) setReplyTo(s.replyTo);
        if (s.htmlContent) setHtmlContent(s.htmlContent);
        if (s.delayMs) setDelayMs(s.delayMs);
        if (typeof s.currentIndex === 'number') setCurrentIndex(s.currentIndex);
        if (Array.isArray(s.logs)) setLogs(s.logs);
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save state to Disk and LocalStorage
  const saveStateToDisk = async (overrideRecipients?: Recipient[], overrideLogs?: any[]) => {
    setIsSaving(true);
    const recsToSave = overrideRecipients || recipients;
    const logsToSave = overrideLogs || logs;

    const payload = {
      recipients: recsToSave,
      subject,
      fromName,
      replyTo,
      htmlContent,
      delayMs,
      currentIndex,
      logs: logsToSave.slice(-300),
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('cseel_resume_campaign_state', JSON.stringify(payload));
      await fetch('/api/mailer/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Auto-save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Check SMTP connection on load
  const checkSmtp = async () => {
    setCheckingSmtp(true);
    try {
      const res = await fetch('/api/mailer/dispatch');
      const data = await res.json();
      setSmtpStatus(data);
      if (data.replyTo && !replyTo) setReplyTo(data.replyTo);
    } catch (err: any) {
      setSmtpStatus({ ready: false, message: 'Failed to connect to local API: ' + err.message });
    } finally {
      setCheckingSmtp(false);
    }
  };

  // AWS Account & Sandbox Status State
  const [awsAccountInfo, setAwsAccountInfo] = useState<{
    productionAccess: boolean;
    max24HourSend: number;
    maxSendRate: number;
    sentLast24Hours: number;
    reviewStatus: string;
    caseId: string | null;
  } | null>(null);
  const [checkingAwsStatus, setCheckingAwsStatus] = useState(false);

  const checkAwsAccountStatus = async () => {
    setCheckingAwsStatus(true);
    try {
      const res = await fetch('/api/mailer/ses-status');
      const data = await res.json();
      if (data.success) {
        setAwsAccountInfo(data);
      }
    } catch (e) {
      console.error('Error checking AWS status:', e);
    } finally {
      setCheckingAwsStatus(false);
    }
  };

  useEffect(() => {
    checkSmtp();
    loadPersistedState();
    checkAwsAccountStatus();

    // Auto-poll AWS Sandbox status every 45 seconds
    const statusInterval = setInterval(() => {
      checkAwsAccountStatus();
    }, 45000);

    return () => clearInterval(statusInterval);
  }, []);

  // Debounced Auto-Save on state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      saveStateToDisk();
    }, 1000);

    return () => clearTimeout(timer);
  }, [recipients, subject, fromName, replyTo, htmlContent, delayMs, currentIndex]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Recipient Parsing
  const processRawLines = (lines: string[]) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const existingEmails = new Set(recipients.map(r => r.email.toLowerCase()));
    const newItems: Recipient[] = [];
    let duplicates = 0;
    let invalid = 0;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Handle CSV or tab-separated lines: email, name, school, city
      const parts = trimmed.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
      let email = '';
      let name = '';
      let school = '';
      let city = '';

      // Find which part is email
      const emailIndex = parts.findIndex(p => emailRegex.test(p));
      if (emailIndex !== -1) {
        email = parts[emailIndex];
        const remaining = parts.filter((_, i) => i !== emailIndex);
        name = remaining[0] || '';
        school = remaining[1] || '';
        city = remaining[2] || '';
      } else {
        // Fallback: check if entire line is just email
        if (emailRegex.test(trimmed)) {
          email = trimmed;
        } else {
          invalid++;
          return;
        }
      }

      const lowerEmail = email.toLowerCase();
      if (existingEmails.has(lowerEmail)) {
        duplicates++;
        return;
      }

      existingEmails.add(lowerEmail);
      newItems.push({
        id: `rec_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        email: lowerEmail,
        name,
        school,
        city,
        status: 'pending',
      });
    });

    setRecipients(prev => [...prev, ...newItems]);
    addLog('info', `Imported ${newItems.length} valid email(s). Skipped: ${duplicates} duplicate(s), ${invalid} invalid.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          const lines: string[] = [];
          rows.forEach(row => {
            if (Array.isArray(row) && row.length > 0) {
              lines.push(row.join(','));
            }
          });
          processRawLines(lines);
        } catch (err: any) {
          alert('Error reading Excel file: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          processRawLines(text.split('\n'));
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handlePasteSubmit = () => {
    if (!pasteInput.trim()) return;
    processRawLines(pasteInput.split('\n'));
    setPasteInput('');
  };

  const clearAllRecipients = async () => {
    if (confirm('Are you sure you want to clear all loaded recipients and reset campaign state?')) {
      setRecipients([]);
      setCurrentIndex(0);
      setLogs([]);
      try {
        localStorage.removeItem('cseel_resume_campaign_state');
        await fetch('/api/mailer/state', { method: 'DELETE' });
      } catch (e) {
        console.error(e);
      }
      addLog('info', 'Recipient list & campaign state cleared.');
    }
  };

  // Add Log Helper
  const addLog = (type: 'success' | 'error' | 'info', text: string) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    setLogs(prev => [...prev.slice(-300), { timestamp, type, text }]);
  };

  // Dispatch Runner
  const startDispatch = async () => {
    if (recipients.length === 0) {
      alert('Please upload or paste recipients first.');
      return;
    }

    const pendingCount = recipients.filter(r => r.status === 'pending' || r.status === 'failed').length;
    if (pendingCount === 0) {
      alert('All recipients have already been sent.');
      return;
    }

    setIsDispatching(true);
    setIsPaused(false);
    dispatchCancelRef.current = false;
    dispatchPauseRef.current = false;
    setActiveTab('dispatch');
    addLog('info', `🚀 Campaign dispatch initiated for ${pendingCount} pending recipient(s)...`);

    for (let i = currentIndex; i < recipients.length; i++) {
      if (dispatchCancelRef.current) {
        addLog('info', '⏹️ Campaign halted by user.');
        break;
      }

      while (dispatchPauseRef.current) {
        await new Promise(r => setTimeout(r, 500));
        if (dispatchCancelRef.current) break;
      }
      if (dispatchCancelRef.current) break;

      const item = recipients[i];
      if (item.status === 'sent') {
        setCurrentIndex(i + 1);
        continue;
      }

      setCurrentIndex(i);
      setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'sending' } : r));

      // Build personalized content
      let personalizedHtml = htmlContent
        .replace(/{{name}}/gi, item.name || 'Hiring Manager')
        .replace(/{{school}}/gi, item.school || '')
        .replace(/{{city}}/gi, item.city || '')
        .replace(/{{email}}/gi, item.email);

      let personalizedSubject = subject
        .replace(/{{name}}/gi, item.name || '')
        .replace(/{{school}}/gi, item.school ? ` - ${item.school}` : '');

      try {
        const res = await fetch('/api/mailer/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: item.email,
            subject: personalizedSubject,
            html: personalizedHtml,
            fromName,
            replyTo,
            metadata: { recipientId: item.id },
          }),
        });

        const result = await res.json();
        if (result.success) {
          setRecipients(prev => prev.map((r, idx) => idx === i ? {
            ...r,
            status: 'sent',
            messageId: result.messageId,
            timestamp: new Date().toLocaleTimeString(),
          } : r));
          addLog('success', `[${i + 1}/${recipients.length}] ✅ Sent: ${item.email} (${result.messageId})`);
        } else {
          setRecipients(prev => prev.map((r, idx) => idx === i ? {
            ...r,
            status: 'failed',
            error: result.error || 'Failed',
            timestamp: new Date().toLocaleTimeString(),
          } : r));
          addLog('error', `[${i + 1}/${recipients.length}] ❌ Failed: ${item.email} - ${result.error}`);
        }
      } catch (err: any) {
        setRecipients(prev => prev.map((r, idx) => idx === i ? {
          ...r,
          status: 'failed',
          error: err.message,
          timestamp: new Date().toLocaleTimeString(),
        } : r));
        addLog('error', `[${i + 1}/${recipients.length}] ❌ Network/Send error: ${item.email} - ${err.message}`);
      }

      // Throttle delay between sends
      await new Promise(r => setTimeout(r, delayMs));
    }

    setIsDispatching(false);
    setIsPaused(false);
    addLog('info', '🏁 Campaign execution run finished.');
  };

  const pauseDispatch = () => {
    dispatchPauseRef.current = true;
    setIsPaused(true);
    addLog('info', '⏸️ Dispatch paused. Click Resume to continue.');
  };

  const resumeDispatch = () => {
    dispatchPauseRef.current = false;
    setIsPaused(false);
    addLog('info', '▶️ Dispatch resumed.');
  };

  const stopDispatch = () => {
    dispatchCancelRef.current = true;
    dispatchPauseRef.current = false;
    setIsDispatching(false);
    setIsPaused(false);
  };

  // Export CSV helpers
  const exportCsv = (statusFilter?: 'sent' | 'failed') => {
    const filtered = statusFilter ? recipients.filter(r => r.status === statusFilter) : recipients;
    if (filtered.length === 0) {
      alert(`No ${statusFilter || 'total'} records to export.`);
      return;
    }

    const rows = [
      ['Email', 'Name', 'School', 'City', 'Status', 'Message ID / Error', 'Timestamp'],
      ...filtered.map(r => [
        r.email,
        r.name || '',
        r.school || '',
        r.city || '',
        r.status,
        r.status === 'sent' ? (r.messageId || '') : (r.error || ''),
        r.timestamp || '',
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(i => `"${String(i).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `resume_campaign_${statusFilter || 'all'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalCount = recipients.length;
  const sentCount = recipients.filter(r => r.status === 'sent').length;
  const failedCount = recipients.filter(r => r.status === 'failed').length;
  const pendingCount = recipients.filter(r => r.status === 'pending' || r.status === 'sending').length;
  const progressPercent = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0;

  const filteredRecipients = recipients.filter(r =>
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (r.school && r.school.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">CSEEL Resume Dispatcher</h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                Desktop Edition
              </span>
            </div>
            <p className="text-xs text-slate-400">Local High-Performance Bulk Email Engine • AWS SES</p>
          </div>
        </div>

        {/* Live SES Status Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className={`w-2.5 h-2.5 rounded-full ${smtpStatus?.ready ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <div className="font-semibold text-slate-200">
                {checkingSmtp ? 'Checking SES...' : smtpStatus?.ready ? 'AWS SES: Connected' : 'SES: Offline'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                From: {smtpStatus?.from || 'resumes@mailer.cseel.org'}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <div>
              <div className="font-semibold text-slate-200">
                {isSaving ? 'Saving to disk...' : 'Auto-Saved'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {lastSaved ? `Disk: ${lastSaved}` : 'Persistent Storage'}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-slate-200">Reply-To Target</div>
              <div className="text-[10px] text-sky-400 font-mono">{replyTo}</div>
            </div>
          </div>

          <button
            onClick={() => { checkSmtp(); checkAwsAccountStatus(); }}
            title="Refresh All Connections"
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${checkingSmtp || checkingAwsStatus ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Live AWS Sandbox & Production Status Banner */}
      {awsAccountInfo && (
        awsAccountInfo.productionAccess ? (
          <div className="bg-emerald-950/70 border-b border-emerald-600 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200 shadow-xl shadow-emerald-950/60 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
              <div>
                <span className="text-sm font-black text-white tracking-wide flex items-center gap-2">
                  🎉 AWS SES PRODUCTION UNLOCKED! (SANDBOX VERIFIED)
                </span>
                <p className="text-[11px] text-emerald-300 mt-0.5">
                  Daily Quota: <strong className="text-white">{awsAccountInfo.max24HourSend.toLocaleString()} emails/day</strong> • Max Speed: <strong>{awsAccountInfo.maxSendRate} mails/sec</strong> • Ready to send directly to all 4,000 schools without any restrictions!
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dispatch')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Launch 4,000 Campaign Now
            </button>
          </div>
        ) : (
          <div className="bg-amber-950/40 border-b border-amber-800/60 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <div>
                <span className="font-bold text-amber-300">AWS SES Sandbox Active:</span>{' '}
                Limit {awsAccountInfo.max24HourSend}/day ({awsAccountInfo.sentLast24Hours} sent today). Case #{awsAccountInfo.caseId || '179221660200739'} review pending.
                <span className="text-[11px] text-slate-400 ml-2">(Auto-checks every 45s — will turn green automatically once approved)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://console.aws.amazon.com/support/home#/case/?caseId=179221660200739"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:text-sky-300 underline font-medium text-[11px]"
              >
                View AWS Support Case ↗
              </a>
              <button
                onClick={checkAwsAccountStatus}
                disabled={checkingAwsStatus}
                className="bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 text-amber-100 px-3 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${checkingAwsStatus ? 'animate-spin' : ''}`} />
                {checkingAwsStatus ? 'Checking...' : 'Check Status Now'}
              </button>
            </div>
          </div>
        )
      )}

      {/* Navigation Tabs */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('recipients')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'recipients'
                ? 'border-sky-500 text-sky-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Database className="w-4 h-4" />
            1. Recipients List ({totalCount.toLocaleString()})
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'template'
                ? 'border-sky-500 text-sky-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            2. Resume HTML & Preview
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'dispatch'
                ? 'border-sky-500 text-sky-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          >
            <Send className="w-4 h-4" />
            3. Dispatch & Live Monitor {isDispatching && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
          </button>
        </div>

        {/* Quick Launch CTA */}
        {totalCount > 0 && !isDispatching && (
          <button
            onClick={startDispatch}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-lg shadow-sky-500/20 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Campaign ({pendingCount} pending)
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* TAB 1: RECIPIENTS */}
        {activeTab === 'recipients' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Upload & Paste Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-sky-400 mb-2">
                    <Upload className="w-5 h-5" />
                    <h3 className="font-bold text-sm text-white">Import File (.xlsx, .csv)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                    Upload your master contact list. The engine automatically detects columns for email, name, school, and city.
                  </p>

                  <label className="border-2 border-dashed border-slate-700 hover:border-sky-500 bg-slate-900/50 hover:bg-slate-900 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <input
                      type="file"
                      accept=".csv, .xlsx, .xls, .txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Database className="w-10 h-10 text-slate-500 group-hover:text-sky-400 transition-colors mb-3" />
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                      Click to browse or drag & drop file
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Supports up to 50,000 rows • Automatic duplicate removal
                    </span>
                  </label>
                </div>
              </div>

              {/* Paste Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <FileText className="w-5 h-5" />
                    <h3 className="font-bold text-sm text-white">Paste Emails Directly</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    Paste one per line, or comma-separated format: <code className="text-slate-300 font-mono text-[11px]">email, name, school</code>
                  </p>

                  <textarea
                    rows={5}
                    value={pasteInput}
                    onChange={(e) => setPasteInput(e.target.value)}
                    placeholder="principal@delhipublicschool.org, Mr. Sharma, DPS Rewari&#10;hr@stxaviers.edu.in, Ms. Verma, St Xavier&#10;contact@modernacademy.ac.in"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handlePasteSubmit}
                    disabled={!pasteInput.trim()}
                    className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-all"
                  >
                    Add Pasted List
                  </button>
                </div>
              </div>
            </div>

            {/* Recipient Stats & Controls */}
            {totalCount > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-sm text-white">Imported Contacts</h3>
                    <span className="bg-slate-800 text-sky-400 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold">
                      {totalCount.toLocaleString()} total
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search emails or schools..."
                        className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-64"
                      />
                    </div>

                    <button
                      onClick={() => exportCsv()}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export List
                    </button>

                    <button
                      onClick={clearAllRecipients}
                      className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="max-h-96 overflow-y-auto border border-slate-800/80 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900 sticky top-0 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">#</th>
                        <th className="py-2.5 px-4">Email</th>
                        <th className="py-2.5 px-4">Name</th>
                        <th className="py-2.5 px-4">School / Institution</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {filteredRecipients.slice(0, 500).map((r, i) => (
                        <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2 px-4 text-slate-500">{i + 1}</td>
                          <td className="py-2 px-4 text-slate-200 font-semibold">{r.email}</td>
                          <td className="py-2 px-4 text-slate-400 font-sans">{r.name || '—'}</td>
                          <td className="py-2 px-4 text-slate-400 font-sans">{r.school || '—'}</td>
                          <td className="py-2 px-4">
                            {r.status === 'sent' && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" /> Sent
                              </span>
                            )}
                            {r.status === 'failed' && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded" title={r.error}>
                                <XCircle className="w-3 h-3" /> Failed
                              </span>
                            )}
                            {r.status === 'sending' && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
                                <RefreshCw className="w-3 h-3 animate-spin" /> Sending
                              </span>
                            )}
                            {r.status === 'pending' && (
                              <span className="inline-flex items-center text-[11px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredRecipients.length > 500 && (
                  <div className="text-center text-[11px] text-slate-500 py-1">
                    Showing first 500 of {filteredRecipients.length.toLocaleString()} contacts. (All {totalCount.toLocaleString()} will be sent during dispatch).
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TEMPLATE & PREVIEW */}
        {activeTab === 'template' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Configuration */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Supports <code className="text-sky-400 font-mono">{"{{school}}"}</code> & <code className="text-sky-400 font-mono">{"{{name}}"}</code></span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">From Display Name</label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Sender: <span className="font-mono text-slate-400">resumes@mailer.cseel.org</span></span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reply-To Address (Where schools reply)</label>
                <input
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Replies will land in this personal Gmail inbox</span>
              </div>
            </div>

            {/* Split Screen Editor & Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* HTML Editor */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-[650px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">HTML Resume Code</span>
                  </div>
                  <button
                    onClick={() => setHtmlContent(DEFAULT_RESUME_HTML)}
                    className="text-[11px] text-slate-400 hover:text-sky-400 transition-colors"
                  >
                    Reset Default Template
                  </button>
                </div>

                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Live Render Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-[650px]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Visual Preview</span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="Desktop Preview"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      title="Mobile Preview"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden flex justify-center p-3">
                  <div className={`h-full transition-all duration-300 overflow-hidden rounded-lg shadow-2xl ${previewMode === 'mobile' ? 'w-[375px]' : 'w-full'}`}>
                    <iframe
                      srcDoc={htmlContent}
                      title="Resume Preview"
                      className="w-full h-full border-0 bg-white"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DISPATCH CONTROL CENTER */}
        {activeTab === 'dispatch' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Control Header Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Campaign Execution Hub</h2>
                  <p className="text-xs text-slate-400">
                    Throttled delivery engine ensuring maximum inbox deliverability & zero blacklisting
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex items-center gap-3">
                  {!isDispatching ? (
                    <button
                      onClick={startDispatch}
                      disabled={totalCount === 0}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Start Dispatching
                    </button>
                  ) : (
                    <>
                      {!isPaused ? (
                        <button
                          onClick={pauseDispatch}
                          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all"
                        >
                          <Pause className="w-4 h-4 fill-current" />
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={resumeDispatch}
                          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Resume
                        </button>
                      )}

                      <button
                        onClick={stopDispatch}
                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Stop / Abort
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Bar & Status */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">
                    Overall Progress: {progressPercent}% ({sentCount.toLocaleString()} / {totalCount.toLocaleString()} sent)
                  </span>
                  <span className="text-slate-400 font-mono">
                    Delay: {delayMs}ms / mail
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Queue</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">{totalCount.toLocaleString()}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Delivered</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{sentCount.toLocaleString()}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider">Failed / Bounced</div>
                  <div className="text-2xl font-black text-rose-400 font-mono mt-1">{failedCount.toLocaleString()}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Remaining</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">{pendingCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Throttle Controls */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 font-semibold">Throttling Speed:</span>
                  <div className="flex items-center gap-2">
                    {[500, 1000, 1500, 2000].map(val => (
                      <button
                        key={val}
                        onClick={() => setDelayMs(val)}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                          delayMs === val
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {val / 1000}s / mail
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportCsv('sent')}
                    disabled={sentCount === 0}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Sent CSV ({sentCount})
                  </button>

                  <button
                    onClick={() => exportCsv('failed')}
                    disabled={failedCount === 0}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-rose-400 border border-rose-900/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Failed / Bounces ({failedCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Rolling Terminal Output */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col h-[380px]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Activity Log</span>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  Clear Logs
                </button>
              </div>

              <div
                ref={logContainerRef}
                className="flex-1 bg-slate-900/80 rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-1.5 border border-slate-800/60"
              >
                {logs.length === 0 ? (
                  <div className="text-slate-600 text-center py-10">
                    Activity events will appear here when you import recipients or start dispatching...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div
                      key={i}
                      className={`leading-relaxed ${
                        log.type === 'success' ? 'text-emerald-400' :
                        log.type === 'error' ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                      {log.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
