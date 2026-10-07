'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  FileCode,
  Upload,
  Eye,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowLeft,
  RefreshCw,
  Printer,
  Compass,
  FileText,
  Clock,
  Heart,
  Share2,
  Check,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExperimentItem, ExperimentSection, SubjectSlug, GradeLevel, DifficultyLevel, SafetyLevel } from '@/types/experiment';
import { ExperimentsStorageService } from '@/services/experimentsStorage';
import WordToolbar from '@/components/experiments/WordToolbar';
import MaterialSectionEditor from '@/components/experiments/MaterialSectionEditor';
import PrecautionsSectionEditor from '@/components/experiments/PrecautionsSectionEditor';
import TheorySectionEditor from '@/components/experiments/TheorySectionEditor';
import FormulaSectionEditor from '@/components/experiments/FormulaSectionEditor';
import ProcedureSectionEditor from '@/components/experiments/ProcedureSectionEditor';
import ObservationSectionEditor from '@/components/experiments/ObservationSectionEditor';
import VideoSectionEditor from '@/components/experiments/VideoSectionEditor';
import GallerySectionEditor from '@/components/experiments/GallerySectionEditor';
import CustomSectionEditor from '@/components/experiments/CustomSectionEditor';
import FaqSectionEditor from '@/components/experiments/FaqSectionEditor';
import SetupSectionEditor from '@/components/experiments/SetupSectionEditor';
import HistorySectionEditor from '@/components/experiments/HistorySectionEditor';
import ApplicationsSectionEditor from '@/components/experiments/ApplicationsSectionEditor';
import SinglePageDocumentView from '@/components/experiments/SinglePageDocumentView';
import { slugifyExperimentTitle } from '@/data/subjectActivitiesData';

const ALL_SUBJECTS = [
  { slug: 'all', name: 'All Subjects' },
  { slug: 'chemistry', name: 'Chemistry' },
  { slug: 'physics', name: 'Physics' },
  { slug: 'biology', name: 'Biology' },
  { slug: 'mathematics', name: 'Mathematics' },
  { slug: 'technology', name: 'Technology' },
  { slug: 'engineering', name: 'Engineering' },
  { slug: 'art', name: 'Art & Design' },
];

