'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, Sparkles, School, MapPin, Phone, User, FileText, ArrowRight } from 'lucide-react';
import { useBookDemoModal } from '@/contexts/BookDemoModalContext';

export const BookDemoModal: React.FC = () => {
  const { isOpen, closeDemoModal, prefillData } = useBookDemoModal();

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    contact: '',
    schoolName: '',
    address: '',
    note: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle prefill data updates when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMessage('');
      setFormData((prev) => ({
        ...prev,
        designation: prefillData.designation || prev.designation,
        schoolName: prefillData.schoolName || prev.schoolName,
        note: prefillData.note || prev.note,
      }));
    }
  }, [isOpen, prefillData]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      setErrorMessage('Please fill in your Name and Contact details.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/demo-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: prefillData.source || 'Website "Book a Demo" CTA',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit demo request. Please try again.');
      }

      setSubmitted(true);
      // Reset form after successful submission
      setFormData({
        name: '',
        designation: '',
        contact: '',
        schoolName: '',
        address: '',
        note: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDemoModal}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#023858] via-[#005689] to-[#0466c8] p-5 sm:p-6 text-white relative">
              <button
                type="button"
                onClick={closeDemoModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                  Experiential STEM Labs
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight" style={{ color: '#ffffff' }}>
                {prefillData.title || 'Book a Free School Demo'}
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed">
                {prefillData.subtitle || 'Experience 1,000+ interactive virtual experiments & NEP-aligned practicals tailored for your school.'}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7">
              {submitted ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900" style={{ color: '#003c6e' }}>
                    Enquiry Received Successfully!
                  </h4>
                  <p className="text-gray-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you! Our academic team will review your inquiry and connect with you shortly to assist with more experiments and syllabus access.
                  </p>
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={closeDemoModal}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#005689] hover:bg-[#003c6e] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Done &amp; Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  {/* 1. Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Rajesh Sharma / Teacher / Student"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#005689] rounded-xl text-xs sm:text-sm text-gray-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* 2. Designation */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Designation <span className="text-gray-400 font-normal">(Teacher, Principal, Student, Parent, etc.)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="e.g. Science Teacher, HOD, Principal, Student"
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#005689] rounded-xl text-xs sm:text-sm text-gray-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* 3. Contact */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Contact Number / Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210 or yourname@school.edu.in"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#005689] rounded-xl text-xs sm:text-sm text-gray-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* 4. School Name (Only if extra fields are not hidden) */}
                  {!prefillData.hideExtraFields && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        School / Institution Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <School className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="schoolName"
                          value={formData.schoolName}
                          onChange={handleChange}
                          placeholder="e.g. Delhi Public School / St. Xavier's"
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#005689] rounded-xl text-xs sm:text-sm text-gray-900 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. Address (Only if extra fields are not hidden) */}
                  {!prefillData.hideExtraFields && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        School Address / City &amp; State
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="e.g. Sector 14, Gurugram, Haryana"
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#005689] rounded-xl text-xs sm:text-sm text-gray-900 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. Note */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Note / Specific Requirements <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-2.5 left-0 pl-3 flex items-start pointer-events-none text-gray-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows={2}
                        placeholder="e.g. Interested in ATL Tinkering Labs, Physics & Chemistry simulations for Class 9-12..."
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-[#005689] rounded-xl text-xs sm:text-sm text-gray-900 outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#005689] hover:bg-[#003c6e] active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Demo Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Demo Enquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-2">
                      Admin receives inquiry instantly &amp; schedules customized session.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookDemoModal;
