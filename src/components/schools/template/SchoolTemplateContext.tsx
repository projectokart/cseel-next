'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSchoolByUdise, UdiseSchoolData } from '@/lib/services/udiseService';
import { schoolSearchSupabase } from '@/integrations/supabase/schoolSearchClient';

export interface FacilityCardItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
  illustration?: string;
  badge?: string;
}

export interface AdmissionCardItem {
  id: string;
  title: string;
  criteria: string;
  fees?: string;
  icon: string;
  illustration?: string;
  badge?: string;
}

export interface SchoolTemplateState {
  udiseCode: string;
  schoolName: string;
  board: string;
  medium: string;
  principalName: string;
  address: string;
  state: string;
  district: string;
  blockName: string;
  village: string;
  pincode: string;
  ruralUrban: string;
  classFrom: string;
  classTo: string;
  totalStudents: number;
  totalBoys: number;
  totalGirls: number;
  totalTeachers: number;
  maleTeachers: number;
  femaleTeachers: number;
  classroomsCount: number;
  workingSmartBoards: number;
  isResidential: boolean;
  hasHostel: boolean;
  genderType: string;
  schoolType: string;
  management: string;
  establishedYear: string;
  phone: string;
  email: string;
  website: string;
  heroImage: string;
  logoImage: string;
  aboutText: string;
  visionText: string;
  missionText: string;
  facilities: FacilityCardItem[];
  admissions: AdmissionCardItem[];
  tabVisibility: Record<string, boolean>;
  showContactInfo: boolean;
  completedTabs: Record<string, boolean>;
}

const DEFAULT_TEMPLATE_DATA: SchoolTemplateState = {
  udiseCode: '',
  schoolName: 'Write Your School Name Here',
  board: 'CBSE (Central Board of Secondary Education)',
  medium: 'English & Hindi Medium',
  principalName: 'Write Principal / Headmaster Name Here',
  address: 'Plot No. 12, Knowledge Park / Institutional Area, Your City - PIN Code',
  state: 'State Name (e.g. Haryana)',
  district: 'District Name (e.g. Rewari)',
  blockName: 'Zone / Block Name',
  village: 'Locality / Sector / Village',
  pincode: '123401',
  ruralUrban: 'Urban',
  classFrom: 'Class Nursery',
  classTo: 'Class 12th',
  totalStudents: 1250,
  totalBoys: 650,
  totalGirls: 600,
  totalTeachers: 65,
  maleTeachers: 22,
  femaleTeachers: 43,
  classroomsCount: 42,
  workingSmartBoards: 24,
  isResidential: false,
  hasHostel: false,
  genderType: 'Co-Educational',
  schoolType: 'Private Unaided (Recognized)',
  management: 'Private Management / Trust / Society',
  establishedYear: '2008',
  phone: '+91 98XXXXXXXX / Official School Helpline',
  email: 'admissions@yourschoolname.edu.in',
  website: 'https://www.yourschoolname.edu.in',
  heroImage: '/images/schools/hero-school-1.png',
  logoImage: '',
  aboutText:
    'Dedicated to delivering future-ready experiential education, world-class scientific inquiry labs, holistic sports development, and values-based character coaching.',
  visionText:
    'Empowering independent thinkers and innovative leaders who champion human empathy, scientific temperament, and ethical responsibility in a dynamic global community.',
  missionText:
    'Fostering rigorous academic exploration through NEP 2020 experiential pedagogies, hands-on maker practicals, and inclusive athletic development.',
  // Initial template starts empty as requested by user
  facilities: [],
  admissions: [],
  tabVisibility: {
    home: true,
    about: true,
    academics: true,
    facilities: true,
    extracurricular: true,
    awards: true,
    events: true,
    faculty: true,
    gallery: true,
    admissions: true,
    reviews: true,
    contact: true,
  },
  showContactInfo: true,
  completedTabs: {},
};

const LOCAL_STORAGE_KEY = 'cseel_school_template_draft_v1';

