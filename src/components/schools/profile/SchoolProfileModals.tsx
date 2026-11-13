'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { X, CheckCircle2, Lock, Check, Play } from 'lucide-react';

const ClaimSchoolModal = dynamic(() => import('@/components/schools/ClaimSchoolModal'), { ssr: false });
const AddSchoolModal = dynamic(() => import('@/components/schools/AddSchoolModal'), { ssr: false });
const AddCardModal = dynamic(() => import('@/components/schools/template/AddCardModal'), { ssr: false });
const FacultyModal = dynamic(() => import('@/components/schools/template/FacultyModal'), { ssr: false });
const GalleryModal = dynamic(() => import('@/components/schools/template/GalleryModal'), { ssr: false });
const AwardModal = dynamic(() => import('@/components/schools/template/AwardModal'), { ssr: false });

export interface SchoolProfileModalsProps {
  displayName: string;
  displayUdise: string;
  campusVideoUrl?: string;
  isAdmissionsOpen: boolean;
  isLiveTemplate: boolean;
  templateCtx: any;

  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (v: boolean) => void;
  isSubmitted: boolean;
  applicantName: string;
  setApplicantName: (v: string) => void;
  applicantPhone: string;
  setApplicantPhone: (v: string) => void;
  applicantClass: string;
  setApplicantClass: (v: string) => void;
  applicantEmail: string;
  setApplicantEmail: (v: string) => void;
  isSubmittingEnquiry: boolean;
  handleApplySubmit: (e: React.FormEvent) => void;

  isAdmissionConfigModalOpen: boolean;
  setIsAdmissionConfigModalOpen: (v: boolean) => void;
  configSuccessMessage: string;
  admissionContactPerson: string;
  setAdmissionContactPerson: (v: string) => void;
  admissionEmail: string;
  setAdmissionEmail: (v: string) => void;
  admissionPhone: string;
  setAdmissionPhone: (v: string) => void;
  isConfiguringAdmissions: boolean;
  handleSaveAdmissionConfig: (e: React.FormEvent) => void;

  isTourModalOpen: boolean;
  setIsTourModalOpen: (v: boolean) => void;

  isAddFacilityModalOpen: boolean;
  setIsAddFacilityModalOpen: (v: boolean) => void;
  editingFacility: any;
  setEditingFacility: (v: any) => void;

  isAddAdmissionModalOpen: boolean;
  setIsAddAdmissionModalOpen: (v: boolean) => void;
  editingAdmission: any;
  setEditingAdmission: (v: any) => void;

  isFacultyModalOpen: boolean;
  setIsFacultyModalOpen: (v: boolean) => void;
  editingFaculty: any;
  setEditingFaculty: (v: any) => void;

  isGalleryModalOpen: boolean;
  setIsGalleryModalOpen: (v: boolean) => void;

  isAwardModalOpen: boolean;
  setIsAwardModalOpen: (v: boolean) => void;
  editingAward: any;
  setEditingAward: (v: any) => void;

  isClaimModalOpen: boolean;
  setIsClaimModalOpen: (v: boolean) => void;
  isAddSchoolModalOpen: boolean;
  setIsAddSchoolModalOpen: (v: boolean) => void;
}

