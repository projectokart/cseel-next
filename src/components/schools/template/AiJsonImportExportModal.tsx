'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  FileJson,
  Upload,
  Download,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  X,
  Code,
  FileText,
  Info,
  ChevronRight,
  BookOpen,
  Cpu,
  Layers,
  Link as LinkIcon,
  RefreshCw,
  Clock,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useSchoolTemplate } from './SchoolTemplateContext';
import {
  generateAiPromptForSchool,
  BLANK_AI_SCHOOL_SCHEMA,
  parseSchoolJsonToState,
  ImportSummary,
} from './SchoolJsonSchemaHelper';

interface AiJsonImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AiJsonImportExportModal({ isOpen, onClose }: AiJsonImportExportModalProps) {
  const { data, importSchoolDataFromJson, exportSchoolDataAsJson } = useSchoolTemplate();

  const [activeTab, setActiveTab] = useState<'import' | 'live-sync' | 'prompt' | 'export'>('import');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [schoolNotes, setSchoolNotes] = useState<string>(data.schoolName !== 'Write Your School Name Here' ? data.schoolName : '');
  const [isCopiedPrompt, setIsCopiedPrompt] = useState<boolean>(false);
  const [isCopiedSchema, setIsCopiedSchema] = useState<boolean>(false);
  const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false);
  const [isCopiedAiInstruction, setIsCopiedAiInstruction] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<ImportSummary | null>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // Live Sync Tab States
  const [syncToken, setSyncToken] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isSyncLoading, setIsSyncLoading] = useState<boolean>(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load existing token from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedToken = localStorage.getItem('cseel_school_sync_token');
    if (savedToken) {
      setSyncToken(savedToken);
    }
  }, []);

  // Fetch token details when tab changes or token changes
  useEffect(() => {
    if (activeTab === 'live-sync' && syncToken) {
      fetchSyncStatus(syncToken);
    }
  }, [activeTab, syncToken]);

  const fetchSyncStatus = async (tokenToFetch: string) => {
    setIsSyncLoading(true);
    setSyncMessage(null);
    try {
      const res = await fetch(`/api/school-ai-sync?token=${tokenToFetch}`);
      const json = await res.json();
      setSyncStatus(json);
    } catch (err: any) {
      console.warn('Failed to fetch sync status:', err);
    } finally {
      setIsSyncLoading(false);
    }
  };

  // Generate or Renew a 7-Day AI Sync Link
  const handleGenerateOrRenewToken = async () => {
    setIsGeneratingToken(true);
    setSyncMessage(null);
    try {
      const schoolId = data.udiseCode || String(Date.now());
      const schoolName = encodeURIComponent(data.schoolName || 'School Profile');
      const res = await fetch(`/api/school-ai-sync?action=generate&schoolId=${schoolId}&schoolName=${schoolName}`);
      const json = await res.json();
      if (json.success && json.token) {
        setSyncToken(json.token);
        localStorage.setItem('cseel_school_sync_token', json.token);
        await fetchSyncStatus(json.token);
        setSyncMessage('✨ New 7-Day AI Sync Link generated and active!');
        setTimeout(() => setSyncMessage(null), 4000);
      }
    } catch (err: any) {
      setSyncMessage('Failed to generate sync link: ' + err.message);
    } finally {
      setIsGeneratingToken(false);
    }
  };

  // Fetch latest data posted by AI and apply directly to live profile
  const handleApplyAiUpdatesFromLink = () => {
    if (!syncStatus || !syncStatus.profileData) {
      setSyncMessage('No data received from AI yet. Give the link to ChatGPT or Gemini first.');
      return;
    }
    const result = importSchoolDataFromJson(syncStatus.profileData);
    if (result.success) {
      setSyncMessage('🎉 Latest updates from AI applied to live profile successfully!');
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      setSyncMessage('Error applying AI data: ' + result.message);
    }
  };

  if (!isOpen) return null;

  // Handle JSON input change & auto-validate
  const handleJsonInputChange = (val: string) => {
    setJsonInput(val);
    setValidationError(null);
    setParsedPreview(null);

    if (!val.trim()) return;

    try {
      const res = parseSchoolJsonToState(val, data);
      if (res.success && res.summary) {
        setParsedPreview(res.summary);
      } else {
        setValidationError(res.error || 'Invalid JSON syntax');
      }
    } catch (e: any) {
      setValidationError(e.message || 'JSON parse error');
    }
  };

  // Handle File Upload (.json)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleJsonInputChange(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 1-Click Apply
  const handleApplyImport = () => {
    if (!jsonInput.trim()) {
      setValidationError('Please upload a JSON file or paste JSON content first.');
      return;
    }

    setIsApplying(true);
    const result = importSchoolDataFromJson(jsonInput);
    setIsApplying(false);

    if (result.success) {
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setValidationError(result.message);
    }
  };

  // Copy AI Prompt
  const handleCopyAiPrompt = () => {
    const fullPrompt = generateAiPromptForSchool(schoolNotes);
    navigator.clipboard.writeText(fullPrompt);
    setIsCopiedPrompt(true);
    setTimeout(() => setIsCopiedPrompt(false), 2500);
  };

  // Copy Raw Blank Schema
  const handleCopyBlankSchema = () => {
    navigator.clipboard.writeText(JSON.stringify(BLANK_AI_SCHOOL_SCHEMA, null, 2));
    setIsCopiedSchema(true);
    setTimeout(() => setIsCopiedSchema(false), 2500);
  };

  // Download Blank Schema as .json file
  const handleDownloadBlankSchema = () => {
    const blob = new Blob([JSON.stringify(BLANK_AI_SCHOOL_SCHEMA, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cseel-blank-school-profile-blueprint.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download Current Filled Profile as .json file
  const handleDownloadCurrentProfile = () => {
    const exportData = exportSchoolDataAsJson();
    const safeName = (data.schoolName || 'school')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName || 'school'}-profile-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://cseel.org';
  const fullSyncUrl = syncToken ? `${currentOrigin}/api/school-ai-sync?token=${syncToken}` : '';

  const aiInstructionText = syncToken
    ? `Please update my school profile directly using my dedicated CSEEL AI Sync link:
${fullSyncUrl}

School to update: ${data.schoolName || 'My School'}
Instructions: First perform a GET request to the link to inspect the schema and current data, then generate the complete filled JSON and perform an HTTP POST request to that exact link with Content-Type: application/json.`
    : '';

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 pb-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  1-Click AI School Profile Generator & JSON Sync
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                  AI Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload a JSON file, or give your 7-day auto-expiring sync link to ChatGPT / Gemini to auto-update!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'import'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>1-Click Upload JSON</span>
            {parsedPreview && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('live-sync')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'live-sync'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Live Sync Link (7-Day Expiry)</span>
            {syncStatus?.hasData && (
              <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full">New Data</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Prompt Blueprint</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Schemas & Export</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-190px)] space-y-4">
          {/* TAB 1: 1-CLICK UPLOAD / IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              {/* File Upload Drop Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 sm:p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/30 hover:bg-indigo-950/10 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <FileJson className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300">
                    Upload .json File
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click to browse or drag and drop your school profile JSON file here
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between text-xs space-y-2">
                  <div>
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <Info className="w-3.5 h-3.5" />
                      <span>How it works:</span>
                    </span>
                    <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                      Har section ka unique <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded font-mono">section_id</code> aur element ka <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded font-mono">element_id</code> automatically mapped hai.
                      JSON upload karte hi saara data, 3D Photo Book slides, science labs, fees & stats ek click me live template me set ho jayenge!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Don't have JSON yet?</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('prompt')}
                      className="text-indigo-400 hover:underline font-bold"
                    >
                      Use AI Prompt →
                    </button>
                  </div>
                </div>
              </div>

              {/* Paste JSON Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Or Paste JSON Content Below:</span>
                  </label>
                  {jsonInput && (
                    <button
                      type="button"
                      onClick={() => handleJsonInputChange('')}
                      className="text-[10px] text-slate-400 hover:text-rose-400 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => handleJsonInputChange(e.target.value)}
                  placeholder="Paste your filled JSON here (e.g. { 'section_1_basic_info': { 'school_name': 'My School', ... } })"
                  rows={8}
                  className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition scrollbar-thin"
                />
              </div>

              {/* Validation Feedback & Preview Summary */}
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{validationError}</span>
                </div>
              )}

              {parsedPreview && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Valid JSON Structure Recognized! Ready to Import:</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[9.5px]">1. Home (School)</span>
                      <span className="font-bold text-white truncate block">{parsedPreview.schoolName}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[9.5px]">Board & State</span>
                      <span className="font-bold text-white truncate block">{parsedPreview.board}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[9.5px]">3D PhotoBook</span>
                      <span className="font-bold text-amber-400 block">{parsedPreview.slidesCount} Slides</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[9.5px]">3. Facilities</span>
                      <span className="font-bold text-indigo-400 block">{parsedPreview.facilitiesCount} Items</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[9.5px]">4. Campus Gallery</span>
                      <span className="font-bold text-emerald-400 block">{parsedPreview.galleryCount} Photos</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block text-[9.5px]">5. Admissions & Fees</span>
                      <span className="font-bold text-purple-400 block">{parsedPreview.feeRowsCount} Class Rows</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyImport}
                  disabled={!parsedPreview || isApplying}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                    parsedPreview && !isApplying
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:brightness-110 text-white cursor-pointer active:scale-95 shadow-indigo-500/25'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isApplying ? 'Creating Profile...' : '✨ Apply & Create Profile in 1-Click'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI LIVE SYNC LINK (7-DAY EXPIRY) */}
          {activeTab === 'live-sync' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sky-300">
                  <LinkIcon className="w-4 h-4 text-sky-400" />
                  <span>Direct AI Webhook Sync (7-Day Auto-Expiry):</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ye ek dedicated webhook link hai jo aap seedha <strong>ChatGPT</strong> ya <strong>Gemini</strong> ko de sakte hain.
                  AI is link par HTTP POST request bhej kar profile ka saara data bina kisi form ke directly update kar dega!
                  Security ke liye ye link **har hafte (7 days me) expire hota hai** aur aap naya link renew kar sakte hain.
                </p>
              </div>

              {/* Sync Link Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Your AI Sync Link:</span>
                    {syncStatus && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        syncStatus.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {syncStatus.status === 'active' ? `● Active (${syncStatus.remainingDays} days left)` : '⚠️ Expired'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateOrRenewToken}
                      disabled={isGeneratingToken}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition active:scale-95 cursor-pointer"
                      title="Generate or extend for 7 days"
                    >
                      {isGeneratingToken ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>{syncToken ? 'Renew / New 7-Day Link' : 'Generate 7-Day Link'}</span>
                    </button>
                  </div>
                </div>

                {syncToken ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={fullSyncUrl}
                        className="flex-1 px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-xl text-amber-300 select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(fullSyncUrl);
                          setIsCopiedLink(true);
                          setTimeout(() => setIsCopiedLink(false), 2000);
                        }}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                      >
                        {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Valid until: {syncStatus?.expiresAt ? new Date(syncStatus.expiresAt).toLocaleDateString() : '7 days from creation'}</span>
                      </span>
                      <a
                        href={fullSyncUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Open Webhook Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900/50 rounded-xl text-center text-xs text-slate-400 space-y-2">
                    <p>No active AI Sync link found for this browser. Click below to generate your school's unique 7-day link.</p>
                    <button
                      type="button"
                      onClick={handleGenerateOrRenewToken}
                      disabled={isGeneratingToken}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Create My School's 7-Day AI Link</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Ready Prompt to Give to ChatGPT / Gemini */}
              {syncToken && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ready Prompt to Give to ChatGPT / Gemini:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(aiInstructionText);
                        setIsCopiedAiInstruction(true);
                        setTimeout(() => setIsCopiedAiInstruction(false), 2000);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      {isCopiedAiInstruction ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopiedAiInstruction ? 'Copied Prompt!' : 'Copy Prompt for AI'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 whitespace-pre-wrap select-text scrollbar-thin max-h-36 overflow-y-auto">
                    {aiInstructionText}
                  </pre>
                </div>
              )}

              {/* Status Banner / Feedback */}
              {syncMessage && (
                <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <Info className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* Live Status from Server */}
              {syncToken && syncStatus && (
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Live Sync Status:</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {syncStatus.hasData
                          ? `Last updated by ${syncStatus.lastUpdatedSource || 'AI Assistant'} on ${new Date(syncStatus.lastUpdatedAt).toLocaleTimeString()}`
                          : 'Waiting for AI update (no data pushed yet).'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fetchSyncStatus(syncToken)}
                        disabled={isSyncLoading}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition active:scale-95 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncLoading ? 'animate-spin' : ''}`} />
                        <span>Check Updates</span>
                      </button>

                      {syncStatus.hasData && (
                        <button
                          type="button"
                          onClick={handleApplyAiUpdatesFromLink}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Apply AI Data to Live Profile</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI PROMPT BLUEPRINT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>How to use with ChatGPT, Claude, Gemini, or DeepSeek:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  1. Apna school name ya brochure notes neeche box me daalein (optional).<br />
                  2. <strong>"Copy Master AI Prompt"</strong> button click karein.<br />
                  3. ChatGPT ya Gemini me paste karein. AI exact JSON structure me data bhar ke dega.<br />
                  4. AI ke output ko copy karke <strong>Tab 1 ("Upload JSON")</strong> me paste karein aur 1-Click me profile banayein!
                </p>
              </div>

              {/* School Input Helper */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Your School Name / Brochure Notes (Optional):
                </label>
                <input
                  type="text"
                  value={schoolNotes}
                  onChange={(e) => setSchoolNotes(e.target.value)}
                  placeholder="e.g. Delhi Public School, Rewari, Haryana (CBSE Affiliated, Co-ed, 15 Acres)"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* AI Prompt Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Complete AI Prompt Preview:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAiPrompt}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    {isCopiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedPrompt ? 'Copied Prompt!' : 'Copy Master AI Prompt'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto whitespace-pre-wrap select-text scrollbar-thin">
                  {generateAiPromptForSchool(schoolNotes)}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOWNLOAD SCHEMAS & EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Download Blank Blueprint */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Empty Schema Blueprint (.json)</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Download the clean JSON template with all Section IDs and Element IDs ready for AI or offline editing.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadBlankSchema}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download File</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyBlankSchema}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition active:scale-95"
                    >
                      {isCopiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopiedSchema ? 'Copied!' : 'Copy Schema'}</span>
                    </button>
                  </div>
                </div>

                {/* Export Current Filled Profile */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2">
                      <FileJson className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Export Current Profile JSON</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Download your currently loaded profile data as a backup or to duplicate for another branch/school.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadCurrentProfile}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Current Profile</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section ID List Guide */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Recognized Section IDs in CSEEL Schema:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] font-mono text-indigo-300">
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">1. basic_info</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">2. location_contact</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">3. key_statistics</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">4. about_vision</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">5. photobook_slides</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">6. facilities_infrastructure</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">7. academics_pedagogy</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">8. admissions_criteria</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">9. faculty_mentors</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">10. awards_honors</div>
                  <div className="p-1.5 bg-slate-900 rounded border border-slate-800">11. campus_gallery</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