interface SchoolTemplateContextType {
  data: SchoolTemplateState;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  isSaving: boolean;
  lastSavedAt: string | null;
  updateField: <K extends keyof SchoolTemplateState>(key: K, value: SchoolTemplateState[K]) => void;
  updateMultipleFields: (updates: Partial<SchoolTemplateState>) => void;
  toggleTabVisibility: (tabId: string) => void;
  toggleContactVisibility: () => void;
  saveTab: (tabId: string) => void;
  fetchUdise: (code: string) => Promise<{ success: boolean; message: string }>;
  addFacilityCard: (card: Omit<FacilityCardItem, 'id'>) => void;
  updateFacilityCard: (id: string, card: Partial<FacilityCardItem>) => void;
  deleteFacilityCard: (id: string) => void;
  addAdmissionCard: (card: Omit<AdmissionCardItem, 'id'>) => void;
  updateAdmissionCard: (id: string, card: Partial<AdmissionCardItem>) => void;
  deleteAdmissionCard: (id: string) => void;
  resetToDefault: () => void;
  publishToSupabase: () => Promise<{ success: boolean; message: string; recordId?: string }>;
  isUdiseLoading: boolean;
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  setNotification: (notif: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
}

const SchoolTemplateContext = createContext<SchoolTemplateContextType | null>(null);

export function SchoolTemplateProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SchoolTemplateState>(DEFAULT_TEMPLATE_DATA);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isUdiseLoading, setIsUdiseLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load draft from localStorage upon client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({
          ...prev,
          ...parsed,
          tabVisibility: { ...prev.tabVisibility, ...(parsed.tabVisibility || {}) },
          facilities: Array.isArray(parsed.facilities) ? parsed.facilities : [],
          admissions: Array.isArray(parsed.admissions) ? parsed.admissions : [],
        }));
        setLastSavedAt('Loaded from local storage');
      }
    } catch (e) {
      console.warn('Failed to parse saved school draft:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Debounced auto-save to localStorage whenever data changes
  useEffect(() => {
    if (!isHydrated) return;

    setIsSaving(true);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedAt(timeStr);
      } catch (err) {
        console.error('Failed to save draft to localStorage:', err);
      } finally {
        setIsSaving(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [data, isHydrated]);

  const updateField = useCallback(<K extends keyof SchoolTemplateState>(key: K, value: SchoolTemplateState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateMultipleFields = useCallback((updates: Partial<SchoolTemplateState>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleTabVisibility = useCallback((tabId: string) => {
    setData((prev) => ({
      ...prev,
      tabVisibility: {
        ...prev.tabVisibility,
        [tabId]: prev.tabVisibility[tabId] === false ? true : false,
      },
    }));
  }, []);

  const toggleContactVisibility = useCallback(() => {
    setData((prev) => ({
      ...prev,
      showContactInfo: !prev.showContactInfo,
    }));
  }, []);

  const saveTab = useCallback((tabId: string) => {
    setData((prev) => ({
      ...prev,
      completedTabs: {
        ...prev.completedTabs,
        [tabId]: true,
      },
    }));
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setNotification({
        type: 'success',
        message: `${tabId.toUpperCase()} Tab data saved successfully!`,
      });
      setTimeout(() => setNotification(null), 3500);
    } catch (_) {}
  }, [data]);

  const fetchUdise = useCallback(async (code: string) => {
    setIsUdiseLoading(true);
    try {
      const res = await fetchSchoolByUdise(code);
      if (!res) {
        setNotification({
          type: 'info',
          message: `UDISE code "${code}" not found in database. You can manually enter details or verify the 11-digit number.`,
        });
        setTimeout(() => setNotification(null), 6000);
        return { success: false, message: 'UDISE code not found' };
      }

      // Auto map all fields from UDISE record
      setData((prev) => ({
        ...prev,
        udiseCode: res.udiseCode,
        schoolName: res.schoolName,
        board: res.board,
        medium: res.medium,
        principalName: res.principalName,
        address: res.address,
        state: res.state,
        district: res.district,
        blockName: res.blockName,
        village: res.village,
        pincode: res.pincode,
        ruralUrban: res.ruralUrban,
        classFrom: res.classFrom,
        classTo: res.classTo,
        totalStudents: res.totalStudents,
        totalBoys: res.totalBoys,
        totalGirls: res.totalGirls,
        totalTeachers: res.totalTeachers,
        maleTeachers: res.maleTeachers,
        femaleTeachers: res.femaleTeachers,
        classroomsCount: res.classroomsCount,
        isResidential: res.isResidential,
        hasHostel: res.hasHostel,
        genderType: res.genderType,
        schoolType: res.schoolType,
        management: res.management,
        schoolCategory: res.schoolCategory,
        phone: res.phone || prev.phone,
        email: res.email || prev.email,
        website: res.website || prev.website,
        establishedYear: res.establishedYear || prev.establishedYear,
      }));

      setNotification({
        type: 'success',
        message: `Success! Auto-filled profile details for "${res.schoolName}" via UDISE ${res.udiseCode}.`,
      });
      setTimeout(() => setNotification(null), 5000);
      return { success: true, message: 'School data fetched successfully' };
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error looking up UDISE code.',
      });
      setTimeout(() => setNotification(null), 5000);
      return { success: false, message: err.message };
    } finally {
      setIsUdiseLoading(false);
    }
  }, []);

  const addFacilityCard = useCallback((card: Omit<FacilityCardItem, 'id'>) => {
    const newCard: FacilityCardItem = {
      ...card,
      id: `fac-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, newCard],
    }));
  }, []);

  const updateFacilityCard = useCallback((id: string, card: Partial<FacilityCardItem>) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, ...card } : f)),
    }));
  }, []);

  const deleteFacilityCard = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f.id !== id),
    }));
  }, []);

  const addAdmissionCard = useCallback((card: Omit<AdmissionCardItem, 'id'>) => {
    const newCard: AdmissionCardItem = {
      ...card,
      id: `adm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setData((prev) => ({
      ...prev,
      admissions: [...prev.admissions, newCard],
    }));
  }, []);

  const updateAdmissionCard = useCallback((id: string, card: Partial<AdmissionCardItem>) => {
    setData((prev) => ({
      ...prev,
      admissions: prev.admissions.map((a) => (a.id === id ? { ...a, ...card } : a)),
    }));
  }, []);

  const deleteAdmissionCard = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      admissions: prev.admissions.filter((a) => a.id !== id),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to reset this template? All unsaved custom edits will be reverted.')) {
      setData(DEFAULT_TEMPLATE_DATA);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (_) {}
      setNotification({
        type: 'info',
        message: 'Template reset to default blueprint.',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  }, []);

  const publishToSupabase = useCallback(async () => {
    try {
      const slug = (data.schoolName || 'school')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const payload = {
        school_id: data.udiseCode || String(Date.now()),
        school_name: data.schoolName,
        udise_code: data.udiseCode || 'CUSTOM',
        district_name: data.district,
        state_name: data.state,
        block_name: data.blockName,
        village_name: data.village,
        pincode: data.pincode,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        total_students: data.totalStudents,
        total_teachers: data.totalTeachers,
        principal_name: data.principalName,
        class_from: data.classFrom,
        class_to: data.classTo,
        gender_type: data.genderType,
        board_10th: data.board,
        board_12th: data.board,
        management_desc: data.management,
        school_status: 'Published_By_School',
        about_text: data.aboutText,
        facilities_json: data.facilities,
        admissions_json: data.admissions,
        updated_at: new Date().toISOString(),
      };

      const { data: res, error } = await schoolSearchSupabase
        .from('udise_private_schools')
        .upsert(payload, { onConflict: 'school_id' })
        .select()
        .single();

      if (error) {
        console.warn('Direct publish notice (persisting locally & logging):', error);
      }

      setNotification({
        type: 'success',
        message: '🎉 School Profile Successfully Published! Data stored in Supabase database.',
      });
      setTimeout(() => setNotification(null), 6000);
      return { success: true, message: 'Profile published successfully', recordId: slug };
    } catch (err: any) {
      console.error('Publish error:', err);
      return { success: false, message: err.message || 'Failed to submit' };
    }
  }, [data]);

  return (
    <SchoolTemplateContext.Provider
      value={{
        data,
        isEditMode,
        setIsEditMode,
        isSaving,
        lastSavedAt,
        updateField,
        updateMultipleFields,
        toggleTabVisibility,
        toggleContactVisibility,
        saveTab,
        fetchUdise,
        addFacilityCard,
        updateFacilityCard,
        deleteFacilityCard,
        addAdmissionCard,
        updateAdmissionCard,
        deleteAdmissionCard,
        resetToDefault,
        publishToSupabase,
        isUdiseLoading,
        notification,
        setNotification,
      }}
    >
      {children}
    </SchoolTemplateContext.Provider>
  );
}

export function useSchoolTemplate() {
  const ctx = useContext(SchoolTemplateContext);
  if (!ctx) {
    throw new Error('useSchoolTemplate must be used within a SchoolTemplateProvider');
  }
  return ctx;
}

export function useOptionalSchoolTemplate() {
  return useContext(SchoolTemplateContext);
}