export const ExperimentsAdminModule: React.FC = () => {
  const [experiments, setExperiments] = useState<ExperimentItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');

  // View mode: 'list' | 'editor' | 'preview'
  const [viewMode, setViewMode] = useState<'list' | 'editor' | 'preview'>('list');
  const [activeExperiment, setActiveExperiment] = useState<ExperimentItem | null>(null);

  // Modals
  const [bulkAddModalOpen, setBulkAddModalOpen] = useState(false);
  const [bulkAddJson, setBulkAddJson] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [isMetaCollapsed, setIsMetaCollapsed] = useState(true);
  const lastSavedJsonRef = useRef<string>('');

  // Load experiments on mount
  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = () => {
    const list = ExperimentsStorageService.getExperiments();
    setExperiments(list);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Google Docs Style Debounced Auto-Save to localStorage
  useEffect(() => {
    if (!activeExperiment || viewMode !== 'editor') {
      setAutoSaveStatus('idle');
      return;
    }

    const currentJson = JSON.stringify(activeExperiment);
    // Don't auto-save if identical to last saved snapshot
    if (!lastSavedJsonRef.current) {
      lastSavedJsonRef.current = currentJson;
      return;
    }
    if (lastSavedJsonRef.current === currentJson) {
      return;
    }

    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        ExperimentsStorageService.saveExperiment(activeExperiment);
        lastSavedJsonRef.current = JSON.stringify(activeExperiment);
        const updatedList = ExperimentsStorageService.getExperiments();
        setExperiments(updatedList);
        setAutoSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save error', err);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [activeExperiment, viewMode]);

  // Filtered experiments
  const filteredExperiments = useMemo(() => {
    return experiments.filter((item) => {
      const matchSubject =
        selectedSubject === 'all' || item.subjectSlug.toLowerCase() === selectedSubject.toLowerCase();
      const matchGrade = selectedGrade === 'all' || item.gradeLevel === selectedGrade;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchSubject && matchGrade && matchStatus && matchQuery;
    });
  }, [experiments, selectedSubject, selectedGrade, selectedStatus, searchQuery]);

  // Create New Experiment
  const handleCreateNew = () => {
    const newId = `exp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const newExp: ExperimentItem = {
      id: newId,
      title: 'Untitled Practical Experiment',
      subtitle: 'State the aim, expected scientific outcome, and syllabus mapping',
      subjectSlug: selectedSubject !== 'all' ? selectedSubject : 'chemistry',
      subjectName: selectedSubject !== 'all' ? selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1) : 'Chemistry',
      category: 'General Practical Science',
      gradeLevel: 'Middle (6-8)',
      difficulty: 'Beginner',
      duration: '30 Mins',
      safetyLevel: 'Safe for Home',
      status: 'draft',
      tags: ['Hands-on', 'STEM', 'NEP 2020'],
      badge: 'NEP 2020 • EXPERIENTIAL SCIENCE',
      heroImage: '/images/categories/chemistry-card-1.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: `sec-mat-${Date.now()}`,
          type: 'materials',
          title: 'Materials & Apparatus Required',
          order: 1,
          isEnabled: true,
          isCollapsed: true,
          columns: [
            { id: 'c1', key: 'name', label: 'Item / Reagent Name', type: 'text' },
            { id: 'c2', key: 'image', label: 'Item Image / Icon', type: 'image' },
            { id: 'c3', key: 'buyLink', label: 'Buy Link / Source', type: 'link' },
            { id: 'c4', key: 'quantity', label: 'Quantity', type: 'text' },
            { id: 'c5', key: 'spec', label: 'Specification / Grade', type: 'text' },
          ],
          rows: [
            { id: 'r1', name: 'Sample Reagent / Apparatus', image: '', buyLink: '', quantity: '1 Unit', spec: 'Standard Grade' },
          ],
        },
        {
          id: `sec-prec-${Date.now()}`,
          type: 'precautions',
          title: 'Safety Precautions & Guidelines',
          order: 2,
          isEnabled: true,
          isCollapsed: true,
          safetyLevel: 'Safe for Home',
          ppeRequired: ['Safety Goggles', 'Nitrile Gloves'],
          warnings: [
            {
              id: 'w1',
              type: 'caution',
              title: 'General Safety Instruction',
              text: 'Ensure bench is clean and ventilated before commencing trial.',
            },
          ],
        },
        {
          id: `sec-theo-${Date.now()}`,
          type: 'theory',
          title: 'Scientific Principle & Background Theory',
          order: 3,
          isEnabled: true,
          isCollapsed: true,
          headingLevel: 'h2',
          alignment: 'left',
          content: 'Describe the governing scientific principle, chemical formula, or physical law here.',
        },
        {
          id: `sec-proc-${Date.now()}`,
          type: 'procedure',
          title: 'Step-by-Step Methodology',
          order: 4,
          isEnabled: true,
          isCollapsed: true,
          steps: [
            {
              id: 's1',
              stepNumber: 1,
              title: 'Preparation',
              instruction: 'Assemble apparatus in accordance with diagram.',
              duration: '5 Mins',
            },
          ],
        },
        {
          id: `sec-obs-${Date.now()}`,
          type: 'observation',
          title: 'Observations & Experimental Results',
          order: 5,
          isEnabled: true,
          isCollapsed: true,
          columns: [
            { id: 'oc1', key: 'trial', label: 'Trial #' },
            { id: 'oc2', key: 'reading', label: 'Observed Value' },
            { id: 'oc3', key: 'calc', label: 'Calculated Parameter' },
          ],
          rows: [
            { trial: 'Trial 1', reading: '-', calc: '-' },
          ],
          inference: 'State the final deduction from observed values.',
        },
      ],
    };

    setIsMetaCollapsed(true);
    ExperimentsStorageService.saveExperiment(newExp);
    loadExperiments();
    setActiveExperiment(newExp);
    lastSavedJsonRef.current = JSON.stringify(newExp);
    setAutoSaveStatus('saved');
    setViewMode('editor');
  };

  // Open Edit
  const handleEdit = (exp: ExperimentItem) => {
    const clone = JSON.parse(JSON.stringify(exp));
    clone.sections = (clone.sections || []).map((s: any) => ({ ...s, isCollapsed: true }));
    setIsMetaCollapsed(true);
    setActiveExperiment(clone);
    lastSavedJsonRef.current = JSON.stringify(clone);
    setAutoSaveStatus('saved');
    setViewMode('editor');
  };

  // Preview Document
  const handlePreviewDoc = (exp: ExperimentItem) => {
    setActiveExperiment(exp);
    setViewMode('preview');
  };

  // Delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this experiment?')) {
      ExperimentsStorageService.deleteExperiment(id);
      loadExperiments();
      showToast('Experiment deleted successfully.');
    }
  };

  // Duplicate
  const handleDuplicate = (id: string) => {
    const dup = ExperimentsStorageService.duplicateExperiment(id);
    if (dup) {
      loadExperiments();
      showToast(`Duplicated: ${dup.title}`);
    }
  };

  // Save Experiment
  const handleSave = () => {
    if (!activeExperiment) return;
    setIsSaving(true);
    try {
      ExperimentsStorageService.saveExperiment(activeExperiment);
      lastSavedJsonRef.current = JSON.stringify(activeExperiment);
      loadExperiments();
      setAutoSaveStatus('saved');
      showToast('Experiment saved successfully.');
    } catch (e: any) {
      alert(`Save error: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Add Section to Active Experiment
  const handleAddSection = (type: ExperimentSection['type']) => {
    if (!activeExperiment) return;
    const now = Date.now();
    let newSec: ExperimentSection;

    if (type === 'materials') {
      newSec = {
        id: `sec-mat-${now}`,
        type: 'materials',
        title: 'Materials & Apparatus Required',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        columns: [
          { id: 'c1', key: 'name', label: 'Item / Reagent Name', type: 'text' },
          { id: 'c2', key: 'image', label: 'Item Image / Icon', type: 'image' },
          { id: 'c3', key: 'buyLink', label: 'Buy Link / Source', type: 'link' },
          { id: 'c4', key: 'quantity', label: 'Quantity', type: 'text' },
          { id: 'c5', key: 'spec', label: 'Specification / Grade', type: 'text' },
        ],
        rows: [
          { id: 'r1', name: 'New Chemical / Equipment', image: '', buyLink: '', quantity: '1 Unit', spec: 'Analytical Grade' },
        ],
      };
    } else if (type === 'precautions') {
      newSec = {
        id: `sec-prec-${now}`,
        type: 'precautions',
        title: 'Safety Precautions & Guidelines',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        safetyLevel: activeExperiment.safetyLevel || 'Safe for Home',
        ppeRequired: ['Safety Goggles', 'Nitrile Gloves', 'Lab Coat'],
        warnings: [
          {
            id: 'w1',
            type: 'caution',
            title: 'Cautionary Advisory',
            text: 'Handle reagents with appropriate lab gear.',
          },
        ],
      };
    } else if (type === 'theory') {
      newSec = {
        id: `sec-theo-${now}`,
        type: 'theory',
        title: 'Scientific Principle & Background Theory',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        headingLevel: 'h2',
        alignment: 'left',
        content: 'Explain theoretical mechanisms, reaction pathways, or physical constants here.',
      };
    } else if (type === 'math_formula') {
      newSec = {
        id: `sec-math-${now}`,
        type: 'math_formula',
        title: 'Mathematical & Chemical Formulations',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        formulas: [
          {
            id: 'f1',
            label: 'Governing Formula',
            latex: 'E = m \\cdot c^2',
            explanation: 'Mass-energy equivalence formulation.',
          },
        ],
      };
    } else if (type === 'procedure') {
      newSec = {
        id: `sec-proc-${now}`,
        type: 'procedure',
        title: 'Experimental Procedure & Methodology',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        steps: [
          {
            id: 'st1',
            stepNumber: 1,
            title: 'Initial Setup',
            instruction: 'Calibrate instruments and position safety basin.',
            duration: '5 Mins',
          },
        ],
      };
    } else if (type === 'observation') {
      newSec = {
        id: `sec-obs-${now}`,
        type: 'observation',
        title: 'Observation Data & Inference',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        columns: [
          { id: 'c1', key: 'parameter', label: 'Measured Parameter' },
          { id: 'c2', key: 'reading1', label: 'Reading 1' },
          { id: 'c3', key: 'reading2', label: 'Reading 2' },
          { id: 'c4', key: 'average', label: 'Mean Value' },
        ],
        rows: [
          { parameter: 'Sample 1', reading1: '-', reading2: '-', average: '-' },
        ],
        inference: 'Hypothesis verified with experimental precision.',
      };
    } else if (type === 'video') {
      newSec = {
        id: `sec-vid-${now}`,
        type: 'video',
        title: 'Demonstration Video',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        videoUrl: 'https://www.youtube.com/watch?v=28rAN41mCDk',
        caption: 'High-speed lab capture of the experiment process.',
        provider: 'youtube',
      };
    } else if (type === 'gallery') {
      newSec = {
        id: `sec-gal-${now}`,
        type: 'gallery',
        title: 'Apparatus Visual Gallery',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        displayMode: 'slider',
        images: [
          {
            id: 'g1',
            url: '/images/categories/chemistry.jpg',
            title: 'Laboratory Setup',
            caption: 'High-purity glass reaction vessel.',
          },
        ],
      };
    } else if (type === 'faq') {
      newSec = {
        id: `sec-faq-${now}`,
        type: 'faq',
        title: 'Frequently Asked Questions & Concept Clarifications',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        faqs: [
          {
            id: `faq-1`,
            q: 'What is the primary scientific principle underlying this experiment?',
            a: 'This experiment investigates fundamental phenomena through systematic quantitative observation and empirical measurement.',
          },
          {
            id: `faq-2`,
            q: 'How should anomalies in recorded trial data be treated?',
            a: 'Repeat the measurement under verified calibration parameters and document any systematic deviations in the error analysis section.',
          },
        ],
      };
    } else if (type === 'setup') {
      newSec = {
        id: `sec-setup-${now}`,
        type: 'setup',
        title: 'Experimental Apparatus Setup & Schematic',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        description: 'Apparatus configuration, powder layering hierarchy, and ignition fuse placement.',
        diagramImage: '/images/experiments/microscale-thermite-setup.jpg',
        diagramCaption: 'Fig. 1 The prepared setup: fuse, ignition mix and thermite mix in cone',
        setupInstructions: [
          'Clear bench of combustibles and cover desk with heat-resistant mats.',
          'Fill tin with sand to ~3 cm depth and embed the filter-paper cone.',
          'Dispense thermite and ignition mixture in layered depression.',
        ],
        annotations: [
          { label: 'Layer 1: Base Tin', description: 'Seat in sand to absorb intense exothermic thermal dissipation.' },
          { label: 'Layer 2: Fuse Ribbon', description: 'Feather magnesium ribbon tip for reliable Bunsen ignition.' },
        ],
      };
    } else if (type === 'history') {
      newSec = {
        id: `sec-hist-${now}`,
        type: 'history',
        title: 'Historical Discovery & Scientific Genesis',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        discoveredBy: 'Hans Goldschmidt (German Chemist)',
        discoveryYear: '1893 (Patented 1895)',
        summary: 'Originally developed to produce carbon-free metals, quickly revolutionizing railway track welding.',
        narrative: 'In 1893, German chemist Hans Goldschmidt discovered that the exothermic reaction between metal oxides and aluminium could be initiated without heating the entire mass...',
        image: '/images/categories/chemistry.jpg',
        imageCaption: 'Historical metallothermic crucible apparatus demonstration',
        milestones: [
          {
            year: '1893',
            scientist: 'Hans Goldschmidt',
            title: 'Invention of the Goldschmidt Reaction',
            description: 'Discovered aluminothermic reduction of iron oxide.',
          },
          {
            year: '1899',
            scientist: 'Essen Steelworks',
            title: 'First Continuous Welded Railway Rail',
            description: 'Thermite process adopted for in-situ rail joint fusion.',
          },
        ],
      };
    } else if (type === 'applications') {
      newSec = {
        id: `sec-app-${now}`,
        type: 'applications',
        title: 'Real-World Applications & Translational Technologies',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        description: 'Translational industrial engineering, railway metallurgy, pyrotechnics, and defense applications.',
        applications: [
          {
            id: `app-rail-${now}`,
            title: 'In-Situ Railway Track Welding',
            content: 'Continuous Welded Rail (CWR) systems utilize aluminothermic reactions to seamlessly fuse high-carbon steel track joints on-site at over 2500°C.',
            image: '/images/categories/engineering.jpg',
            imageCaption: 'Heavy-rail thermite welding casting crucible',
            externalLink: 'https://en.wikipedia.org/wiki/Exothermic_welding',
            linkText: 'Learn Railway Welding Standards',
            subsections: [
              {
                id: `app-rail-sub-${now}`,
                title: 'High-Speed Rail Tolerances',
                content: 'Smooth joint fusion prevents mechanical wheel flutter and track degradation at speeds exceeding 300 km/h.',
              },
            ],
          },
        ],
      };
    } else {
      // Custom section
      newSec = {
        id: `sec-cust-${now}`,
        type: 'custom',
        title: 'Viva Voce & Knowledge Check',
        order: activeExperiment.sections.length + 1,
        isEnabled: true,
        icon: 'Sparkles',
        content: '1. What role does the catalyst play in lowering activation energy?\n2. Why is thermal dissipation necessary during the reaction?',
      };
    }

    setActiveExperiment({
      ...activeExperiment,
      sections: [...activeExperiment.sections, newSec],
    });
    showToast(`Added ${newSec.title}`);
  };

  // Update Section in active experiment
  const handleUpdateSection = (index: number, updated: ExperimentSection) => {
    if (!activeExperiment) return;
    const copy = [...activeExperiment.sections];
    copy[index] = updated;
    setActiveExperiment({ ...activeExperiment, sections: copy });
  };

  // Move Section
  const handleMoveSection = (index: number, dir: 'up' | 'down') => {
    if (!activeExperiment) return;
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= activeExperiment.sections.length) return;
    const copy = [...activeExperiment.sections];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setActiveExperiment({ ...activeExperiment, sections: copy });
  };

  // Delete Section
  const handleDeleteSection = (index: number) => {
    if (!activeExperiment) return;
    const copy = activeExperiment.sections.filter((_, idx) => idx !== index);
    setActiveExperiment({ ...activeExperiment, sections: copy });
  };

  // Collapse or Expand All Sections
  const handleToggleAllSectionsCollapse = (collapsed: boolean) => {
    if (!activeExperiment) return;
    const updated = activeExperiment.sections.map((s) => ({
      ...s,
      isCollapsed: collapsed,
    }));
    setActiveExperiment({ ...activeExperiment, sections: updated });
    showToast(collapsed ? 'Collapsed all sections.' : 'Expanded all sections.');
  };

  // Export handlers
  const handleExportExcel = () => {
    ExperimentsStorageService.exportToExcel();
    showToast('Exported experiments to Excel (.xlsx)');
  };

  const handleExportJson = () => {
    const jsonStr = ExperimentsStorageService.exportToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cseel_experiments_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Downloaded JSON backup.');
  };

  // Import handler
  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const res = ExperimentsStorageService.importFromJSON(importJsonText);
    if (res.success) {
      loadExperiments();
      setImportModalOpen(false);
      setImportJsonText('');
      showToast(`Successfully imported ${res.count} experiment(s).`);
    } else {
      alert(`Import error: ${res.error}`);
    }
  };

  // Bulk Add handler
  const handleBulkAddSubmit = () => {
    if (!bulkAddJson.trim()) return;
    try {
      const parsed = JSON.parse(bulkAddJson);
      if (!Array.isArray(parsed)) {
        alert('JSON must be an array of experiment objects.');
        return;
      }
      ExperimentsStorageService.bulkAdd(parsed);
      loadExperiments();
      setBulkAddModalOpen(false);
      setBulkAddJson('');
      showToast(`Bulk added ${parsed.length} experiments.`);
    } catch (e: any) {
      alert(`Invalid JSON format: ${e.message}`);
    }
  };

  return (
    <div className="experiments-admin-container space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001d35] text-white px-4 py-2.5 rounded-xl shadow-xl border border-blue-400/30 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW MODE 1: EXPERIMENTS LIST VIEW
         ══════════════════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Top Headline & Quick Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#dadce0]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#005689] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                  Curriculum &amp; Hands-on Laboratory Studio
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {experiments.length} Experiments in Catalog
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Experiment Management Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Add, organize, and edit structured laboratory practicals for any subject with modular sections and single-page publishing.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-2xs transition-all"
                title="Export entire experiments catalog to Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export Excel</span>
              </button>

              <button
                type="button"
                onClick={() => setImportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-blue-50 text-[#005689] border border-blue-300 rounded-xl text-xs font-bold shadow-2xs transition-all"
                title="Import JSON backup file or array"
              >
                <Upload className="w-4 h-4 text-[#005689]" />
                <span>Import</span>
              </button>

              <button
                type="button"
                onClick={() => setBulkAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-purple-50 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold shadow-2xs transition-all"
                title="Bulk Add multiple experiments from JSON template"
              >
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Bulk Add</span>
              </button>

              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#005689] hover:bg-[#003c6e] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>New Experiment</span>
              </button>
            </div>
          </div>

          {/* Filter Bar (Subject Chips, Grade, Search) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            {/* Subject Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {ALL_SUBJECTS.map((sub) => {
                const isSelected = selectedSubject === sub.slug;
                const count =
                  sub.slug === 'all'
                    ? experiments.length
                    : experiments.filter((e) => e.subjectSlug.toLowerCase() === sub.slug).length;

                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => setSelectedSubject(sub.slug)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#005689] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Secondary Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search experiments by title, keywords, topics, or curriculum tags..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005689]"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
                >
                  <option value="all">All Grades</option>
                  <option value="Primary (1-5)">Primary (1-5)</option>
                  <option value="Middle (6-8)">Middle (6-8)</option>
                  <option value="Secondary (9-10)">Secondary (9-10)</option>
                  <option value="Senior Sec (11-12)">Senior Sec (11-12)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
                >
                  <option value="all">All Statuses (Live &amp; Draft)</option>
                  <option value="published">Published Live</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experiments Card List with Generous Gap & Thumbnails */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#005689]" />
                <span>Showing {filteredExperiments.length} Curriculum Experiment Practicals</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Click &apos;Edit Studio&apos; to write content or &apos;Document View&apos; to view continuous publication
              </span>
            </div>

            {filteredExperiments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#005689] flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">No experiments found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No activities match the selected subject or search query. Click &quot;New Experiment&quot; to create one.
                </p>
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-[#005689] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  + Create First Experiment
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredExperiments.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white rounded-xl border border-slate-200/90 hover:border-[#005689]/40 shadow-2xs hover:shadow-xs transition-all p-3 sm:px-4 sm:py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 group"
                  >
                    {/* Left: Compact Thumbnail + Metadata */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                      {/* Compact Rounded Thumbnail */}
                      <div className="relative w-full sm:w-28 sm:h-20 h-28 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 group-hover:border-[#005689]/30 transition-all shadow-2xs">
                        <img
                          src={exp.heroImage || '/images/categories/chemistry-card-1.jpg'}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/categories/chemistry-card-1.jpg';
                          }}
                        />
                        {/* Subject badge on image */}
                        <div className="absolute top-1 left-1">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-white/95 text-[#005689] shadow-2xs border border-blue-200/60 backdrop-blur-xs">
                            {exp.subjectName}
                          </span>
                        </div>
                        {/* Duration overlay */}
                        <div className="absolute bottom-1 right-1">
                          <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[#001d35]/85 text-white backdrop-blur-xs flex items-center gap-0.5 shadow-2xs">
                            <Clock className="w-2.5 h-2.5 text-cyan-300" />
                            <span>{exp.duration}</span>
                          </span>
                        </div>
                      </div>

                      {/* Center Text Details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        {/* Category, Grade, Status Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                            {exp.category}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="text-slate-500 font-medium">
                            {exp.gradeLevel}
                          </span>
                          <span className="text-slate-300">&bull;</span>
                          {exp.status === 'published' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Draft
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#005689] transition-colors leading-tight truncate">
                          {exp.title}
                        </h3>

                        {/* Subtitle / Aim */}
                        <p className="text-xs text-slate-500 line-clamp-1 leading-normal">
                          {exp.subtitle || 'State the aim, expected scientific outcome, and syllabus mapping'}
                        </p>

                        {/* Meta Footer */}
                        <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-slate-400 pt-0.5 border-t border-slate-100/80">
                          <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                            <Layers className="w-3 h-3 text-[#005689]" />
                            <span>{exp.sections.length} sections</span>
                          </span>
                          <span>&bull;</span>
                          <span className="font-mono text-slate-500">ID: {exp.id}</span>
                          <span>&bull;</span>
                          <span>Updated: {new Date(exp.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions Block */}
                    <div className="flex items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                      {/* Public Live Page Link */}
                      <Link
                        href={`/experiments/${slugifyExperimentTitle(exp.title) || exp.id}`}
                        target="_blank"
                        className="p-1.5 text-slate-500 hover:text-[#005689] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                        title="View Live Public Experiment Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {/* Single Page Document Preview */}
                      <button
                        type="button"
                        onClick={() => handlePreviewDoc(exp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                        title="View continuous single-page document publication"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#005689]" />
                        <span className="hidden sm:inline">Document View</span>
                      </button>

                      {/* Studio Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleEdit(exp)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#005689] hover:bg-[#003c6e] text-white rounded-lg text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-98"
                        title="Open Modular Word-Style Studio Editor"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Studio</span>
                      </button>

                      {/* Duplicate */}
                      <button
                        type="button"
                        onClick={() => handleDuplicate(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                        title="Duplicate Experiment"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        title="Delete Experiment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW MODE 2: STUDIO WORD-LIKE MODULAR EDITOR
         ══════════════════════════════════════════════════════════ */}
      {viewMode === 'editor' && activeExperiment && (
        <div className="space-y-6">
          {/* Microsoft Word Style Ribbon Toolbar (Sticky Flush to top with Dark Executive Contrast) */}
          <WordToolbar
            onAddSection={handleAddSection}
            onSave={handleSave}
            onTogglePreview={() => setViewMode('preview')}
            isPreviewMode={false}
            onExportExcel={handleExportExcel}
            onExportJson={handleExportJson}
            onImportJson={() => setImportModalOpen(true)}
            onPrint={() => window.print()}
            isSaving={isSaving}
            autoSaveStatus={autoSaveStatus}
            onBack={() => setViewMode('list')}
            activeId={activeExperiment.id}
          />

          {/* Experiment Core Metadata Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#005689]" />
                  <span>Experiment Identity &amp; Curriculum Metadata</span>
                </h2>
                {isMetaCollapsed && (
                  <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">{activeExperiment.title || 'Untitled'}</span>
                    <span>•</span>
                    <span className="capitalize">{activeExperiment.subjectSlug}</span>
                    <span>•</span>
                    <span>{activeExperiment.duration}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Publication Status:</label>
                <select
                  value={activeExperiment.status}
                  onChange={(e) =>
                    setActiveExperiment({
                      ...activeExperiment,
                      status: e.target.value as any,
                    })
                  }
                  className={`text-xs font-bold px-3 py-1 rounded-lg border focus:outline-none ${
                    activeExperiment.status === 'published'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Live Catalog)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsMetaCollapsed(!isMetaCollapsed)}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors ml-1"
                  title={isMetaCollapsed ? 'Expand Metadata' : 'Collapse Metadata'}
                >
                  {isMetaCollapsed ? (
                    <>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      <span>Expand</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      <span>Collapse</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {!isMetaCollapsed && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
              {/* Title */}
              <div className="sm:col-span-8">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Experiment Title:
                </label>
                <input
                  type="text"
                  value={activeExperiment.title}
                  onChange={(e) =>
                    setActiveExperiment({ ...activeExperiment, title: e.target.value })
                  }
                  placeholder="e.g. Precision Simple Harmonic Pendulum Oscillation"
                  className="w-full text-sm font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005689]"
                />
              </div>

              {/* Subject */}
              <div className="sm:col-span-4">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subject Pillar:
                </label>
                <select
                  value={activeExperiment.subjectSlug}
                  onChange={(e) => {
                    const slug = e.target.value;
                    const found = ALL_SUBJECTS.find((s) => s.slug === slug);
                    setActiveExperiment({
                      ...activeExperiment,
                      subjectSlug: slug,
                      subjectName: found ? found.name : slug.charAt(0).toUpperCase() + slug.slice(1),
                    });
                  }}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="chemistry">Chemistry</option>
                  <option value="physics">Physics</option>
                  <option value="biology">Biology</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="technology">Technology</option>
                  <option value="engineering">Engineering</option>
                  <option value="art">Art &amp; Design</option>
                  <option value="science">General Science</option>
                </select>
              </div>

              {/* Subtitle / Aim */}
              <div className="sm:col-span-8">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Subtitle / Stated Aim:
                </label>
                <input
                  type="text"
                  value={activeExperiment.subtitle}
                  onChange={(e) =>
                    setActiveExperiment({ ...activeExperiment, subtitle: e.target.value })
                  }
                  placeholder="e.g. Determine Local Gravitational Acceleration g using Isochronous Oscillation"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              {/* Category / Sub-branch */}
              <div className="sm:col-span-4">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Academic Sub-Branch:
                </label>
                <input
                  type="text"
                  value={activeExperiment.category}
                  onChange={(e) =>
                    setActiveExperiment({ ...activeExperiment, category: e.target.value })
                  }
                  placeholder="e.g. Classical Mechanics & Gravitation"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              {/* Grade Level */}
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Grade Band:
                </label>
                <select
                  value={activeExperiment.gradeLevel}
                  onChange={(e) =>
                    setActiveExperiment({
                      ...activeExperiment,
                      gradeLevel: e.target.value as GradeLevel,
                    })
                  }
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Primary (1-5)">Primary (1-5)</option>
                  <option value="Middle (6-8)">Middle (6-8)</option>
                  <option value="Secondary (9-10)">Secondary (9-10)</option>
                  <option value="Senior Sec (11-12)">Senior Sec (11-12)</option>
                  <option value="Higher Ed">Higher Ed</option>
                  <option value="All Grades">All Grades</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Difficulty Level:
                </label>
                <select
                  value={activeExperiment.difficulty}
                  onChange={(e) =>
                    setActiveExperiment({
                      ...activeExperiment,
                      difficulty: e.target.value as DifficultyLevel,
                    })
                  }
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Duration */}
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lab Duration:
                </label>
                <input
                  type="text"
                  value={activeExperiment.duration}
                  onChange={(e) =>
                    setActiveExperiment({ ...activeExperiment, duration: e.target.value })
                  }
                  placeholder="e.g. 45 Mins"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Safety Level */}
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Safety Rating:
                </label>
                <select
                  value={activeExperiment.safetyLevel}
                  onChange={(e) =>
                    setActiveExperiment({
                      ...activeExperiment,
                      safetyLevel: e.target.value as SafetyLevel,
                    })
                  }
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Safe for Home">Safe for Home</option>
                  <option value="Adult Supervision">Adult Supervision</option>
                  <option value="Lab Environment Required">Lab Environment Required</option>
                </select>
              </div>

              {/* Tags */}
              <div className="sm:col-span-12">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Concepts &amp; Curriculum Tags (comma separated):
                </label>
                <input
                  type="text"
                  value={activeExperiment.tags.join(', ')}
                  onChange={(e) =>
                    setActiveExperiment({
                      ...activeExperiment,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Harmonic Motion, Gravity, Kinematics, NEP 2020"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Listing Card Thumbnail / Hero Image */}
              <div className="sm:col-span-8">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Listing Card Thumbnail / Hero Image URL:</span>
                </label>
                <input
                  type="text"
                  value={activeExperiment.heroImage || ''}
                  onChange={(e) =>
                    setActiveExperiment({ ...activeExperiment, heroImage: e.target.value })
                  }
                  placeholder="e.g. /images/experiments/microscale-thermite-hero.jpg or /images/categories/chemistry.jpg"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  This image appears as the 16:9 thumbnail on the subject catalog listing card and the top hero banner.
                </span>
              </div>

              {/* Listing Card Badge / Eyebrow Tag */}
              <div className="sm:col-span-4">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Curriculum / NEP 2020 Badge (Eyebrow):
                </label>
                <input
                  type="text"
                  value={activeExperiment.badge || ''}
                  onChange={(e) =>
                    setActiveExperiment({ ...activeExperiment, badge: e.target.value })
                  }
                  placeholder="e.g. NEP 2020 • EXPERIENTIAL REDOX LAB"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005689]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Eyebrow highlight displayed on subject listings and modal.
                </span>
              </div>

              {/* ── Live Subject Catalog Card Preview ── */}
              <div className="sm:col-span-12 pt-3 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#005689]" />
                    <span>Live Subject Listing Card Preview (How students see this on /subject/{activeExperiment.subjectSlug}):</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#005689] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Live Rendering
                  </span>
                </div>

                {/* Exact Subject Card Replica */}
                <div className="max-w-xl mx-auto sm:mx-0">
                  <div className="relative flex flex-col justify-between border border-slate-200/90 rounded-2xl bg-white w-full select-none overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_30px_rgba(15,23,42,0.13)] transition-all">
                    {/* Top Section: Image and Content Side-by-Side */}
                    <div className="flex flex-row items-stretch gap-3 p-3">
                      {/* Image on the Left Side */}
                      <div className="w-28 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 relative self-stretch min-h-[96px]">
                        <img
                          src={
                            activeExperiment.heroImage ||
                            (activeExperiment.subjectSlug === 'chemistry'
                              ? '/images/categories/chemistry-card-1.jpg'
                              : '/images/categories/chemistry.jpg')
                          }
                          alt={activeExperiment.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/categories/chemistry.jpg';
                          }}
                        />
                        {/* Time Badge on Image */}
                        <div className="absolute top-2 left-2">
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs border border-white/20 flex items-center gap-1">
                            <Clock size={9} />
                            {activeExperiment.duration || '30 Mins'}
                          </span>
                        </div>
                      </div>

                      {/* Right Content Section */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div className="space-y-1">
                          {/* Secondary Category Label */}
                          <span className="text-[10px] font-medium text-slate-400 block tracking-wide truncate">
                            {activeExperiment.category || 'General Science'}
                          </span>

                          {/* Primary Activity Title */}
                          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 leading-snug line-clamp-2">
                            {activeExperiment.title || 'Untitled Practical Experiment'}
                          </h3>

                          {/* Subdued Description */}
                          <p className="text-[11px] text-slate-500 font-normal leading-relaxed line-clamp-2">
                            {activeExperiment.subtitle || 'State the aim, scientific outcome, and syllabus mapping'}
                          </p>

                          {/* Concept Tags */}
                          {activeExperiment.tags && activeExperiment.tags.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap pt-0.5">
                              {activeExperiment.tags.slice(0, 3).map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="inline-flex items-center text-[9px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Full-Width Card Footer */}
                    <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-700 font-medium px-2 py-0.5 bg-white rounded-md border border-slate-200">
                          {activeExperiment.gradeLevel}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 bg-slate-100 rounded-md">
                          {activeExperiment.difficulty}
                        </span>
                        {activeExperiment.badge && (
                          <span className="text-[9px] text-[#005689] font-bold px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded-md truncate max-w-[150px]">
                            {activeExperiment.badge}
                          </span>
                        )}
                      </div>

                      {/* Simulated Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 opacity-80 pointer-events-none">
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                          <Heart size={11} />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                          <Share2 size={10} />
                        </div>
                        <div className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#006fcc] text-white flex items-center gap-1">
                          <Check size={9} strokeWidth={3} />
                          <span>Select</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* ── Document Canvas: Ordered Sections Stream ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>Experiment Sections</span>
                  <span className="bg-blue-50 text-[#005689] border border-blue-200 px-2 py-0.2 rounded-full text-[11px] font-bold">
                    {activeExperiment.sections.length} blocks
                  </span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Fill in section data and collapse completed sections for a clean writing view
                </span>
              </div>

              {/* Global Expand All / Collapse All Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleAllSectionsCollapse(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                  title="Expand all sections"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-[#005689]" />
                  <span>Expand All</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllSectionsCollapse(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                  title="Collapse all sections to clean up the page"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-amber-600" />
                  <span>Collapse All</span>
                </button>
              </div>
            </div>

            {activeExperiment.sections.map((section, idx) => {
              if (section.type === 'materials') {
                return (
                  <MaterialSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'precautions') {
                return (
                  <PrecautionsSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'theory') {
                return (
                  <TheorySectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'math_formula') {
                return (
                  <FormulaSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'procedure') {
                return (
                  <ProcedureSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'observation') {
                return (
                  <ObservationSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'video') {
                return (
                  <VideoSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'gallery') {
                return (
                  <GallerySectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'faq') {
                return (
                  <FaqSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'custom') {
                return (
                  <CustomSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'setup') {
                return (
                  <SetupSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'history') {
                return (
                  <HistorySectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              if (section.type === 'applications') {
                return (
                  <ApplicationsSectionEditor
                    key={section.id}
                    section={section}
                    onChange={(updated) => handleUpdateSection(idx, updated)}
                    onMoveUp={idx > 0 ? () => handleMoveSection(idx, 'up') : undefined}
                    onMoveDown={
                      idx < activeExperiment.sections.length - 1
                        ? () => handleMoveSection(idx, 'down')
                        : undefined
                    }
                    onDelete={() => handleDeleteSection(idx)}
                  />
                );
              }

              return null;
            })}
          </div>

          {/* Bottom Add Section Palette */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              + Append New Section to Experiment:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleAddSection('materials')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Materials Table
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('precautions')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Precautions &amp; PPE
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('theory')}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Theory &amp; Principle
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('math_formula')}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Math &amp; Formula
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('procedure')}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Step Procedure
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('observation')}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Observation &amp; Result
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('video')}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Video Demo
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('gallery')}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Media Gallery
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('custom')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Custom Section
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('faq')}
                className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-[#005689] border border-cyan-200 rounded-lg text-xs font-bold transition-colors"
              >
                + FAQ Section
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('setup')}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#005689] border border-blue-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Apparatus Setup Diagram
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('history')}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
              >
                + History &amp; Discovery
              </button>
              <button
                type="button"
                onClick={() => handleAddSection('applications')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Real-World Applications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW MODE 3: SINGLE-PAGE DOCUMENT PUBLICATION PREVIEW
         ══════════════════════════════════════════════════════════ */}
      {viewMode === 'preview' && activeExperiment && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 print:hidden">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Studio Editor</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href={`/experiments/${slugifyExperimentTitle(activeExperiment.title) || activeExperiment.id}`}
                target="_blank"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#005689] border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Public Page</span>
              </Link>
            </div>
          </div>

          <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-8">
            <SinglePageDocumentView
              experiment={activeExperiment}
              onEdit={() => setViewMode('editor')}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: BULK ADD EXPERIMENTS
         ══════════════════════════════════════════════════════════ */}
      {bulkAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#005689]" />
                <h3 className="font-bold text-base text-slate-900">
                  Bulk Add Experiments
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBulkAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Paste an array of experiment JSON objects. Each object can contain metadata and sections. You can click &quot;Load Sample Template&quot; below to see the required structure.
            </p>

            <textarea
              value={bulkAddJson}
              onChange={(e) => setBulkAddJson(e.target.value)}
              placeholder="[ { title: '...', subjectSlug: 'physics', ... } ]"
              rows={10}
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  const sample = [
                    {
                      title: 'Ohm’s Law Verification & Resistance Calculation',
                      subtitle: 'Verify V = I * R and Determine Resistance of Unknown Wire',
                      subjectSlug: 'physics',
                      subjectName: 'Physics',
                      category: 'Current Electricity & Circuitry',
                      gradeLevel: 'Secondary (9-10)',
                      difficulty: 'Intermediate',
                      duration: '40 Mins',
                      safetyLevel: 'Safe for Home',
                      status: 'published',
                      tags: ['Electricity', 'Ohm Law', 'Resistance', 'NEP 2020'],
                      sections: [],
                    },
                    {
                      title: 'Mitosis Chromosome Spread in Onion Root Tip',
                      subtitle: 'Acetocarmine Stain Visualization of Mitotic Metaphase',
                      subjectSlug: 'biology',
                      subjectName: 'Biology',
                      category: 'Cytology & Cell Division',
                      gradeLevel: 'Senior Sec (11-12)',
                      difficulty: 'Advanced',
                      duration: '60 Mins',
                      safetyLevel: 'Adult Supervision',
                      status: 'published',
                      tags: ['Mitosis', 'Microscopy', 'Chromosomes', 'NEP 2020'],
                      sections: [],
                    },
                  ];
                  setBulkAddJson(JSON.stringify(sample, null, 2));
                }}
                className="text-xs text-[#005689] font-bold hover:underline"
              >
                Load Sample Template
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBulkAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkAddSubmit}
                  className="px-4 py-2 bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Import All Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: IMPORT JSON FILE / TEXT
         ══════════════════════════════════════════════════════════ */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Import Experiments JSON
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Upload a JSON file or paste exported JSON data below to merge or restore experiments.
            </p>

            <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      setImportJsonText((evt.target?.result as string) || '');
                    };
                    reader.readAsText(file);
                  }
                }}
                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#005689] file:text-white hover:file:bg-[#003c6e]"
              />
            </div>

            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Or paste JSON content directly..."
              rows={6}
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005689]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-4 py-2 bg-[#005689] hover:bg-[#003c6e] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Validate &amp; Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentsAdminModule;