export default function SchoolProfileModals(props: SchoolProfileModalsProps) {
  const {
    displayName,
    displayUdise,
    campusVideoUrl,
    isAdmissionsOpen,
    isLiveTemplate,
    templateCtx,
    isApplyModalOpen,
    setIsApplyModalOpen,
    isSubmitted,
    applicantName,
    setApplicantName,
    applicantPhone,
    setApplicantPhone,
    applicantClass,
    setApplicantClass,
    applicantEmail,
    setApplicantEmail,
    isSubmittingEnquiry,
    handleApplySubmit,
    isAdmissionConfigModalOpen,
    setIsAdmissionConfigModalOpen,
    configSuccessMessage,
    admissionContactPerson,
    setAdmissionContactPerson,
    admissionEmail,
    setAdmissionEmail,
    admissionPhone,
    setAdmissionPhone,
    isConfiguringAdmissions,
    handleSaveAdmissionConfig,
    isTourModalOpen,
    setIsTourModalOpen,
    isAddFacilityModalOpen,
    setIsAddFacilityModalOpen,
    editingFacility,
    setEditingFacility,
    isAddAdmissionModalOpen,
    setIsAddAdmissionModalOpen,
    editingAdmission,
    setEditingAdmission,
    isFacultyModalOpen,
    setIsFacultyModalOpen,
    editingFaculty,
    setEditingFaculty,
    isGalleryModalOpen,
    setIsGalleryModalOpen,
    isAwardModalOpen,
    setIsAwardModalOpen,
    editingAward,
    setEditingAward,
    isClaimModalOpen,
    setIsClaimModalOpen,
    isAddSchoolModalOpen,
    setIsAddSchoolModalOpen,
  } = props;

  return (
    <>
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-2.5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-gray-950">Application Received!</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Our admissions counselor will contact you at <strong>{applicantPhone}</strong> within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#005689] mb-1">
                  <span className="w-3.5 h-1 bg-[#FBBC04] rounded-full inline-block" />
                  <span>ADMISSION DESK 2026-27</span>
                </div>

                <h3 className="text-xl font-black text-gray-950">Apply for Admission</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">
                  {displayName} • UDISE: {displayUdise || 'Verified'}
                </p>

                {!isAdmissionsOpen && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-900">Online Admissions Currently Inactive</div>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed m-0">
                        You may contact the admissions office directly from the footer contact desk.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={isAdmissionsOpen ? handleApplySubmit : (e) => e.preventDefault()} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Student / Parent Name *
                    </label>
                    <input
                      type="text"
                      required={isAdmissionsOpen}
                      disabled={!isAdmissionsOpen}
                      placeholder="e.g. Rahul Sharma"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none ${
                        !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required={isAdmissionsOpen}
                        disabled={!isAdmissionsOpen}
                        placeholder="+91 98765 43210"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none ${
                          !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Class *
                      </label>
                      <select
                        value={applicantClass}
                        disabled={!isAdmissionsOpen}
                        onChange={(e) => setApplicantClass(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none bg-white ${
                          !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                        }`}
                      >
                        <option value="Nursery">Nursery / Pre-Primary</option>
                        <option value="KG">Kindergarten (KG)</option>
                        {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((cls) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      disabled={!isAdmissionsOpen}
                      placeholder="parent@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none ${
                        !isAdmissionsOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isAdmissionsOpen || isSubmittingEnquiry}
                    className={`w-full font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md ${
                      isAdmissionsOpen
                        ? 'bg-[#005689] hover:bg-[#003c6e] text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmittingEnquiry ? 'Sending Inquiry...' : isAdmissionsOpen ? 'Submit Application' : 'Admissions Currently Inactive'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmissionConfigModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAdmissionConfigModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {configSuccessMessage ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1.5">Admissions Activated!</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{configSuccessMessage}</p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-[#005689] mb-1">
                  <span className="w-3.5 h-1 bg-amber-400 rounded-full inline-block" />
                  <span>INSTITUTIONAL ADMISSION SETUP</span>
                </div>
                <h3 className="text-xl font-black text-gray-950">Activate Online Admissions</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                  Enter official admission contact details for <strong>{displayName}</strong>.
                </p>

                <form onSubmit={handleSaveAdmissionConfig} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Admission Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Admissions Coordinator"
                      value={admissionContactPerson}
                      onChange={(e) => setAdmissionContactPerson(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Admissions Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admissions@school.edu.in"
                      value={admissionEmail}
                      onChange={(e) => setAdmissionEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Admissions Helpline Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={admissionPhone}
                      onChange={(e) => setAdmissionPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isConfiguringAdmissions}
                    className="w-full font-bold py-2.5 rounded-xl text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{isConfiguringAdmissions ? 'Activating...' : 'Activate Admissions & Save Contact'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {isTourModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsTourModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-gray-950 mb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-600 fill-current" />
              <span>{displayName} Campus Walkthrough</span>
            </h3>

            {campusVideoUrl ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src={campusVideoUrl.includes('watch?v=') ? `https://www.youtube.com/embed/${campusVideoUrl.split('watch?v=')[1]?.split('&')[0]}` : campusVideoUrl}
                  title="School Campus Walkthrough"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-center p-6 text-white">
                <Play className="w-10 h-10 text-[#38BDF8] mb-2 opacity-80" />
                <h4 className="text-base font-bold">Campus Video Walkthrough</h4>
                <p className="text-xs text-slate-300 max-w-md mt-1">
                  Official video tour will be published once verified by the school administration.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isLiveTemplate && (
        <>
          <AddCardModal
            isOpen={isAddFacilityModalOpen}
            onClose={() => {
              setIsAddFacilityModalOpen(false);
              setEditingFacility(null);
            }}
            cardType="facility"
            initialData={editingFacility ? {
              title: editingFacility.title || editingFacility.name || '',
              desc: editingFacility.desc || editingFacility.details || '',
              points: editingFacility.points || editingFacility._raw?.points || [],
              icon: editingFacility.iconName || editingFacility._raw?.icon || (typeof editingFacility.icon === 'string' ? editingFacility.icon : 'TestTubes'),
              illustration: editingFacility.illustration || editingFacility._raw?.illustration,
              badge: editingFacility.badge || editingFacility.category
            } : undefined}
            onSave={(card) => {
              const payload = {
                title: card.title,
                desc: card.desc || card.criteria || 'Standard school facility',
                points: card.points,
                icon: card.icon,
                illustration: card.illustration,
                badge: card.badge
              };
              if (editingFacility) templateCtx?.updateFacilityCard(editingFacility.id, payload);
              else templateCtx?.addFacilityCard(payload);
            }}
          />

          <AddCardModal
            isOpen={isAddAdmissionModalOpen}
            onClose={() => {
              setIsAddAdmissionModalOpen(false);
              setEditingAdmission(null);
            }}
            cardType="admission"
            initialData={editingAdmission ? {
              title: editingAdmission.title || '',
              criteria: editingAdmission.criteria || editingAdmission.desc || '',
              points: editingAdmission.points || editingAdmission._raw?.points || [],
              fees: editingAdmission.fees,
              icon: editingAdmission.icon || 'GraduationCap',
              illustration: editingAdmission.illustration,
              badge: editingAdmission.badge
            } : undefined}
            onSave={(card) => {
              const payload = {
                title: card.title,
                criteria: card.criteria || card.desc || 'Standard admission criteria',
                points: card.points,
                fees: card.fees,
                icon: card.icon,
                illustration: card.illustration,
                badge: card.badge
              };
              if (editingAdmission) templateCtx?.updateAdmissionCard(editingAdmission.id, payload);
              else templateCtx?.addAdmissionCard(payload);
            }}
          />

          <FacultyModal
            isOpen={isFacultyModalOpen}
            onClose={() => {
              setIsFacultyModalOpen(false);
              setEditingFaculty(null);
            }}
            initialData={editingFaculty}
            onSave={(member) => {
              if (editingFaculty) templateCtx?.updateFacultyCard(editingFaculty.id, member);
              else templateCtx?.addFacultyCard(member);
            }}
          />

          <GalleryModal
            isOpen={isGalleryModalOpen}
            onClose={() => setIsGalleryModalOpen(false)}
            onSave={(item) => templateCtx?.addGalleryItem(item)}
          />

          <AwardModal
            isOpen={isAwardModalOpen}
            onClose={() => {
              setIsAwardModalOpen(false);
              setEditingAward(null);
            }}
            initialData={editingAward}
            onSave={(award) => {
              if (editingAward) templateCtx?.updateAwardCard(editingAward.id, award);
              else templateCtx?.addAwardCard(award);
            }}
          />
        </>
      )}

      <ClaimSchoolModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        schoolName={displayName}
        udiseCode={displayUdise}
      />

      <AddSchoolModal
        isOpen={isAddSchoolModalOpen}
        onClose={() => setIsAddSchoolModalOpen(false)}
        defaultUdise={displayUdise}
        defaultSchoolName={displayName}
      />
    </>
  );
}
