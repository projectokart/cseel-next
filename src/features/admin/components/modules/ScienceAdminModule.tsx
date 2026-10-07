'use client';

import React, { useState, useEffect } from 'react';
import {
  Beaker,
  Plus,
  Play,
  Sparkles,
  BookOpen,
  Layers,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Youtube,
  Shield,
  Clock,
  GraduationCap,
  Tag,
  FileText,
  HelpCircle,
  Save,
  Download,
  Copy,
  ExternalLink,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { SUBJECTS_DATA, ExperimentActivity } from '@/data/subjectActivitiesData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface EditableExperiment extends ExperimentActivity {
  subjectSlug: string;
  subjectName: string;
  videoUrl?: string;
  aim?: string;
}

export const ScienceAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();

  // Load all activities from all subjects initially
  const [activities, setActivities] = useState<EditableExperiment[]>(() => {
    const list: EditableExperiment[] = [];
    Object.entries(SUBJECTS_DATA).forEach(([slug, sub]) => {
      sub.activities.forEach((act) => {
        list.push({
          ...act,
          subjectSlug: slug,
          subjectName: sub.name,
          aim: act.description,
          videoUrl: 'https://www.youtube.com/watch?v=28rAN41mCDk',
        });
      });
    });
    return list;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formSubject, setFormSubject] = useState('chemistry');
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [formCategory, setFormCategory] = useState('Inorganic Chemistry & Catalysis');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formGrade, setFormGrade] = useState<'Primary (1-5)' | 'Middle (6-8)' | 'Secondary (9-10)' | 'Senior Sec (11-12)' | 'All Grades'>('Middle (6-8)');
  const [formDifficulty, setFormDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [formDuration, setFormDuration] = useState('30 Mins');
  const [formSafety, setFormSafety] = useState<'Safe for Home' | 'Adult Supervision' | 'Lab Environment Required'>('Safe for Home');
  const [formDescription, setFormDescription] = useState('');
  const [formPrinciple, setFormPrinciple] = useState('');
  const [formRealWorld, setFormRealWorld] = useState('');
  const [formBadge, setFormBadge] = useState('NEP 2020 Aligned');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  
  // Materials and Steps arrays
  const [formMaterials, setFormMaterials] = useState<string[]>(['']);
  const [formSteps, setFormSteps] = useState<string[]>(['']);
  const [formTags, setFormTags] = useState('Hands-on, STEM, NEP2020');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormSubject('chemistry');
    setCustomSubjectName('');
    setFormCategory('General Practical Science');
    setFormTitle('');
    setFormSubtitle('');
    setFormGrade('Middle (6-8)');
    setFormDifficulty('Beginner');
    setFormDuration('30 Mins');
    setFormSafety('Safe for Home');
    setFormDescription('');
    setFormPrinciple('');
    setFormRealWorld('');
    setFormBadge('NEP 2020 Aligned');
    setFormVideoUrl('https://www.youtube.com/watch?v=28rAN41mCDk');
    setFormMaterials(['']);
    setFormSteps(['']);
    setFormTags('STEM, Hands-on, Experiential');
    setIsModalOpen(true);
  };

  const handleEdit = (item: EditableExperiment) => {
    setEditingId(item.id);
    setFormSubject(item.subjectSlug);
    setCustomSubjectName('');
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormSubtitle(item.subtitle);
    setFormGrade(item.gradeLevel);
    setFormDifficulty(item.difficulty);
    setFormDuration(item.duration);
    setFormSafety(item.safetyLevel);
    setFormDescription(item.description);
    setFormPrinciple(item.scientificPrinciple);
    setFormRealWorld(item.realWorldApplication);
    setFormBadge(item.badge || 'NEP 2020 Aligned');
    setFormVideoUrl(item.videoUrl || '');
    setFormMaterials(item.materials.length > 0 ? item.materials : ['']);
    setFormSteps(item.steps.length > 0 ? item.steps : ['']);
    setFormTags(item.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      addAuditLog('DELETED_EXPERIMENT', 'science_simulations', `Deleted experiment: ${title} (${id})`);
      showToast(`Experiment "${title}" deleted.`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please provide an Experiment Title');
      return;
    }

    const cleanMaterials = formMaterials.filter((m) => m.trim().length > 0);
    const cleanSteps = formSteps.filter((s) => s.trim().length > 0);
    const cleanTags = formTags.split(',').map((t) => t.trim()).filter((t) => t.length > 0);

    const targetSubjectName =
      formSubject === 'custom'
        ? customSubjectName || 'Specialized STEM Stream'
        : SUBJECTS_DATA[formSubject]?.name || formSubject.toUpperCase();

    const newExperiment: EditableExperiment = {
      id: editingId || `exp-${Date.now()}`,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || 'Curriculum-Mapped Hands-on Activity',
      category: formCategory.trim() || 'General Science & Experimentation',
      subjectSlug: formSubject === 'custom' ? customSubjectName.toLowerCase().replace(/\s+/g, '-') : formSubject,
      subjectName: targetSubjectName,
      gradeLevel: formGrade,
      difficulty: formDifficulty,
      duration: formDuration,
      safetyLevel: formSafety,
      description: formDescription.trim(),
      scientificPrinciple: formPrinciple.trim(),
      realWorldApplication: formRealWorld.trim(),
      materials: cleanMaterials.length > 0 ? cleanMaterials : ['Standard Laboratory Equipment & Safety Goggles'],
      steps: cleanSteps.length > 0 ? cleanSteps : ['Setup equipment on clean safety tray.', 'Observe and record readings.'],
      tags: cleanTags,
      badge: formBadge.trim(),
      videoUrl: formVideoUrl.trim(),
      colorTheme: 'from-cyan-600 to-blue-700'
    };

    if (editingId) {
      setActivities((prev) => prev.map((a) => (a.id === editingId ? newExperiment : a)));
      addAuditLog('UPDATED_EXPERIMENT', 'science_simulations', `Updated experiment: ${newExperiment.title}`);
      showToast(`Updated "${newExperiment.title}" successfully!`);
    } else {
      setActivities((prev) => [newExperiment, ...prev]);
      addAuditLog('CREATED_NEW_EXPERIMENT', 'science_simulations', `Created new experiment: ${newExperiment.title} in ${newExperiment.subjectName}`);
      showToast(`New experiment "${newExperiment.title}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  // Distinct subjects/categories list for filter pills
  const subjectsList = ['All', ...Array.from(new Set(activities.map((a) => a.subjectName)))];

  const filteredActivities = activities.filter((a) => {
    const matchesCategory = selectedCategory === 'All' || a.subjectName === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan-500/40 flex items-center gap-3 animate-slide-up">
          <CheckCircle2 size={18} className="text-cyan-400" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 border border-cyan-200 rounded-full text-xs font-bold text-[#0284c7]">
            <Beaker className="w-3.5 h-3.5" />
            <span>EXPERIMENT & CURRICULUM MANAGEMENT DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
            Science Experiments, Robotics Labs & Categories
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
            Manage 1,000+ hands-on science activities, step-by-step procedures, lab equipment requirements, and YouTube practical guides across Chemistry, Biology, Physics, Mathematics, and Robotics.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-slate-900/10 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>+ Add New Experiment</span>
        </button>
      </div>

      {/* ── CONTROLS: SEARCH & CATEGORY FILTER ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {subjectsList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {cat} {cat === 'All' ? `(${activities.length})` : ''}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search experiment or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-2xl pl-9 pr-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
          />
        </div>
      </div>

      {/* ── EXPERIMENTS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredActivities.map((exp) => (
          <div
            key={exp.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm hover:border-[#0284c7]/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284c7] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                  {exp.subjectName}
                </span>
                <span className="text-[11px] font-semibold text-stone-500">{exp.gradeLevel}</span>
              </div>

              {/* Title & Category */}
              <div>
                <span className="text-[10.5px] font-semibold text-stone-400 block mb-0.5">{exp.category}</span>
                <h3 className="text-sm sm:text-base font-bold text-[#0f172a] leading-snug group-hover:text-[#0284c7] transition-colors">
                  {exp.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                  <Clock size={11} className="text-stone-400" />
                  <span>{exp.duration}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                  <Shield size={11} className="text-emerald-500" />
                  <span>{exp.safetyLevel}</span>
                </span>
                {exp.materials?.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                    <Layers size={11} className="text-stone-400" />
                    <span>{exp.materials.length} Materials</span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleEdit(exp)}
                  className="p-1.5 text-stone-500 hover:text-[#0284c7] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit details"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id, exp.title)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete experiment"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <a
                href={`/subject/${exp.subjectSlug || 'chemistry'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-stone-100 hover:bg-[#0f172a] text-stone-700 hover:text-white font-bold rounded-xl transition-all flex items-center gap-1.5 text-[11px]"
              >
                <span>View Live</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE / EDIT EXPERIMENT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#fafaf9] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-[#0284c7] flex items-center justify-center font-bold">
                  <Beaker size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                    {editingId ? 'Edit Experiment Details' : 'Add New Science / Robotics Experiment'}
                  </h3>
                  <p className="text-xs text-stone-500">Enter step-by-step procedure, materials, scientific principles & category.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form Scroll Area */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* Row 1: Subject / Stream & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Subject / Department</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  >
                    <option value="chemistry">Chemistry (Molecular & Reactions)</option>
                    <option value="physics">Physics (Optics, Mechanics & Electromagnetism)</option>
                    <option value="biology">Biology (Microbiology & Physiology)</option>
                    <option value="math">Mathematics (Geometry & Fractals)</option>
                    <option value="technology">Robotics & AI (Embedded Systems & IoT)</option>
                    <option value="engineering">Engineering & Working Models</option>
                    <option value="custom">+ Create New Custom Subject Stream</option>
                  </select>
                </div>

                {formSubject === 'custom' ? (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">New Custom Stream Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Space Sciences & Astronomy"
                      value={customSubjectName}
                      onChange={(e) => setCustomSubjectName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">Category / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Thermodynamics, Sonar Robotics, Acid-Base"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Row 2: Title & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Experiment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Magnetic Levitation Train Model"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Subtitle / Key Concept</label>
                  <input
                    type="text"
                    placeholder="e.g. Meissner Effect & Superconducting Repulsion Simulation"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Grade, Difficulty, Duration, Safety */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Class / Grade</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  >
                    <option value="Primary (1-5)">Primary (1-5)</option>
                    <option value="Middle (6-8)">Middle (6-8)</option>
                    <option value="Secondary (9-10)">Secondary (9-10)</option>
                    <option value="Senior Sec (11-12)">Senior Sec (11-12)</option>
                    <option value="All Grades">All Grades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="e.g. 30 Mins"
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Safety Level</label>
                  <select
                    value={formSafety}
                    onChange={(e) => setFormSafety(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-2.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  >
                    <option value="Safe for Home">Safe for Home</option>
                    <option value="Adult Supervision">Adult Supervision</option>
                    <option value="Lab Environment Required">Lab Required</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Description & Scientific Principle */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Short Overview & Description</label>
                  <textarea
                    rows={2}
                    placeholder="Explain what students will observe during this practical..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Scientific Principle / Formula</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. F = q(E + v × B), electromagnetic induction laws..."
                    value={formPrinciple}
                    onChange={(e) => setFormPrinciple(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Dynamic Materials List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-700">Required Materials & Apparatus</label>
                  <button
                    type="button"
                    onClick={() => setFormMaterials([...formMaterials, ''])}
                    className="text-[11px] text-[#0284c7] font-bold hover:underline cursor-pointer"
                  >
                    + Add Material
                  </button>
                </div>
                <div className="space-y-2">
                  {formMaterials.map((mat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Material ${idx + 1} (e.g. Neodymium Magnets, Pyrex Beaker)`}
                        value={mat}
                        onChange={(e) => {
                          const updated = [...formMaterials];
                          updated[idx] = e.target.value;
                          setFormMaterials(updated);
                        }}
                        className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                      />
                      {formMaterials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormMaterials(formMaterials.filter((_, i) => i !== idx))}
                          className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Dynamic Step-by-Step Procedure */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-700">Step-by-Step Procedure</label>
                  <button
                    type="button"
                    onClick={() => setFormSteps([...formSteps, ''])}
                    className="text-[11px] text-[#0284c7] font-bold hover:underline cursor-pointer"
                  >
                    + Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {formSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={`Step ${idx + 1} instructions...`}
                        value={step}
                        onChange={(e) => {
                          const updated = [...formSteps];
                          updated[idx] = e.target.value;
                          setFormSteps(updated);
                        }}
                        className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                      />
                      {formSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormSteps(formSteps.filter((_, i) => i !== idx))}
                          className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer mt-0.5"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 7: YouTube Video Link & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">YouTube Video Guide / Sim Link</label>
                  <div className="relative">
                    <Youtube size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500" />
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Keywords & Tags (Comma-separated)</label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="e.g. Physics, Maglev, Electromagnetism"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-[#0284c7] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save size={14} className="text-cyan-400" />
                  <span>{editingId ? 'Save Changes' : 'Publish Experiment'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ScienceAdminModule;
