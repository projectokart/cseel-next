'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface ApplyResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
  jobId?: string;
  schoolName?: string;
  defaultSubject?: string;
}

export default function ApplyResumeModal({
  isOpen,
  onClose,
  jobTitle = 'Direct Application',
  jobId = 'direct',
  schoolName = 'CSEEL Education Network',
  defaultSubject = '',
}: ApplyResumeModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [file, setFile] = useState<File | null>(null);
  const [fileStatusMsg, setFileStatusMsg] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultSubject && !subject) {
      setSubject(defaultSubject);
    }
  }, [defaultSubject, subject]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);
    setFileStatusMsg(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate type (PDF or Word)
    const fileNameLower = selectedFile.name.toLowerCase();
    const isPdf = fileNameLower.endsWith('.pdf') || selectedFile.type === 'application/pdf';
    const isDoc = fileNameLower.endsWith('.doc') || fileNameLower.endsWith('.docx') ||
      selectedFile.type.includes('word') || selectedFile.type.includes('document');

    if (!isPdf && !isDoc) {
      setFileError('Invalid file format. Only PDF and Word documents (.pdf, .doc, .docx) are accepted.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const sizeMb = selectedFile.size / (1024 * 1024);

    // Hard ceiling for browser processing: 20MB
    if (sizeMb > 20) {
      setFileError(`File size is ${sizeMb.toFixed(1)}MB, which exceeds the 20MB absolute upload limit. Please select a smaller document.`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (sizeMb > 5) {
      setFileStatusMsg(`File size is ${sizeMb.toFixed(1)}MB. It will be compressed to meet the 5MB limit upon submission.`);
    } else {
      setFileStatusMsg(`File verified (${sizeMb.toFixed(2)}MB). Ready for upload.`);
    }

    setFile(selectedFile);
  };

  const handleNotInterested = () => {
    try {
      localStorage.setItem('cseel_resume_modal_dismissed', 'true');
    } catch {}
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter your address / city / state.');
      return;
    }
    if (!subject.trim()) {
      setError('Please enter your subject or specialization.');
      return;
    }
    if (!file) {
      setError('Please upload your resume in PDF or Word format (Max 5MB).');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('address', address.trim());
      formData.append('subject', subject.trim());
      formData.append('jobTitle', jobTitle);
      formData.append('jobId', jobId);
      formData.append('schoolName', schoolName);
      formData.append('resume', file);

      const res = await fetch('/api/jobs/upload-resume', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to upload resume. Please try again.');
      }

      setIsSuccess(true);
      try {
        localStorage.setItem('cseel_resume_modal_dismissed', 'true');
      } catch {}

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Submission error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                Add Your Resume to Get Teaching Jobs Near You
              </h3>
              <p className="text-xs text-white/85 font-medium mt-0.5">
                Direct placement & verified school matching in your area
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-800">Resume Submitted!</h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Your profile has been saved and your resume has been sent to our placement team and school database.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Faculty Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Sharma / Priya Verma"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* 2. Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Your Address (City, State) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Sector 14, Gurugram, Haryana"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* 3. Subject / Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teaching Subject / Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. PGT Physics, TGT Mathematics, PRT English"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* 4. Resume File Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Upload Resume <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Max size 5 MB
                  </span>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-slate-700">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-bold truncate max-w-[240px]">{file.name}</span>
                      <span className="text-[10px] text-slate-500">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 mx-auto transition-colors" />
                      <p className="text-xs font-semibold text-slate-700">Click to choose or drag & drop</p>
                      <p className="text-[11px] text-slate-400">PDF, DOC, DOCX (Strict Max Size 5MB)</p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {fileError}
                  </p>
                )}
                {fileStatusMsg && !fileError && (
                  <p className="text-xs text-amber-700 font-medium mt-1">
                    {fileStatusMsg}
                  </p>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Compressing & Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Your Resume</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNotInterested}
                  className="w-full sm:w-auto py-3 px-4 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-bold text-xs transition-colors"
                >
                  Not Interested
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
