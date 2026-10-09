'use client';



import { FACILITY_CATEGORIES } from '@/components/schools/FacilityData';

import { renderFacilityIcon, renderCategoryHeaderIcon } from '@/components/schools/FacilityIcons';

import React, { useState, useRef, useEffect } from 'react';

import Link from 'next/link';

import {

  Search,

  ArrowRight,

  Play,

  Users,

  Award,

  Building,

  Building2,

  Compass,

  Eye,

  Target,

  Heart,

  Check,

  FlaskConical,

  Monitor,

  Bot,

  BookOpen,

  Tv,

  Activity,

  Palette,

  Bus,

  HeartPulse,

  MapPin,

  Phone,

  Mail,

  Facebook,

  Instagram,

  Youtube,

  Linkedin,

  X,

  Send,

  CheckCircle2,

  Star,

  ShieldCheck,

  CreditCard,

  FileText,

  Calendar,

  Clock,

  ThumbsUp,

  MessageSquare,

  Sparkles,

  HelpCircle,

  ExternalLink,

  ChevronDown,

  ChevronLeft,

  ChevronRight,

  BarChart3,

  TrendingUp,

  Lock,

  User,

  GraduationCap,

  Filter,

  Percent,

  Globe,

  Copy,

  Layers,

  Navigation,

  Crosshair,

  Maximize2,

  Menu,

  Home,

  Info,

  Lightbulb,

  Edit3,

  Trash2,

  Plus,

  EyeOff,

  Loader2,

  Upload,

  Briefcase,

  UserCheck,

  Camera

} from 'lucide-react';

import {

  ScienceLabIllustration,

  ComputerLabIllustration,

  RoboticsLabIllustration,

  LibraryIllustration,

  SmartClassroomIllustration,

  SportsIllustration,

  ArtMusicIllustration,

  AuditoriumIllustration,

  TransportIllustration,

  MedicalRoomIllustration,

  PrincipalDeskIllustration,

  SchoolCampusIllustration

} from '@/components/illustrations/FacilityIllustrations';

import SchoolPhotoBook from '@/components/schools/SchoolPhotoBook';

import { useOptionalSchoolTemplate } from '@/components/schools/template/SchoolTemplateContext';

import TemplateControlBar from '@/components/schools/template/TemplateControlBar';

import EditableText from '@/components/schools/template/EditableText';

import EditableImage, { compressImageUnder50KB } from '@/components/schools/template/EditableImage';

import EditableIcon from '@/components/schools/template/EditableIcon';

import VerifiedBadge from '@/components/schools/template/VerifiedBadge';

import AddCardModal, { ICON_MAP, ILLUSTRATION_MAP } from '@/components/schools/template/AddCardModal';

import FacultyModal from '@/components/schools/template/FacultyModal';

import GalleryModal from '@/components/schools/template/GalleryModal';
import SchoolFaqSection from '@/components/schools/template/SchoolFaqSection';

import AwardModal from '@/components/schools/template/AwardModal';



interface SchoolProfileViewProps {

  state: string;

  district: string;

  blockName: string;

  village: string;

  schoolName: string;

  schoolSlug: string;

  udiseCode: string;

  pincode: string;

  management: string;

  board: string;

  medium: string;

  establishedYear: string;

  totalStudents: number;

  totalBoys: number;

  totalGirls: number;

  totalTeachers: number;

  maleTeachers: number;

  femaleTeachers: number;

  classroomsCount: number;

  classFrom: string;

  classTo: string;

  schoolCategory: string;

  genderType?: string;

  ruralUrban: string;

  workingSmartBoards?: number;

  computerIctLab?: string;

  atalStemLab?: string;

  playgroundAvailable?: string;

  principalName: string;

  rawPhone: string;

  rawEmail: string;

  website: string;

  rawAddress: string;

  imageUrl?: string;

  lat: number;

  lng: number;

  clusterSchools: any[];

  districtSchools: any[];

  isTemplate?: boolean;

}



type TabType =

  | 'home'

  | 'about'

  | 'academics'

  | 'facilities'

  | 'gallery'

  | 'admissions'

  | 'reviews'

  | 'contact';



const navTabs: { id: TabType; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [

  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },

  { id: 'academics', label: 'Academics', shortLabel: 'Academics', icon: BookOpen },

  { id: 'facilities', label: 'Facilities', shortLabel: 'Facilities', icon: Layers },

  { id: 'gallery', label: 'Campus Gallery', shortLabel: 'Gallery', icon: Eye },

  { id: 'admissions', label: 'Admissions & Fees', shortLabel: 'Admissions', icon: GraduationCap },

  { id: 'reviews', label: 'Reviews & Ratings', shortLabel: 'Reviews', icon: Star },

  { id: 'contact', label: 'Contact Us', shortLabel: 'Contact', icon: Phone }

];



export default function SchoolProfileView({

  state,

  district,

  blockName,

  village,

  schoolName,

  schoolSlug,

  udiseCode,

  pincode,

  management,

  board,

  medium,

  establishedYear,

  totalStudents,

  totalTeachers,

  classroomsCount,

  classFrom,

  classTo,

  schoolCategory,

  genderType,

  ruralUrban,

  totalBoys,

  totalGirls,

  principalName,

  rawPhone,

  rawEmail,

  website,

  rawAddress,

  lat = 28.1885,

  lng = 76.6215,

  imageUrl,

  clusterSchools = [],

  districtSchools = [],

  isTemplate = false,

}: SchoolProfileViewProps) {

  // Modal states

    // Dynamic Tables State
  const [admissionPhone, setAdmissionPhone] = useState(rawPhone || '');
  const [admissionEmail, setAdmissionEmail] = useState(rawEmail || '');

  const [feesTable, setFeesTable] = useState({
    columns: ['Class', 'Admission Fee', 'Tuition Fee (Monthly)', 'Dev / Building Fee (Monthly)', 'Activity Fee (Monthly)', 'Total Annual (Est.)'],
    rows: [
      ['Pre (Nursery)', '', '', '', '', ''],
      ['LKG', '', '', '', '', ''],
      ['UKG', '', '', '', '', ''],
      ['Class 1', '', '', '', '', ''],
      ['Class 2', '', '', '', '', ''],
      ['Class 3', '', '', '', '', ''],
      ['Class 4', '', '', '', '', ''],
      ['Class 5', '', '', '', '', ''],
      ['Class 6', '', '', '', '', ''],
      ['Class 7', '', '', '', '', ''],
      ['Class 8', '', '', '', '', ''],
      ['Class 9', '', '', '', '', ''],
      ['Class 10', '', '', '', '', ''],
      ['Class 11', '', '', '', '', ''],
      ['Class 12', '', '', '', '', ''],
    ]
  });

  const [extraChargesTable, setExtraChargesTable] = useState({
    columns: ['Charge Type', 'Amount (Monthly)', 'Notes / Applicable To', 'Total Annual'],
    rows: [
      ['Transport / Bus Fee', '3500', 'Opt-in users', ''],
      ['Hostel / Boarding', '10000', 'Boarders only', ''],
      ['Meal Plan (Day Scholars)', '1800', 'Optional', ''],
      ['Uniform & Books Kit', '', 'Annual one-time ₹8,000+', '']
    ]
  });

  const renderDynamicTable = (
    title: string, 
    data: {columns: string[], rows: string[][]}, 
    setData: React.Dispatch<React.SetStateAction<{columns: string[], rows: string[][]}>>
  ) => {
    const maxCols = 10;
    const maxRows = 20;
    const lastColIdx = data.columns.length - 1;

    const removeCol = (colIdx: number) => {
      if (data.columns.length <= 2) return;
      setData({
        columns: data.columns.filter((_, i) => i !== colIdx),
        rows: data.rows.map(r => r.filter((_, i) => i !== colIdx))
      });
    };
    const addRow = () => {
      if (data.rows.length >= maxRows) return;
      setData({
        ...data,
        rows: [...data.rows, Array(data.columns.length).fill('')]
      });
    };
    const removeRow = (rowIdx: number) => {
      if (data.rows.length <= 1) return;
      setData({
        ...data,
        rows: data.rows.filter((_, i) => i !== rowIdx)
      });
    };

    // Sums ALL fee columns (index 1 to lastColIdx-1) into the last Total Annual column
    // One-time fees (no keyword) × 1, Monthly × 12, Qtr × 4, Half × 2
    const recalcRowTotal = (rowArray: string[], cols: string[]) => {
      const last = cols.length - 1;
      let sum = 0;
      let hasNumbers = false;
      for (let i = 1; i < last; i++) {
        const cVal = (rowArray[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
        const header = cols[i].toLowerCase();
        const num = parseFloat(cVal);
        if (!isNaN(num) && num > 0) {
          hasNumbers = true;
          let factor = 1;
          if (header.includes('month')) factor = 12;
          else if (header.includes('qtr') || header.includes('quarter')) factor = 4;
          else if (header.includes('half')) factor = 2;
          sum += num * factor;
        }
      }
      if (cols[last].toLowerCase().includes('total')) {
        rowArray[last] = hasNumbers ? `₹${Math.round(sum).toLocaleString('en-IN')}` : '';
      }
      return rowArray;
    };

    const updateCol = (colIdx: number, val: string) => {
      const newCols = [...data.columns];
      newCols[colIdx] = val;
      const newRows = data.rows.map(r => recalcRowTotal([...r], newCols));
      setData({ columns: newCols, rows: newRows });
    };

    const updateCell = (rowIdx: number, colIdx: number, val: string) => {
      const newRows = [...data.rows];
      newRows[rowIdx] = [...newRows[rowIdx]];
      newRows[rowIdx][colIdx] = val;
      // Recalc whenever any non-last column changes
      if (colIdx < data.columns.length - 1) {
        newRows[rowIdx] = recalcRowTotal(newRows[rowIdx], data.columns);
      }
      setData({ ...data, rows: newRows });
    };

    // Insert new column BEFORE the last (Total) column
    const addColBeforeTotal = () => {
      if (data.columns.length >= maxCols) return;
      const newCols = [...data.columns];
      newCols.splice(lastColIdx, 0, 'New Column');
      const newRows = data.rows.map(r => {
        const newRow = [...r];
        newRow.splice(lastColIdx, 0, '');
        return recalcRowTotal(newRow, newCols);
      });
      setData({ columns: newCols, rows: newRows });
    };


    return (
      <div className="bg-white rounded-xl border border-[#EDF5FA] shadow-sm overflow-hidden mb-6 max-w-5xl mx-auto w-full">
        <div className="px-4 py-3 border-b border-[#EDF5FA] flex flex-wrap justify-between items-center gap-2 bg-[#F8FAFC]">
          <h3 className="text-base font-black text-[#005689]">{title}</h3>
          {isEditMode && (
             <span className="text-xs text-gray-500 font-medium bg-white px-2.5 py-1 rounded-full border border-[#EDF5FA] shadow-sm">
               💡 Add "(Monthly)" or "(Qtr)" to column names for auto-multiplication!
             </span>
          )}
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {data.columns.map((col, cIdx) => (
                  <th key={cIdx} className={`px-2 py-2.5 border-r border-b border-[#EDF5FA] bg-white text-xs font-bold text-gray-700 ${cIdx === 0 ? 'w-36 min-w-[130px]' : cIdx === lastColIdx ? 'w-28 min-w-[110px] bg-green-50/30' : 'w-24 min-w-[95px]'}`}>
                    {isEditMode ? (
                      <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md pr-0.5 focus-within:border-[#005689]">
                        <input 
                          type="text" 
                          value={col} 
                          onChange={e => updateCol(cIdx, e.target.value)} 
                          className="w-full bg-transparent px-1.5 py-1 text-xs font-bold text-gray-700 focus:outline-none min-w-0"
                        />
                        {cIdx !== lastColIdx && (
                          <button onClick={() => removeCol(cIdx)} className="text-red-400 hover:text-red-600 p-0.5 flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className={`px-1.5 py-0.5 block truncate ${cIdx === lastColIdx ? 'text-[#137333]' : ''}`} title={col}>{col}</span>
                    )}
                  </th>
                ))}
                {/* + Add Column button — separate th at the very END of header row */}
                {isEditMode && (
                  <th className="px-1.5 py-2 border-b border-[#EDF5FA] bg-white w-16 text-center align-middle">
                    <button
                      onClick={addColBeforeTotal}
                      disabled={data.columns.length >= maxCols}
                      title="Add column before Total"
                      className="px-2.5 py-1 rounded-md bg-[#005689] text-white text-xs font-bold flex items-center gap-0.5 hover:bg-[#003c6e] disabled:opacity-40 transition-colors shadow-sm whitespace-nowrap mx-auto"
                    >
                      <Plus className="w-3.5 h-3.5" /> Col
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rIdx) => {
                // Build breakdown for tooltip on Total cell
                const breakdownParts: string[] = [];
                for (let i = 1; i < data.columns.length - 1; i++) {
                  const cVal = (row[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
                  const header = data.columns[i];
                  const num = parseFloat(cVal);
                  if (!isNaN(num) && num > 0) {
                    const lh = header.toLowerCase();
                    let factor = 1, unit = '×1';
                    if (lh.includes('month')) { factor = 12; unit = '×12'; }
                    else if (lh.includes('qtr') || lh.includes('quarter')) { factor = 4; unit = '×4'; }
                    else if (lh.includes('half')) { factor = 2; unit = '×2'; }
                    breakdownParts.push(`${header.split('(')[0].trim()} ${unit} = ₹${(num * factor).toLocaleString('en-IN')}`);
                  }
                }
                const breakdownTitle = breakdownParts.length > 0 ? breakdownParts.join('\n') : '';
                return (
                  <tr key={rIdx} className="hover:bg-[#F8FAFC] border-b border-[#EDF5FA] group transition-colors">
                    {row.map((cell, cIdx) => {
                      const isTotal = cIdx === data.columns.length - 1;
                      return (
                        <td key={cIdx} className={`px-2 py-2 border-r border-[#EDF5FA] ${isTotal ? 'bg-green-50/60 font-bold text-[#137333]' : ''}`}>
                          {isTotal ? (
                            // Total column — always auto-calculated, never manually editable
                            <span
                              className="text-sm font-bold text-[#137333] px-1.5 block"
                              title={breakdownTitle || 'Enter fees to auto-calculate'}
                            >
                              {cell || '—'}
                            </span>
                          ) : isEditMode ? (
                            <input 
                              type="text" 
                              value={cell} 
                              onChange={e => updateCell(rIdx, cIdx, e.target.value)} 
                              className="w-full bg-transparent border-b border-dashed border-transparent hover:border-gray-300 focus:border-[#005689] px-1.5 py-0.5 text-sm text-gray-700 focus:outline-none"
                              placeholder={cIdx === 0 ? 'Class name' : '0'}
                            />
                          ) : (
                            <span className="text-sm text-gray-700 px-1.5 block">{cell || '—'}</span>
                          )}
                        </td>
                      );
                    })}
                    {isEditMode && (
                      <td className="px-1.5 py-1 text-center align-middle w-8">
                        <button onClick={() => removeRow(rIdx)} className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors inline-block opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
        {/* Add Row button — below the table, at the end */}
        {isEditMode && (
          <div className="px-4 py-2 border-t border-[#EDF5FA] bg-[#F8FAFC] flex justify-end">
            <button 
              onClick={addRow} 
              disabled={data.rows.length >= maxRows} 
              className="px-4 py-1.5 bg-[#005689] text-white text-xs font-bold rounded-md border border-[#005689] hover:bg-[#003c6e] disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>
        )}
      </div>
    );
  };
const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loggedInUser, setLoggedInUser] = useState<{ name: string; email: string; role: string } | null>(null);

  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  const [authEmailOrPhone, setAuthEmailOrPhone] = useState('');

  const [authName, setAuthName] = useState('');

  const [authPassword, setAuthPassword] = useState('');

  const [authRole, setAuthRole] = useState<'Parent' | 'Student' | 'Alumni'>('Parent');

  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [isSearchOpen, setIsSearchOpen] = useState(false);



  // Reviews filters, vertical list pagination & interactive states

  const [reviewRoleFilter, setReviewRoleFilter] = useState<'all' | 'Parent' | 'Student' | 'Alumni'>('all');

  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');

  const [reviewSearchText, setReviewSearchText] = useState('');

  const [visibleReviewsCount, setVisibleReviewsCount] = useState(4);

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  const [reviewSortBy, setReviewSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  const [userLikesMap, setUserLikesMap] = useState<Record<number, boolean>>({});



  // 5-Point Questionnaire Ratings (Questions asked to Parents & Students)

  const [ratingOverall, setRatingOverall] = useState(5); // Q1: Overall experience & recommendation

  const [ratingAcademics, setRatingAcademics] = useState(5); // Q2: Academics & faculty teaching quality

  const [ratingInfrastructure, setRatingInfrastructure] = useState(5); // Q3: Infrastructure, campus & labs

  const [ratingSafety, setRatingSafety] = useState(5); // Q4: Student safety & discipline

  const [ratingSports, setRatingSports] = useState(5); // Q5: Sports & extracurricular activities

  const [ratingValue, setRatingValue] = useState(5); // Q6: Value for money & fees

  const [reviewerClass, setReviewerClass] = useState('');

  // Image fallback state dictionary: maps image keys to boolean

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});



  // Map interactive states

  const [mapMode, setMapMode] = useState<'osm' | 'satellite' | 'google'>('osm');

  const [mapLoaded, setMapLoaded] = useState(false);

  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const [isAddressCopied, setIsAddressCopied] = useState(false);



  // Tab-based SPA navigation

  const [activeTab, setActiveTab] = useState<TabType>('home');

  

  // Simplified Fee Table State

  const [feeTableData, setFeeTableData] = useState([

    { id: 1, classRange: 'Nursery - UKG', admissionFee: '₹10,000 (One-time)', tuitionFee: '₹3,500 / month' },

    { id: 2, classRange: 'Class 1 - 5', admissionFee: '₹15,000 (One-time)', tuitionFee: '₹4,500 / month' },

    { id: 3, classRange: 'Class 6 - 8', admissionFee: '₹15,000 (One-time)', tuitionFee: '₹5,500 / month' },

    { id: 4, classRange: 'Class 9 - 12', admissionFee: '₹20,000 (One-time)', tuitionFee: '₹6,500 / month' },

  ]);



  const updateFeeRow = (idx: number, field: string, value: string) => {

    const newData = [...feeTableData];

    newData[idx] = { ...newData[idx], [field]: value };

    setFeeTableData(newData);

  };



  const addFeeRow = () => {

    const newId = feeTableData.length > 0 ? Math.max(...feeTableData.map(f => f.id)) + 1 : 1;

    setFeeTableData([...feeTableData, { id: newId, classRange: '', admissionFee: '', tuitionFee: '' }]);

  };



  const removeFeeRow = (idx: number) => {

    const newData = [...feeTableData];

    newData.splice(idx, 1);

    setFeeTableData(newData);

  };



  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [streamCategories, setStreamCategories] = useState([

    { name: 'Science (Medical)', subjects: ['Physics', 'Chemistry', 'Biology', 'English Core'] },

    { name: 'Science (Non-Medical)', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'] },

    { name: 'Commerce', subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'] },

    { name: 'Humanities / Arts', subjects: ['History', 'Geography', 'Political Science', 'Psychology'] }

  ]);

  const [newStreamTitle, setNewStreamTitle] = useState('');

  const [newSubjectInputs, setNewSubjectInputs] = useState<Record<number, string>>({});



  const handleAddNewStream = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === 'Enter' && newStreamTitle.trim()) {

      const newStreams = newStreamTitle.split(',').map(s => s.trim()).filter(s => s);

      const newCategories = newStreams.map(name => ({ name, subjects: [] }));

      setStreamCategories(prev => [...prev, ...newCategories]);

      setNewStreamTitle('');

    }

  };



  const handleAddSubjectToStream = (e: React.KeyboardEvent<HTMLInputElement>, streamIndex: number) => {

    if (e.key === 'Enter' && newSubjectInputs[streamIndex]?.trim()) {

      const newSubjects = newSubjectInputs[streamIndex].split(',').map(s => s.trim()).filter(s => s);

      setStreamCategories(prev => {

        const updated = [...prev];

        updated[streamIndex].subjects = [...updated[streamIndex].subjects, ...newSubjects];

        return updated;

      });

      setNewSubjectInputs(prev => ({ ...prev, [streamIndex]: '' }));

    }

  };



  const removeSubject = (streamIndex: number, subjectIndex: number) => {

    setStreamCategories(prev => {

      const updated = [...prev];

      updated[streamIndex].subjects = updated[streamIndex].subjects.filter((_, idx) => idx !== subjectIndex);

      return updated;

    });

  };



  const removeStream = (streamIndex: number) => {

    setStreamCategories(prev => prev.filter((_, idx) => idx !== streamIndex));

  };

  const getSubjectSuggestions = (streamName: string) => {

    const name = streamName.toLowerCase();

    if (name.includes('medical') && !name.includes('non')) return ['Physics', 'Chemistry', 'Biology', 'Biotechnology', 'English Core', 'Physical Education', 'Psychology'];

    if (name.includes('science') || name.includes('non-medical')) return ['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'English Core', 'Physical Education', 'Engineering Graphics'];

    if (name.includes('commerce')) return ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Informatics Practices', 'English Core', 'Entrepreneurship'];

    if (name.includes('arts') || name.includes('humanities')) return ['History', 'Geography', 'Political Science', 'Sociology', 'Psychology', 'English Core', 'Fine Arts', 'Economics', 'Legal Studies'];

    return ['English', 'Mathematics', 'Science', 'Computer Science', 'Physical Education', 'Art', 'Music'];

  };



  const handleSuggestionClick = (streamIndex: number, subject: string) => {

    setStreamCategories(prev => {

      const updated = [...prev];

      if (!updated[streamIndex].subjects.includes(subject)) {

        updated[streamIndex].subjects = [...updated[streamIndex].subjects, subject];

      }

      return updated;

    });

  };





  const [flippedFacilityCards, setFlippedFacilityCards] = useState<Record<string, boolean>>({});



  const toggleFacilityCardFlip = (facilityId: string) => {

    setFlippedFacilityCards((prev) => ({

      ...prev,

      [facilityId]: !prev[facilityId]

    }));

  };



  // Interactive Live Template Context

  const templateCtx = useOptionalSchoolTemplate();

  const isLiveTemplate = isTemplate && !!templateCtx;

  const templateData = templateCtx?.data;

  const isEditMode = isLiveTemplate ? (templateCtx?.isEditMode ?? true) : false;



  // Add Card Modals for Facilities and Admissions

  const [isAddFacilityModalOpen, setIsAddFacilityModalOpen] = useState(false);

  const [editingFacility, setEditingFacility] = useState<any | null>(null);

  const [isAddAdmissionModalOpen, setIsAddAdmissionModalOpen] = useState(false);

  const [editingAdmission, setEditingAdmission] = useState<any | null>(null);



  // Faculty Modal State

  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);



  // Gallery Modal & Pagination State (strictly external links, 2s pagination)

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const [galleryVisibleCount, setGalleryVisibleCount] = useState(6);

  const [isGalleryLoadingMore, setIsGalleryLoadingMore] = useState(false);



  // Awards Modal State

  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  const [editingAward, setEditingAward] = useState<any | null>(null);



  const handleTabSwitch = (tab: TabType) => {
    setIsMobileMenuOpen(false);
    if (tab === 'about') {
      setActiveTab('home');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  // Filter tabs according to school's tab visibility settings (in preview mode)

  const effectiveNavTabs = navTabs.filter((tab) => {

    if (isLiveTemplate && !isEditMode) {

      return templateData?.tabVisibility?.[tab.id] !== false;

    }

    return true;

  });



  // Mobile swipe gestures: STRICTLY Left Edge Swipe (< 30px) or Handle to prevent accidental triggering when swiping cards/flipbook

  useEffect(() => {

    if (typeof window === 'undefined') return;

    let startX = 0;

    let startY = 0;

    let startTime = 0;



    const handleTouchStart = (e: TouchEvent) => {

      startX = e.touches[0].clientX;

      startY = e.touches[0].clientY;

      startTime = Date.now();

    };



    const handleTouchEnd = (e: TouchEvent) => {

      const endX = e.changedTouches[0].clientX;

      const endY = e.changedTouches[0].clientY;

      const diffX = endX - startX;

      const diffY = endY - startY;

      const elapsed = Date.now() - startTime;



      // Ignore if gesture took too long (> 600ms) or is mostly vertical scroll

      if (elapsed > 600) return;

      if (Math.abs(diffY) > 60) return;



      // STRICT Left Edge swipe ONLY: user must touch within 30px of the extreme left edge

      // and swipe rightwards by at least 40px. Swiping anywhere in the middle of screen will NOT open menu!

      const isStrictEdgeSwipe = startX <= 30 && diffX > 40;



      if (isStrictEdgeSwipe) {

        setIsMobileMenuOpen(true);

      } else if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY)) {

        // Swipe back right-to-left closes menu

        setIsMobileMenuOpen(false);

      }

    };



    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    window.addEventListener('touchend', handleTouchEnd, { passive: true });



    return () => {

      window.removeEventListener('touchstart', handleTouchStart);

      window.removeEventListener('touchend', handleTouchEnd);

    };

  }, []);



  const mapContainerRef = useRef<HTMLDivElement>(null);

  const mapInstanceRef = useRef<any>(null);



  // 5 Real Rotating Hero Slides (Max 5 photos with auto-advance)

  const heroSlides = [

    {

      id: 1,

      image: '/images/schools/hero-school-1.png',

      badge: 'LEARN • GROW • ACHIEVE',

      tag: 'Nurturing Global Minds',

      heading: 'Building Brighter',

      highlight: 'Futures',

      desc: 'We nurture curious minds, build strong values and prepare future-ready students for a changing world.'

    },

    {

      id: 2,

      image: '/images/schools/hero-school-2.jpg',

      badge: 'WORLD-CLASS INFRASTRUCTURE',

      tag: '12-Acre Green Campus',

      heading: 'Inspiring Modern',

      highlight: 'Campus',

      desc: 'Sprawling green sports fields, clock tower architecture, and digitally enabled learning environments.'

    },

    {

      id: 3,

      image: '/images/real-facilities/science-lab.jpg',

      badge: 'EXPERIENTIAL PRACTICAL LEARNING',

      tag: 'NEP 2020 Aligned Labs',

      heading: 'Hands-On Discovery',

      highlight: 'Laboratories',

      desc: 'High-precision analytical chemistry, physics apparatus, and biology research benches for every student.'

    },

    {

      id: 4,

      image: '/images/real-facilities/robotics-lab.jpg',

      badge: 'FUTURE-READY STEM & AI',

      tag: 'Atal Tinkering Innovation Hub',

      heading: 'Robotics & Future',

      highlight: 'Innovations',

      desc: 'Hands-on 3D printing, autonomous rover electronics, Arduino sensors, and school coding bootcamps.'

    },

    {

      id: 5,

      image: '/images/real-facilities/library.jpg',

      badge: 'COLLABORATIVE SCHOLARSHIP',

      tag: '15,000+ Curated Books',

      heading: 'The World of Books &',

      highlight: 'Wisdom',

      desc: 'Sunlit quiet study zones, international research periodicals, and state-of-the-art digital OPAC kiosks.'

    }

  ];



  const [activeHeroSlide, setActiveHeroSlide] = useState(0);



  // Auto-advance hero slides every 5.5 seconds

  useEffect(() => {

    const timer = setInterval(() => {

      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);

    }, 5500);

    return () => clearInterval(timer);

  }, [heroSlides.length]);



  // Open inline review questionnaire directly on the page

  const handleInitiateWriteReview = () => {

    setIsWriteReviewOpen(true);

    setTimeout(() => {

      const el = document.getElementById('write-review-questionnaire-card');

      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    }, 80);

  };



  const handleToggleLike = (id: number) => {

    setUserLikesMap((prev) => ({

      ...prev,

      [id]: !prev[id]

    }));

  };



  // Horizontal scroll container refs

  const credentialsScrollRef = useRef<HTMLDivElement>(null);

  const principlesScrollRef = useRef<HTMLDivElement>(null);

  const facilitiesScrollRef = useRef<HTMLDivElement>(null);

  const admissionsScrollRef = useRef<HTMLDivElement>(null);

  const feesScrollRef = useRef<HTMLDivElement>(null);

  const otherChargesScrollRef = useRef<HTMLDivElement>(null);

  const feeNotesScrollRef = useRef<HTMLDivElement>(null);

  const reviewsScrollRef = useRef<HTMLDivElement>(null);



  // Active indices for scroll-linked dot indicators

  const [credentialsActiveIndex, setCredentialsActiveIndex] = useState(0);

  const [principlesActiveIndex, setPrinciplesActiveIndex] = useState(0);

  const [facilitiesActiveIndex, setFacilitiesActiveIndex] = useState(0);

  const [admissionsActiveIndex, setAdmissionsActiveIndex] = useState(0);

  const [feesActiveIndex, setFeesActiveIndex] = useState(0);

  const [otherChargesActiveIndex, setOtherChargesActiveIndex] = useState(0);

  const [feeNotesActiveIndex, setFeeNotesActiveIndex] = useState(0);

  const [reviewsActiveIndex, setReviewsActiveIndex] = useState(0);



  const scrollHorizontally = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right', distance = 360) => {

    if (ref.current) {

      ref.current.scrollBy({

        left: direction === 'left' ? -distance : distance,

        behavior: 'smooth'

      });

    }

  };



  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>, setIndex: (i: number) => void) => {

    const el = e.currentTarget;

    const card = el.firstElementChild as HTMLElement;

    if (!card) return;

    const cardWidth = card.offsetWidth;

    const gap = 16;

    const idx = Math.round(el.scrollLeft / (cardWidth + gap));

    setIndex(Math.max(0, idx));

  };



  const scrollToCard = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {

    if (!ref.current) return;

    const el = ref.current;

    const target = el.children[index] as HTMLElement;

    if (target) {

      target.scrollIntoView({

        behavior: 'smooth',

        block: 'nearest',

        inline: 'start'

      });

    }

  };



  const renderScrollDots = (

    total: number,

    activeIndex: number,

    ref: React.RefObject<HTMLDivElement | null>,

    extraClass = ''

  ) => {

    if (total <= 1) return null;

    return (

      <div className={`flex items-center justify-center gap-1.5 pt-4 pb-1 ${extraClass}`}>

        {Array.from({ length: total }).map((_, idx) => (

          <button

            key={idx}

            type="button"

            aria-label={`Go to card ${idx + 1}`}

            onClick={() => scrollToCard(ref, idx)}

            className={`transition-all duration-300 rounded-full cursor-pointer ${

              idx === activeIndex

                ? 'w-7 h-2 bg-[#006FCC] shadow-xs'

                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'

            }`}

          />

        ))}

      </div>

    );

  };



  // Review states

  const [userRating, setUserRating] = useState(5);

  const [reviewerName, setReviewerName] = useState('');

  const [reviewerRole, setReviewerRole] = useState('Parent');

  const [reviewComment, setReviewComment] = useState('');

  const [reviewsList, setReviewsList] = useState<any[]>([]);

  const [reviewSubmitted, setReviewSubmitted] = useState(false);



  // Form states

  const [applicantName, setApplicantName] = useState('');

  const [applicantPhone, setApplicantPhone] = useState('');

  const [applicantClass, setApplicantClass] = useState('Nursery');

  const [applicantEmail, setApplicantEmail] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);



  // Display texts matching the exact reference design or template mode

  const displayName = isLiveTemplate

    ? (templateData?.schoolName || 'School Name')

    : (isTemplate

      ? 'School Name'

      : ((!schoolName || /^\d+$/.test(schoolName.trim()))

        ? 'School Profile'

        : schoolName));

  const actualSchoolLogo = isLiveTemplate
    ? (templateData?.logoImage || templateData?.imageOverrides?.['school_logo'] || imageUrl || '')
    : (imageUrl || '');

  const renderHeaderVerifiedSchoolName = (name: string) => {
    const raw = (name || '').trim();
    if (!raw) return null;
    const parts = raw.split(/\s+/);
    const lastWord = parts.pop() || '';
    const leadingWords = parts.join(' ');

    return (
      <span className="inline">
        {leadingWords ? `${leadingWords} ` : ''}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap align-middle">
          <span>{lastWord}</span>
          {/* Tooltip verified badge with popover note */}
          <span className="relative group/verified inline-flex items-center justify-center shrink-0 cursor-help" title="CSEEL Verified School">
            <CheckCircle2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white fill-blue-600 drop-shadow-xs" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/verified:flex flex-col items-center z-50 pointer-events-none transition-all">
              <span className="bg-slate-900/95 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap leading-tight text-center border border-slate-700/50 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-900" />
                <span>Officially Verified Institution by CSEEL</span>
              </span>
              <span className="w-1.5 h-1.5 bg-slate-900/95 rotate-45 -mt-0.5 border-r border-b border-slate-700/50"></span>
            </span>
          </span>
        </span>
      </span>
    );
  };

  const displayEstablished = isLiveTemplate

    ? (templateData?.establishedYear || '2008')

    : (establishedYear || '1975');

  const displayStudents = isLiveTemplate

    ? `${(templateData?.totalStudents || 1250).toLocaleString()}+`

    : (totalStudents > 0 ? `${totalStudents.toLocaleString()}+` : '2,500+');

  const displayTeachers = isLiveTemplate

    ? `${templateData?.totalTeachers || 65}+`

    : (totalTeachers > 0 ? `${totalTeachers}+` : '120+');

  const displayYears = isLiveTemplate

    ? `${Math.max(1, 2026 - parseInt(templateData?.establishedYear || '2008'))}+`

    : (establishedYear && !isNaN(parseInt(establishedYear))

      ? `${Math.max(10, 2026 - parseInt(establishedYear))}+`

      : '50+');

  const displayPrincipal = isLiveTemplate

    ? (templateData?.principalName || 'Principal Desk')

    : (isTemplate

      ? 'Principal Desk'

      : (principalName || 'Principal Desk'));

  const displayAddress = isLiveTemplate

    ? (templateData?.address || (rawAddress || 'Campus Address'))

    : (isTemplate

      ? (rawAddress || 'Campus Address')

      : (rawAddress || 'Campus Address'));

  const displayPhone = isLiveTemplate

    ? (templateData?.phone || rawPhone || '')

    : (isTemplate

      ? (rawPhone || '')

      : (rawPhone || ''));

  const displayEmail = isLiveTemplate

    ? (templateData?.email || rawEmail || '')

    : (isTemplate

      ? (rawEmail || '')

      : (rawEmail || ''));

  // 4 Dedicated Inquiry Channels (General, Admissions, Principal, Careers)
  const displayGeneralPhone = isLiveTemplate ? (templateData?.generalPhone || templateData?.phone || rawPhone || '') : (rawPhone || '');
  const displayGeneralEmail = isLiveTemplate ? (templateData?.generalEmail || templateData?.email || rawEmail || '') : (rawEmail || '');

  const displayAdmissionsPhone = isLiveTemplate ? (templateData?.admissionsPhone || templateData?.phone || rawPhone || '') : (rawPhone || '');
  const displayAdmissionsEmail = isLiveTemplate ? (templateData?.admissionsEmail || templateData?.email || rawEmail || '') : (rawEmail || '');

  const displayPrincipalPhone = isLiveTemplate ? (templateData?.principalPhone || '') : '';
  const displayPrincipalEmail = isLiveTemplate ? (templateData?.principalEmail || '') : '';

  const displayCareersPhone = isLiveTemplate ? (templateData?.careersPhone || '') : '';
  const displayCareersEmail = isLiveTemplate ? (templateData?.careersEmail || '') : '';



  // Copy feedback state

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {

    if (typeof window !== 'undefined' && navigator.clipboard) {

      navigator.clipboard.writeText(text);

      setCopiedKey(key);

      setTimeout(() => setCopiedKey(null), 2000);

    }

  };



  // Accreditation / Quick Profile collapsible state

  const [isCredOpen, setIsCredOpen] = useState(false);



  // Official Institutional & Govt Accreditation Details

  const displayUdise = isLiveTemplate

    ? (templateData?.udiseCode || '06170100101')

    : (udiseCode || '06070123456');

  const displayBoard = isLiveTemplate

    ? (templateData?.board || 'CBSE (Central Board of Secondary Education)')

    : (board || 'CBSE (Central Board of Secondary Education)');

  const cleanUdiseDigits = displayUdise.replace(/\D/g, '');

  const displayAffiliationNo = displayBoard.toUpperCase().includes('CBSE')

    ? `CBSE/AFF/${cleanUdiseDigits.slice(-6) || '530492'}`

    : displayBoard.toUpperCase().includes('ICSE') || displayBoard.toUpperCase().includes('CISCE')

    ? `CISCE/AFF/${cleanUdiseDigits.slice(-5) || 'HA045'}`

    : `BSEH/REC/${cleanUdiseDigits.slice(-5) || '84912'}`;



  const displaySchoolCode = cleanUdiseDigits.slice(-5) || '40412';



  const displayDistrict = isLiveTemplate

    ? (templateData?.district || district || 'District')

    : (district || 'Campus');

  const displayState = isLiveTemplate

    ? (templateData?.state || state || 'State')

    : (state || 'State');

  const displayBlock = isLiveTemplate

    ? (templateData?.blockName || blockName || 'Block')

    : (blockName || 'Block');

  const displayVillage = isLiveTemplate

    ? (templateData?.village || village || 'Locality')

    : (village || 'Locality');

  const displayPincode = isLiveTemplate

    ? (templateData?.pincode || pincode || '123401')

    : (pincode || '123401');



  const displayClassFrom = isLiveTemplate

    ? (templateData?.classFrom || classFrom || 'Class 1')

    : (classFrom || 'Class 1');

  const displayClassTo = isLiveTemplate

    ? (templateData?.classTo || classTo || 'Class 12th')

    : (classTo || 'Class 12th');

  const displayClasses = `${displayClassFrom} to ${displayClassTo}`;



  const displayTotalBoys = isLiveTemplate

    ? (templateData?.totalBoys ?? totalBoys)

    : totalBoys;

  const displayTotalGirls = isLiveTemplate

    ? (templateData?.totalGirls ?? totalGirls)

    : totalGirls;

  const displayTotalTeachers = isLiveTemplate

    ? (templateData?.totalTeachers ?? totalTeachers)

    : totalTeachers;

  const fallbackMale = Math.round((totalTeachers || 20) * 0.35);

  const fallbackFemale = Math.max(0, (totalTeachers || 20) - fallbackMale);

  const displayMaleTeachers = isLiveTemplate

    ? (templateData?.maleTeachers ?? fallbackMale)

    : fallbackMale;

  const displayFemaleTeachers = isLiveTemplate

    ? (templateData?.femaleTeachers ?? fallbackFemale)

    : fallbackFemale;

  const displayClassrooms = isLiveTemplate

    ? (templateData?.classroomsCount ?? classroomsCount ?? 11)

    : (classroomsCount || 42);



  const displaySTR = isLiveTemplate

    ? `1:${Math.max(8, Math.min(45, Math.round(Number(templateData?.totalStudents || 100) / Number(templateData?.totalTeachers || 10))))}`

    : '1:20';



  const displaySchoolType = isLiveTemplate

    ? (templateData?.schoolCategory || templateData?.schoolType || 'Senior Secondary (Class 1 to 12)')

    : (schoolCategory || 'Senior Secondary (Class 1 to 12)');

  

  // School Authority: Private vs Government

  const mgmtVal = isLiveTemplate ? (templateData?.management || management || '') : (management || '');

  const isGovt = mgmtVal.toLowerCase().includes('govt') ||

                 mgmtVal.toLowerCase().includes('department') ||

                 mgmtVal.toLowerCase().includes('aided') ||

                 mgmtVal.toLowerCase().includes('kendriya');

  const displayManagementType = isGovt ? 'Government School' : 'Private Unaided';

  const displayManagementLabel = isLiveTemplate

    ? (templateData?.management || (isGovt ? 'Dept. of School Education, Govt.' : 'Private Unaided (Recognized Trust)'))

    : (management || (isGovt ? 'Dept. of School Education, Govt.' : 'Private Unaided (Recognized Trust)'));



  // Campus Format: Day School vs Boarding vs Day-Boarding

  const isResidential = isLiveTemplate

    ? Boolean(templateData?.isResidential)

    : ((schoolCategory || '').toLowerCase().includes('residential') || (schoolCategory || '').toLowerCase().includes('boarding'));

  const displayBoardingType = isResidential ? 'Residential (Boarding)' : 'Day School';

  const displayBoardingSub = isResidential ? 'Full Hostel & Mess Available' : 'Day-cum-Day-Boarding';



  // Student Gender: Co-Educational vs Girls Only vs Boys Only

  const displayGenderType = isLiveTemplate

    ? (templateData?.genderType || 'Co-Educational')

    : (genderType || 'Co-Educational');

  const displayGenderFormat = displayGenderType;

  const displayGenderTag = displayGenderType.toLowerCase().includes('girls')

    ? 'Girls Only School'

    : displayGenderType.toLowerCase().includes('boys')

    ? 'Boys Only School'

    : 'Co-Educational (Boys & Girls)';



  // Multiple Boards Support

  const rawBoardStr = isLiveTemplate ? (templateData?.board || displayBoard) : board;

  const boardsList = rawBoardStr

    ? rawBoardStr.split(/[,/|•]+/).map((b) => b.trim()).filter(Boolean)

    : ['CBSE (Central Board)', 'State Board'];



  // Multiple Mediums Support

  const rawMediumStr = isLiveTemplate ? (templateData?.medium || medium) : medium;

  const displayMedium = rawMediumStr || 'English Medium';

  const mediumsList = rawMediumStr

    ? rawMediumStr.split(/[,/|•]+/).map((m) => m.trim()).filter(Boolean)

    : ['English Medium', 'Hindi Medium'];



  const displayWebsiteUrl = isLiveTemplate

    ? (templateData?.website || website || '')

    : (website || '');

  const displayWebsiteClean = displayWebsiteUrl ? displayWebsiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

  const displayAdminEmail = displayGeneralEmail;



  // Resolved Latitude & Longitude with fallback

  const mapLat = (typeof lat === 'number' && !isNaN(lat) && lat !== 0) ? lat : 28.1885;

  const mapLng = (typeof lng === 'number' && !isNaN(lng) && lng !== 0) ? lng : 76.6215;



  // Load Leaflet dynamically via CDN scripts for instant campus map

  useEffect(() => {

    if (typeof window === 'undefined') return;



    if (!document.getElementById('leaflet-css')) {

      const link = document.createElement('link');

      link.id = 'leaflet-css';

      link.rel = 'stylesheet';

      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

      document.head.appendChild(link);

    }



    if (!(window as any).L) {

      const script = document.createElement('script');

      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

      script.async = true;

      script.onload = () => setMapLoaded(true);

      document.body.appendChild(script);

    } else {

      setMapLoaded(true);

    }

  }, []);



  // Initialize or re-render interactive map when mode is 'osm' or 'satellite'

  useEffect(() => {

    if (!mapLoaded || !mapContainerRef.current || mapMode === 'google') {

      if (mapInstanceRef.current) {

        mapInstanceRef.current.remove();

        mapInstanceRef.current = null;

      }

      return;

    }



    const L = (window as any).L;

    if (!L) return;



    if (mapInstanceRef.current) {

      mapInstanceRef.current.remove();

      mapInstanceRef.current = null;

    }



    try {

      const map = L.map(mapContainerRef.current, {

        center: [mapLat, mapLng],

        zoom: 15,

        zoomControl: false,

        attributionControl: false

      });



      const tileUrl = mapMode === 'satellite'

        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';



      L.tileLayer(tileUrl, {

        maxZoom: 19,

        subdomains: 'abcd',

      }).addTo(map);



      // Custom pulsing campus pinpoint

      const customIcon = L.divIcon({

        className: 'custom-campus-pin',

        html: `

          <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">

            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(0, 111, 204, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>

            <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: #005689; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">

              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>

            </div>

          </div>

        `,

        iconSize: [44, 44],

        iconAnchor: [22, 22],

        popupAnchor: [0, -20]

      });



      const marker = L.marker([mapLat, mapLng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`

        <div style="font-family: system-ui, sans-serif; min-width: 220px; padding: 6px;">

          <div style="font-weight: 800; color: #003c6e; font-size: 14px; line-height: 1.2;">${displayName}</div>

          <div style="font-size: 11px; color: #4B5563; margin-top: 4px; line-height: 1.3;">${displayAddress}</div>

          <div style="display: flex; gap: 4px; align-items: center; margin-top: 6px; font-size: 11px; font-weight: 700; color: #006FCC;">

            <span>★ 4.6 (Verified Campus)</span>

          </div>

          <div style="margin-top: 8px;">

            <a href="https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}" target="_blank" rel="noreferrer" style="display: inline-block; background: #006FCC; color: white; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; text-decoration: none;">Get Directions ↗</a>

          </div>

        </div>

      `).openPopup();



      mapInstanceRef.current = map;

    } catch (e) {

      console.warn('Leaflet init error:', e);

    }



    return () => {

      if (mapInstanceRef.current) {

        mapInstanceRef.current.remove();

        mapInstanceRef.current = null;

      }

    };

  }, [mapLoaded, mapMode, mapLat, mapLng, displayName, displayAddress, activeTab]);



  // 10 Facilities with REAL PHOTOGRAPHS, SPECIFICATIONS & FALLBACK SVG ILLUSTRATIONS

  const facilities = [

    {

      id: 'science-labs',

      name: 'Science Labs',

      desc: 'Hands-on Physics, Chemistry & Biology practicals.',

      photo: '/images/real-facilities/science-lab.jpg',

      Illustration: ScienceLabIllustration,

      category: 'Experiential STEM',

      icon: FlaskConical,

      color: 'bg-[#006FCC]',

      tagline: 'Physics • Chemistry • Biology',

      details: 'Fully equipped Physics, Chemistry, and Biology laboratories adhering to NEP 2020 standards with individual student workstations, digital safety equipment, and modern precision apparatus.',

      specs: [

        { label: 'Workstations', val: '45 Individual Benches' },

        { label: 'Equipment', val: 'Precision Balances, Spectrometers, Bunsen Burners' },

        { label: 'Safety', val: 'Fume Hoods, Eyewash & Fire Safeguards' },

        { label: 'Curriculum', val: 'CBSE & NEP Experiential Practical Syllabi' }

      ],

      capacity: '40 Students / Batch',

      timings: 'Mon - Fri (8:30 AM - 2:00 PM)'

    },

    {

      id: 'computer-labs',

      name: 'Computer IT Labs',

      desc: 'High-speed gigabit workstations & coding academy.',

      photo: '/images/real-facilities/computer-lab.jpg',

      Illustration: ComputerLabIllustration,

      category: 'Digital Innovation',

      icon: Monitor,

      color: 'bg-[#10B981]',

      tagline: 'Coding • AI • Web Dev',

      details: 'High-speed gigabit networked multimedia computing lab with contemporary workstations, programming environments, and safe filtered internet.',

      specs: [

        { label: 'Terminals', val: '60 All-in-One Dell Workstations' },

        { label: 'Internet', val: '1 Gbps Dedicated Leased Line' },

        { label: 'Languages', val: 'Python, Scratch, HTML5 & AI Models' },

        { label: 'Air Quality', val: 'Fully Air-Conditioned Ergonomic Setup' }

      ],

      capacity: '60 Students / Batch',

      timings: 'Daily Regular Practical Hours'

    },

    {

      id: 'robotics-lab',

      name: 'Robotics ATL Lab',

      desc: 'Atal Tinkering Lab for IoT, sensors & rover prototyping.',

      photo: '/images/real-facilities/robotics-lab.jpg',

      Illustration: RoboticsLabIllustration,

      category: 'Future Technology',

      icon: Bot,

      color: 'bg-[#F59E0B]',

      tagline: '3D Printing • IoT • Drones',

      details: 'State-of-the-art Atal Tinkering Lab (ATL) style robotics workspace with Arduino, sensors, mechanical tools, and 3D prototyping kits.',

      specs: [

        { label: 'Hardware', val: 'Dual 3D Printers & Soldering Benches' },

        { label: 'Kits', val: 'Arduino Uno, ESP32 & Quadcopter Drones' },

        { label: 'Projects', val: 'Autonomous Obstacle-Avoidance Rovers' },

        { label: 'Affiliation', val: 'NITI Aayog ATL Framework Certified' }

      ],

      capacity: '35 Innovators / Session',

      timings: 'Special STEM Batches & Clubs'

    },

    {

      id: 'library',

      name: 'Central Library',

      desc: 'Over 15,000 curated books, research journals & OPAC.',

      photo: '/images/real-facilities/library.jpg',

      Illustration: LibraryIllustration,

      category: 'Knowledge Hub',

      icon: BookOpen,

      color: 'bg-[#6366F1]',

      tagline: '15,000+ Books & Digital Kiosks',

      details: 'Over 15,000 reference books, international journals, curated fiction & non-fiction, digital kiosks, and quiet collaborative reading spaces.',

      specs: [

        { label: 'Collection', val: '15,000+ Volumes & Encyclopedia Sets' },

        { label: 'E-Resources', val: 'JSTOR, National Geographic & E-Books' },

        { label: 'Kiosks', val: '8 Digital OPAC Catalog Terminals' },

        { label: 'Ambience', val: 'Sunlit Quiet Reading Bays & Mezzanine' }

      ],

      capacity: '120 Readers Concurrently',

      timings: 'Open All School Working Hours'

    },

    {

      id: 'smart-classrooms',

      name: 'Smart Classrooms',

      desc: '75-inch 4K interactive digital flat panels.',

      photo: '/images/real-facilities/smart-classroom.jpg',

      Illustration: SmartClassroomIllustration,

      category: 'Interactive Learning',

      icon: Tv,

      color: 'bg-[#0EA5E9]',

      tagline: '4K Touch Panels & 3D Audio',

      details: 'Ergonomically designed classrooms equipped with interactive flat panel smartboards, audio systems, and digital interactive curriculum.',

      specs: [

        { label: 'Display', val: '75-inch Ultra HD 4K Touch Panels' },

        { label: 'Audio', val: 'High-Fidelity Integrated Classroom Audio' },

        { label: 'Curriculum', val: 'Interactive 3D Science & Math Modules' },

        { label: 'Climate', val: 'Energy-Efficient Climate Conditioning' }

      ],

      capacity: '35 - 40 Students / Room',

      timings: 'All Core Academic Periods'

    },

    {

      id: 'sports',

      name: 'Sports Complex',

      desc: 'Turf football ground, athletic track & basketball courts.',

      photo: '/images/real-facilities/sports.jpg',

      Illustration: SportsIllustration,

      category: 'Athletics & Fitness',

      icon: Activity,

      color: 'bg-[#8B5CF6]',

      tagline: 'FIFA Turf • Synthetic Track',

      details: 'Extensive multi-sport outdoor grounds with football turf, basketball courts, athletics track, badminton, and trained physical education coaches.',

      specs: [

        { label: 'Outdoor', val: 'FIFA-Grade Football Turf & 400m Track' },

        { label: 'Courts', val: '2 Synthetic Basketball & Tennis Arenas' },

        { label: 'Coaching', val: 'National Certified NIS Sports Trainers' },

        { label: 'Indoor', val: 'Table Tennis, Badminton & Yoga Studio' }

      ],

      capacity: '300+ Students Outdoors',

      timings: 'Morning Drills & Evening Academy'

    },

    {

      id: 'art-music',

      name: 'Art & Music Studios',

      desc: 'Dedicated classical instruments and fine arts studio.',

      photo: '/images/real-facilities/art-music.jpg',

      Illustration: ArtMusicIllustration,

      category: 'Creative STEAM',

      icon: Palette,

      color: 'bg-[#EC4899]',

      tagline: 'Pianos, Guitars, Tabla & Canvas',

      details: 'Dedicated creative studios for fine arts, painting, classical Indian and Western musical instruments, vocal training, and performance.',

      specs: [

        { label: 'Instruments', val: 'Grand Pianos, Guitars, Drums & Tabla' },

        { label: 'Fine Arts', val: 'Pottery Wheels, Oil & Acrylic Easels' },

        { label: 'Acoustics', val: 'Sound-Dampened Vocal Practice Bays' },

        { label: 'Exhibits', val: 'Quarterly Student Gallery Displays' }

      ],

      capacity: '50 Artists & Musicians',

      timings: 'Weekly Co-Curricular Blocks'

    },

    {

      id: 'auditorium',

      name: 'Grand Auditorium',

      desc: '800-seat theater hall with intelligent stage lighting.',

      photo: '/images/real-facilities/auditorium.jpg',

      Illustration: AuditoriumIllustration,

      category: 'Performing Arts',

      icon: Building,

      color: 'bg-[#7C3AED]',

      tagline: '800 Seats • Dolby Surround Stage',

      details: 'Acoustically treated 800+ seater indoor auditorium featuring automated theatrical lighting, pro surround audio, and live streaming capabilities.',

      specs: [

        { label: 'Seating', val: '800 Plush Velvet Acoustic Chairs' },

        { label: 'Lighting', val: 'Automated DMX Moving Head Stage Truss' },

        { label: 'Audio', val: 'Dolby Digital Surround Pro Line Array' },

        { label: 'Broadcast', val: 'HD Multi-Cam Live Streaming Setup' }

      ],

      capacity: '800 Audience Members',

      timings: 'Assemblies & Annual Celebrations'

    },

    {

      id: 'transport',

      name: 'GPS School Buses',

      desc: 'CCTV-monitored fleet with live mobile parent tracking.',

      photo: '/images/real-facilities/transport.jpg',

      Illustration: TransportIllustration,

      category: 'Safety & Transit',

      icon: Bus,

      color: 'bg-[#D97706]',

      tagline: 'Live GPS App • CCTV Cameras',

      details: 'Modern GPS-monitored school bus fleet equipped with CCTV surveillance, speed governors, female support staff, and real-time parent app tracking.',

      specs: [

        { label: 'Fleet', val: '28 BharatBenz Air-Suspension Buses' },

        { label: 'Tracking', val: 'Live GPS Route & Speed on Parent App' },

        { label: 'Safety', val: 'Interior/Exterior CCTV & Speed Limiters' },

        { label: 'Staffing', val: 'Licensed Driver & Female Bus Attendant' }

      ],

      capacity: '35km Citywide Commute Radius',

      timings: 'Morning Pickups & Evening Drops'

    },

    {

      id: 'medical-room',

      name: 'Medical Infirmary',

      desc: 'Full-time nursing staff, recovery beds & emergency care.',

      photo: '/images/real-facilities/medical.jpg',

      Illustration: MedicalRoomIllustration,

      category: 'Student Health',

      icon: HeartPulse,

      color: 'bg-[#14B8A6]',

      tagline: 'Registered Nurses • Oxygen Bed',

      details: 'Full-time registered nursing staff, first-aid triage, oxygen support, routine health screenings, and immediate emergency tie-ups with leading hospitals.',

      specs: [

        { label: 'Personnel', val: '2 Full-Time Certified Registered Nurses' },

        { label: 'Equipment', val: 'Oxygen Cylinders, Nebulizer, Stretcher' },

        { label: 'Hospital', val: 'Priority Ambulance Link with Apex Hospital' },

        { label: 'Audits', val: 'Bi-Annual Vision, Dental & Growth Screenings' }

      ],

      capacity: '4 Immediate Recovery Beds',

      timings: '24/7 Available During School Hours'

    }

  ];



  // Fee filter state

  const [selectedFeeWing, setSelectedFeeWing] = useState('all');



  // Fee Structure Data (Lower Grade to 12th Grade)

  const feeStructure = [

    {

      id: 'pre-primary',

      wing: 'Pre-Primary / Kindergarten',

      classes: 'Nursery, LKG & UKG',

      ageGroup: 'Ages 3 to 5 Years',

      monthlyTuition: '₹5,500',

      quarterlyTuition: '₹16,500 / quarter',

      admissionFee: '₹12,000 (One-time)',

      cautionDeposit: '₹5,000 (100% Refundable)',

      annualEstimated: '₹78,000',

      breakdown: [

        { label: 'Quarterly Tuition Fee', amount: '₹16,500' },

        { label: 'Activity & Play Zone Materials', amount: '₹3,000 / year' },

        { label: 'Health & Safety Assessment', amount: '₹1,500 / year' },

        { label: 'Smart Audio-Visual Curriculum', amount: 'Included' }

      ],

      highlights: [

        'Activity-based play pedagogy with Montessori kits',

        'CCTV-monitored air-conditioned play zones',

        'Daily digital progress report on parent app',

        'Nutritious meal guidance & hygiene routine'

      ]

    },

    {

      id: 'primary',

      wing: 'Foundational Primary Wing',

      classes: 'Class 1 to 5',

      ageGroup: 'Ages 6 to 10 Years',

      monthlyTuition: '₹6,200',

      quarterlyTuition: '₹18,500 / quarter',

      admissionFee: '₹15,000 (One-time)',

      cautionDeposit: '₹5,000 (100% Refundable)',

      annualEstimated: '₹92,000',

      breakdown: [

        { label: 'Quarterly Tuition Fee', amount: '₹18,500' },

        { label: 'Science & Computer Lab Exposure', amount: '₹4,000 / year' },

        { label: 'Sports, Taekwondo & Yoga', amount: 'Included' },

        { label: 'E-Library & Digital Storybooks', amount: '₹1,500 / year' }

      ],

      highlights: [

        'NEP 2020 experiential learning modules',

        'Weekly computer coding & digital literacy',

        'Dedicated language labs for Hindi & English fluency',

        'Inter-class sports and cultural festivals'

      ]

    },

    {

      id: 'middle',

      wing: 'Middle School Wing',

      classes: 'Class 6 to 8',

      ageGroup: 'Ages 11 to 13 Years',

      monthlyTuition: '₹7,350',

      quarterlyTuition: '₹22,000 / quarter',

      admissionFee: '₹15,000 (One-time)',

      cautionDeposit: '₹5,000 (100% Refundable)',

      annualEstimated: '₹1,08,000',

      breakdown: [

        { label: 'Quarterly Tuition Fee', amount: '₹22,000' },

        { label: 'Atal Tinkering Lab & Robotics Kit', amount: '₹4,500 / year' },

        { label: 'Physics, Chem, Bio Practical Lab', amount: '₹3,500 / year' },

        { label: 'Periodic Assessments & Mock Exams', amount: '₹2,000 / year' }

      ],

      highlights: [

        'Hands-on experimental science and robotics bench',

        'National Olympiad, NTSE & quiz foundation training',

        'Coding in Python and computational thinking',

        'Specialized sports coaching (Football, Cricket, Basketball)'

      ]

    },

    {

      id: 'secondary',

      wing: 'Secondary Board Prep Wing',

      classes: 'Class 9 & 10',

      ageGroup: 'Ages 14 to 15 Years',

      monthlyTuition: '₹8,500',

      quarterlyTuition: '₹25,500 / quarter',

      admissionFee: '₹18,000 (One-time)',

      cautionDeposit: '₹5,000 (100% Refundable)',

      annualEstimated: '₹1,24,000',

      breakdown: [

        { label: 'Quarterly Tuition Fee', amount: '₹25,500' },

        { label: 'Advanced Composite Lab Apparatus', amount: '₹5,500 / year' },

        { label: 'CBSE Board Assessment Series', amount: '₹3,500 / year' },

        { label: 'Career Guidance & Aptitude Profiling', amount: 'Included' }

      ],

      highlights: [

        'Rigorous CBSE board curriculum alignment',

        'Weekly mock tests with personalized error analysis',

        'Special remedial sessions for challenging topics',

        'Stream selection guidance counseling by experts'

      ]

    },

    {

      id: 'senior-science',

      wing: 'Senior Secondary • Science Stream',

      classes: 'Class 11 & 12 (PCM / PCB)',

      ageGroup: 'Ages 16 to 17 Years',

      monthlyTuition: '₹9,800',

      quarterlyTuition: '₹29,500 / quarter',

      admissionFee: '₹18,000 (One-time)',

      cautionDeposit: '₹5,000 (100% Refundable)',

      annualEstimated: '₹1,42,000',

      breakdown: [

        { label: 'Quarterly Tuition Fee', amount: '₹29,500' },

        { label: 'Specialized Physics/Chem/Bio Labs', amount: '₹7,000 / year' },

        { label: 'Computer Science / AI / Python Lab', amount: '₹4,000 / year' },

        { label: 'JEE / NEET Competitive Foundation', amount: 'Included' }

      ],

      highlights: [

        'Individual experiment apparatus benches for every student',

        'IIT/Medical entrance exam conceptual scaffolding',

        'High-speed digital workstation for CS / AI projects',

        'Dedicated senior faculty mentorship for practicals'

      ]

    },

    {

      id: 'senior-commerce',

      wing: 'Senior Secondary • Commerce & Arts',

      classes: 'Class 11 & 12 (Commerce / Humanities)',

      ageGroup: 'Ages 16 to 17 Years',

      monthlyTuition: '₹9,000',

      quarterlyTuition: '₹27,000 / quarter',

      admissionFee: '₹18,000 (One-time)',

      cautionDeposit: '₹5,000 (100% Refundable)',

      annualEstimated: '₹1,30,000',

      breakdown: [

        { label: 'Quarterly Tuition Fee', amount: '₹27,000' },

        { label: 'Informatics Practices & Accounts Lab', amount: '₹4,500 / year' },

        { label: 'CUET & CA Foundation Prep Module', amount: 'Included' },

        { label: 'Business Conclaves & Legal Studies Seminars', amount: '₹2,500 / year' }

      ],

      highlights: [

        'Practical accounting software & Excel modeling training',

        'Mock stock trading simulations and enterprise workshops',

        'Intensive CUET & CLAT examination preparatory guidance',

        'Eminent guest lectures by industry leaders & civil servants'

      ]

    }

  ];



  // School-Specific Other / Optional Charges

  const otherCharges = [

    {

      category: 'School Transport Service',

      desc: 'GPS-enabled buses with speed governors, CCTV cameras, female bus attendants, and parent mobile tracking.',

      rates: [

        { label: 'Zone A (0 – 3 km radius)', cost: '₹2,200 / month' },

        { label: 'Zone B (3 – 7 km radius)', cost: '₹2,800 / month' },

        { label: 'Zone C (7 – 15 km radius)', cost: '₹3,500 / month' }

      ]

    },

    {

      category: 'School Uniform & Sports Attire',

      desc: 'Standardized high-grade breathable uniform procured through authorized vendors.',

      rates: [

        { label: 'Summer Uniform Set (2 sets, tie, socks, belt)', cost: '₹3,200 – ₹4,200' },

        { label: 'Winter Blazer, Pullover & Tracksuit', cost: '₹2,800 – ₹3,800' },

        { label: 'House Sports T-shirt & Running Shoes', cost: '₹1,600 – ₹2,200' }

      ]

    },

    {

      category: 'Books, Stationery & Academic Kit',

      desc: 'Annual textbooks pack (NCERT & reference publications) + customized school notebooks & journals.',

      rates: [

        { label: 'Pre-Primary & Primary Classes', cost: '₹2,500 – ₹3,800 / year' },

        { label: 'Middle School (Class 6 to 8)', cost: '₹3,800 – ₹5,200 / year' },

        { label: 'Secondary & Senior (Class 9 to 12)', cost: '₹4,500 – ₹6,800 / year' }

      ]

    },

    {

      category: 'Nutritious Meal & Day-Boarding Cafeteria',

      desc: 'Optional hot cooked hygienic lunch + evening healthy snack prepared under certified nutritionist supervision.',

      rates: [

        { label: 'Monthly Dining Subscription', cost: '₹2,800 / month' },

        { label: 'Quarterly Dining Plan', cost: '₹8,000 / quarter' },

        { label: 'Daily Coupon (Emergency / Walk-in)', cost: '₹140 / day' }

      ]

    },

    {

      category: 'Specialized Sports & Hobby Academies',

      desc: 'Evening specialized sports coaching and international certification programs.',

      rates: [

        { label: 'Horse Riding & Equestrian Training', cost: '₹1,500 / month' },

        { label: 'Competitive Swimming Coaching', cost: '₹1,200 / month' },

        { label: 'Drone Pilot & Advanced Robotics Club', cost: '₹1,800 / month' }

      ]

    }

  ];



  // Fee Policy & Notes

  const feeNotesAndPolicies = [

    {

      title: 'Quarterly Billing Cycle & Due Dates',

      desc: 'Fees are payable on a quarterly basis by the 10th of April, July, October, and January. A grace period of 10 days is provided until the 20th of the due month without penalty.'

    },

    {

      title: '10% Sibling Fee Concession',

      desc: 'A permanent 10% concession on tuition fees is awarded to the younger sibling studying concurrently in the school.'

    },

    {

      title: 'Merit & Sports Scholarships',

      desc: 'Merit scholarships ranging from 25% to 50% on tuition fees are offered to students securing 90%+ in board exams or representing state/nation in recognized sports.'

    },

    {

      title: 'Caution Deposit & Refund Policy',

      desc: 'The one-time caution money (₹5,000) is 100% refundable without interest upon withdrawal and issuance of the Transfer Certificate (TC), provided one month prior notice is given.'

    },

    {

      title: 'Zero Gateway Charges Online Payment',

      desc: 'Parents can conveniently pay through the official School Parent Portal via UPI, NetBanking, Debit/Credit Card with 0% extra transaction charges.'

    },

    {

      title: 'Strict No Donation / Capitation Policy',

      desc: 'The school strictly adheres to the Right to Education Act and state fee regulatory frameworks. No capitation fee, development donation, or concealed charge is ever levied.'

    }

  ];



  // Admission Steps

  const admissionSteps = [

    {

      step: '01',

      title: 'Submit Online Inquiry',

      desc: 'Fill out the simple 2-minute application form with student details and select the desired class.'

    },

    {

      step: '02',

      title: 'Campus Walkthrough & Interaction',

      desc: 'Visit our campus for an informal interaction with teachers, tour our science labs, and inspect facilities.'

    },

    {

      step: '03',

      title: 'Document Verification',

      desc: 'Provide student birth certificate, transfer certificate (if applicable), and previous class report card.'

    },

    {

      step: '04',

      title: 'Seat Confirmation & Welcome Kit',

      desc: 'Complete fee enrollment and receive your student ID, school uniform set, academic calendar, and welcome pack.'

    }

  ];



  // Dynamic Facilities for Live Template (Initial template starts with 0 cards; user adds them)

  const effectiveFacilities = isLiveTemplate

    ? (templateData?.facilities || []).map((f) => {

        const IconComponent = (f.icon && ICON_MAP[f.icon]) ? ICON_MAP[f.icon] : Layers;

        const IllusComponent = (f.illustration && ILLUSTRATION_MAP[f.illustration])

          ? ILLUSTRATION_MAP[f.illustration]

          : ScienceLabIllustration;



        // Map custom points into specs if provided, else fallback to standard

        const customSpecs = (f.points && f.points.length > 0)

          ? f.points.map((pt, idx) => ({

              label: `Feature ${idx + 1}`,

              val: pt

            }))

          : [

              { label: 'Category', val: f.badge || 'General' },

              { label: 'Access', val: 'Open to all students' }

            ];



        return {

          id: f.id,

          name: f.title,

          desc: f.desc,

          photo: '',

          Illustration: IllusComponent,

          category: f.badge || 'School Facility',

          icon: IconComponent,

          iconName: f.icon,

          illustration: f.illustration,

          color: 'bg-[#006FCC]',

          tagline: f.title,

          details: f.desc,

          specs: customSpecs,

          points: f.points || [],

          capacity: 'Open Access',

          timings: 'School Working Hours',

          _raw: f

        };

      })

    : facilities;



  // Dynamic Admissions for Live Template (Initial template starts with 0 cards; user adds them)

  const effectiveAdmissionSteps = isLiveTemplate

    ? (templateData?.admissions || []).map((a, idx) => ({

        id: a.id,

        step: `0${idx + 1}`,

        title: a.title,

        desc: a.criteria + (a.fees ? ` • Fees: ${a.fees}` : ''),

        criteria: a.criteria,

        fees: a.fees,

        points: a.points,

        badge: a.badge,

        icon: a.icon,

        illustration: a.illustration,

        _raw: a

      }))

    : admissionSteps;



  const handleApplySubmit = (e: React.FormEvent) => {

    e.preventDefault();

    setIsSubmitted(true);

    setTimeout(() => {

      setIsSubmitted(false);

      setIsApplyModalOpen(false);

      setApplicantName('');

      setApplicantPhone('');

      setApplicantEmail('');

    }, 2000);

  };



  const handleReviewSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev = {

      id: Date.now(),

      author: reviewerName.trim(),

      role: reviewerRole,

      studentClass: reviewerClass.trim() || `${reviewerRole} Feedback`,

      date: 'Just now',

      rating: ratingOverall,

      likes: 1,

      comment: reviewComment.trim(),

      metrics: {

        academics: ratingAcademics,

        infrastructure: ratingInfrastructure,

        safety: ratingSafety,

        sports: ratingSports,

        value: ratingValue,

      }

    };

    setReviewsList([newRev, ...reviewsList]);

    setReviewSubmitted(true);

    setTimeout(() => {

      setReviewSubmitted(false);

      setIsWriteReviewOpen(false);

      setIsReviewModalOpen(false);

      setReviewerName('');

      setReviewComment('');

      setReviewerClass('');

    }, 1500);

  };



  const filteredReviewsList = reviewsList.filter((rev) => {

    if (reviewRoleFilter !== 'all') {

      if (!rev.role.toLowerCase().includes(reviewRoleFilter.toLowerCase())) {

        return false;

      }

    }

    if (reviewStarFilter !== 'all' && rev.rating !== reviewStarFilter) {

      return false;

    }

    if (reviewSearchText.trim()) {

      const q = reviewSearchText.toLowerCase();

      const matchAuthor = rev.author.toLowerCase().includes(q);

      const matchComment = rev.comment.toLowerCase().includes(q);

      const matchClass = (rev.studentClass || '').toLowerCase().includes(q);

      if (!matchAuthor && !matchComment && !matchClass) return false;

    }

    return true;

  }).sort((a, b) => {

    if (reviewSortBy === 'helpful') {

      const likesA = a.likes + (userLikesMap[a.id] ? 1 : 0);

      const likesB = b.likes + (userLikesMap[b.id] ? 1 : 0);

      return likesB - likesA;

    }

    if (reviewSortBy === 'highest') {

      return b.rating - a.rating;

    }

    return b.id - a.id;

  });



  return (

    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      

      {/* ========================================================= */}

      {/* 0. LIVE TEMPLATE WYSIWYG CONTROL BAR                      */}

      {/* ========================================================= */}

      {isLiveTemplate && (

        <TemplateControlBar

          currentTab={activeTab}

          onTabChange={(tab) => handleTabSwitch(tab as TabType)}

        />

      )}



      {/* ========================================================= */}

      {/* 1. TOP NAVBAR / HEADER                                    */}

      {/* ========================================================= */}

      <header className={`hidden md:block ${isLiveTemplate ? 'relative' : 'sticky top-0'} z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4rem] sm:min-h-[4.75rem] py-2 sm:py-2.5 flex items-center justify-between gap-4">

          

          {/* School Brand / Logo */}

          <div className="flex items-center gap-3 sm:gap-3.5 group min-w-0 text-left w-full lg:w-auto max-w-lg xl:max-w-2xl shrink-0">

            <button

              type="button"

              onClick={() => handleTabSwitch('home')}

              className="w-11 h-11 sm:w-12 sm:h-12 relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"

              title="Go to Home"

            >

              {actualSchoolLogo ? (

                <img

                  src={actualSchoolLogo}

                  alt={displayName}

                  className="w-full h-full object-cover"

                />

              ) : (

                <div className="w-full h-full bg-gradient-to-br from-[#005689] to-[#0D4979] text-white font-black text-base flex items-center justify-center">

                  {displayName ? displayName.charAt(0).toUpperCase() : 'S'}

                </div>

              )}

            </button>

            <div className="flex flex-col min-w-0 flex-1 justify-center">

              {/* Row 1: Large School Name + Interactive Tooltip Verified Badge */}

              <div className="flex items-center gap-2 flex-wrap">

                {isLiveTemplate && isEditMode ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-slate-950 leading-tight whitespace-normal break-words">
                      {templateData?.schoolName || displayName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 select-none shadow-xs" title="Official School Name is locked to Government UDISE+ record and cannot be changed">
                      <Lock className="w-2.5 h-2.5 text-amber-700" />
                      UDISE Locked
                    </span>

                    <span className="relative group/verified inline-flex items-center justify-center shrink-0 cursor-help" title="CSEEL Verified School">

                      <CheckCircle2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white fill-blue-600 drop-shadow-xs" />

                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/verified:flex flex-col items-center z-50 pointer-events-none transition-all">

                        <span className="bg-slate-900/95 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap leading-tight text-center border border-slate-700/50 flex items-center gap-1.5">

                          <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-900" />

                          <span>Officially Verified Institution by CSEEL</span>

                        </span>

                        <span className="w-2 h-2 bg-slate-900/95 rotate-45 -mt-0.5 border-r border-b border-slate-700/50"></span>

                      </span>

                    </span>

                  </div>

                ) : (

                  <span

                    onClick={() => handleTabSwitch('home')}

                    className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-slate-950 leading-tight whitespace-normal break-words cursor-pointer hover:text-[#005689] transition-colors inline"

                  >

                    {renderHeaderVerifiedSchoolName(displayName)}

                  </span>

                )}

              </div>

              {/* Row 2: UDISE Tag (Replaces Private Aided) • Location */}

              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 flex items-center gap-2 flex-wrap leading-tight">

                {/* Compact UDISE Tag */}

                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/90 text-slate-700 text-[10px] sm:text-[11px] font-semibold tracking-wide shrink-0">

                  <span className="text-slate-500 font-bold text-[9.5px]">UDISE:</span>

                  <span className="font-mono">{displayUdise}</span>

                  <VerifiedBadge fieldKey="udiseCode" size="sm" />

                </span>

                <span className="text-slate-300 select-none">•</span>

                <span className="font-medium text-slate-600">{displayDistrict}, {displayState}</span>

                <VerifiedBadge fieldKey="district" size="sm" />

              </div>

            </div>

          </div>



          {/* Desktop Nav Links (Tab Switcher: Horizontal Scrollable List) */}

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scrollbar-none py-1 max-w-[64vw]">

            {effectiveNavTabs.map((tab) => {

              const isActive = activeTab === tab.id;

              const Icon = tab.icon;

              return (

                <button

                  key={tab.id}

                  type="button"

                  onClick={() => handleTabSwitch(tab.id)}

                  className={`flex flex-col items-center justify-center gap-0.5 px-2.5 py-1 rounded-xl cursor-pointer transition-all shrink-0 ${

                    isActive

                      ? 'text-[#005689] font-bold border-b-2 border-[#FBBC04] bg-sky-50/50'

                      : 'text-gray-600 hover:text-[#006FCC] hover:bg-slate-50'

                  }`}

                >

                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#005689] stroke-[2.5]' : 'text-gray-500'}`} />

                  <span className="text-[11px] leading-tight whitespace-nowrap flex items-center gap-1">

                    {tab.shortLabel}

                    {isLiveTemplate && isEditMode && templateData?.tabVisibility?.[tab.id] === false && (

                      <span className="text-[9px] text-amber-500 font-bold" title="Tab is set to Private (Hidden in Preview)">🔒</span>

                    )}

                  </span>

                </button>

              );

            })}

          </nav>



          {/* Desktop Only Apply Button (Hidden on Mobile) */}

          <div className="hidden lg:flex items-center shrink-0">

            <button

              onClick={() => setIsApplyModalOpen(true)}

              className="button_primary inline-flex items-center justify-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-2.5 rounded-[12px] text-sm shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_22px_rgba(0,111,204,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer"

            >

              <span>Apply Now</span>

              <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />

            </button>

          </div>

        </div>



      </header>



      {/* ========================================================= */}

      {/* MOBILE LEFT MINI ICON DRAWER & EDGE PILL HANDLE           */}

      {/* ========================================================= */}

      

      {/* 1. Backdrop (Tap outside to close/hide menu, elevates above TopBar and Navbar) */}

      {isMobileMenuOpen && (

        <div

          className="fixed inset-0 z-[750] bg-black/50 backdrop-blur-xs transition-opacity lg:hidden"

          onClick={() => setIsMobileMenuOpen(false)}

          aria-label="Close menu backdrop"

        />

      )}



      {/* 2. Floating Edge Pill Handle (Smooth Tap / Click to Open, always accessible) */}

      {!isMobileMenuOpen && (

        <button

          type="button"

          onClick={(e) => {

            e.stopPropagation();

            setIsMobileMenuOpen(true);

          }}

          onPointerDown={(e) => e.stopPropagation()}

          onTouchStart={(e) => e.stopPropagation()}

          aria-label="Open Mobile Menu"

          className="fixed top-1/2 -translate-y-1/2 left-0 z-[700] lg:hidden bg-white border border-l-0 border-slate-200/90 text-slate-700 w-7 h-16 rounded-r-2xl shadow-[4px_4px_14px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 hover:bg-slate-50 touch-manipulation select-none"

        >

          <ChevronRight className="w-4 h-4 text-slate-600 stroke-[2.5]" />

        </button>

      )}



      {/* 3. Left Mini Drawer Sheet (Elevated z-[850], 100dvh for exact mobile screen fit, safe area support) */}

      <aside

        className={`fixed top-0 bottom-0 left-0 z-[850] w-[74px] sm:w-[80px] h-[100dvh] max-h-[100dvh] bg-white/95 backdrop-blur-md border-r border-slate-200/90 shadow-2xl flex flex-col items-center pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] justify-between transition-transform duration-300 ease-out lg:hidden select-none ${

          isMobileMenuOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'

        }`}

      >

        {/* Top: Compact Close Button Header */}

        <div className="w-full flex flex-col items-center py-1 border-b border-slate-100 shrink-0">

          <button

            type="button"

            onClick={() => setIsMobileMenuOpen(false)}

            aria-label="Close Menu"

            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-600 flex items-center justify-center transition-all cursor-pointer touch-manipulation"

          >

            <X className="w-3.5 h-3.5 stroke-[2.5]" />

          </button>

        </div>



        {/* Center: Mini Icons List with min-h-0 flex-1, smooth inertia touch scroll & slim scrollbar */}

        <div className="w-full flex-1 min-h-0 overflow-y-auto overscroll-contain py-1 px-1 flex flex-col gap-1 [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 touch-pan-y">

          {effectiveNavTabs.map((tab) => {

            const isActive = activeTab === tab.id;

            const Icon = tab.icon;

            return (

              <button

                key={tab.id}

                type="button"

                onClick={() => {

                  handleTabSwitch(tab.id);

                  setIsMobileMenuOpen(false);

                }}

                className={`w-full py-1.5 px-0.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer shrink-0 touch-manipulation active:scale-95 ${

                  isActive

                    ? 'bg-[#005689] text-white shadow-sm ring-2 ring-[#FBBC04]/50 font-bold'

                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'

                }`}

              >

                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />

                <span

                  className={`text-[8px] font-bold tracking-tight text-center leading-tight truncate w-full flex items-center justify-center gap-0.5 ${

                    isActive ? 'text-white' : 'text-slate-700'

                  }`}

                >

                  <span>{tab.shortLabel}</span>

                  {isLiveTemplate && isEditMode && templateData?.tabVisibility?.[tab.id] === false && (

                    <span className="text-[7px] text-amber-400">🔒</span>

                  )}

                </span>

              </button>

            );

          })}

        </div>



        {/* Bottom: Mini Apply CTA */}

        <div className="w-full pt-1 pb-0.5 border-t border-slate-100 flex flex-col items-center px-1 shrink-0">

          <button

            type="button"

            onClick={() => {

              setIsApplyModalOpen(true);

              setIsMobileMenuOpen(false);

            }}

            className="w-full py-1.5 px-0.5 rounded-[10px] bg-[#006FCC] hover:bg-[#005499] active:scale-95 text-white font-bold flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,111,204,0.35)] cursor-pointer transition touch-manipulation"

            title="Apply Now"

          >

            <ArrowRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />

            <span className="text-[7.5px] font-black uppercase tracking-wider mt-0.5 leading-none text-white">Apply</span>

          </button>

        </div>



        {/* Pull-back Handle on right border ONLY when drawer is open */}

        {isMobileMenuOpen && (

          <button

            type="button"

            onClick={(e) => {

              e.stopPropagation();

              setIsMobileMenuOpen(false);

            }}

            aria-label="Hide Menu"

            className="absolute top-1/2 -translate-y-1/2 -right-7 bg-white border border-l-0 border-slate-200/90 text-slate-700 w-7 h-16 rounded-r-2xl shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-90 transition-transform duration-200 touch-manipulation select-none"

          >

            <ChevronLeft className="w-4 h-4 text-slate-600 stroke-[2.5]" />

          </button>

        )}

      </aside>





      {/* ========================================================= */}

      {/* 2. HERO SECTION (5 AUTO-ROTATING REAL CAMPUS PHOTOS)       */}

      {/* ========================================================= */}

      {/* ─── TAB 1: HOME (Hero + About Us, Principal, Vision/Mission & Credentials) ─── */}

      {activeTab === 'home' && (
        <>
        <section id="home" className="relative overflow-hidden bg-gradient-to-r from-white via-white to-[#F0F6FA] pt-8 sm:pt-12 pb-20 sm:pb-24 border-b border-slate-100">

          

          {/* Subtle Dot Grid Pattern in Background (Clean, elegant positioning with smooth fade mask so dots do not appear chopped/uneven) */}

          <div 

            className="absolute top-4 sm:top-6 right-1/4 sm:right-1/3 w-72 h-64 bg-[radial-gradient(#005689_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-20 pointer-events-none z-0" 

            style={{

              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',

              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'

            }}

          />



          {/* Curved Brand Accent on the Far Right Edge with ADMISSION OPEN & Slowly Blinking Bulb (Seamless Layered Arc) */}

          <button

            type="button"

            onClick={() => setIsApplyModalOpen(true)}

            title="Admissions Open - Click to Apply"

            className="absolute top-0 right-0 w-16 sm:w-28 lg:w-48 h-full overflow-hidden z-10 text-left group cursor-pointer focus:outline-none"

          >

            {/* Layer 1: Warm Gold / Yellow Rim Accent (Flush Background Layer) */}

            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#FBBC04] via-[#F2A900] to-[#E59800] rounded-l-[45px] sm:rounded-l-[90px] lg:rounded-l-[140px] shadow-lg" />

            

            {/* Layer 2: Deep CSEEL Blue Main Body (Nested tightly with flush gold border, no white gap) */}

            <div className="absolute top-0 right-0 w-[calc(100%-4px)] sm:w-[calc(100%-8px)] lg:w-[calc(100%-12px)] h-full bg-gradient-to-b from-[#005689] via-[#004b77] to-[#003c6e] rounded-l-[42px] sm:rounded-l-[85px] lg:rounded-l-[135px] shadow-2xl flex flex-col items-center justify-center py-6">

              

              {/* Subtle Decorative Geometric Rings */}

              <div className="absolute -right-6 top-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full border-2 border-white/10 pointer-events-none" />

              <div className="absolute -right-2 bottom-12 w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-[#FBBC04]/20 pointer-events-none" />



              {/* Glowing Lightbulb (Blinks / Pulses Slowly) */}

              <div className="relative flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">

                <span className="absolute w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-400/30 animate-ping opacity-70" style={{ animationDuration: '3s' }} />

                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-300/40 shadow-[0_0_12px_rgba(251,188,4,0.6)]">

                  <Lightbulb

                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-300 animate-pulse drop-shadow-[0_0_6px_rgba(251,188,4,0.9)]"

                    style={{ animationDuration: '2.5s' }}

                  />

                </div>

              </div>



              {/* Vertical Text: ADMISSION OPEN */}

              <div className="flex flex-col items-center gap-2 [writing-mode:vertical-lr] rotate-180 select-none">

                <span className="text-[9px] sm:text-xs font-black tracking-[0.24em] uppercase text-white drop-shadow-sm group-hover:text-amber-200 transition-colors">

                  ADMISSION OPEN

                </span>

                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04] animate-pulse" />

              </div>



            </div>

          </button>



          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Live Template Onboarding & UDISE Fetch Guide Banner (Hidden in Preview Mode) */}

            {isLiveTemplate && isEditMode && (

              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#005689] via-[#004b77] to-[#003c6e] text-white shadow-xl border border-sky-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-3.5">

                  <div className="w-11 h-11 rounded-xl bg-[#FBBC04] text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">

                    ⚡

                  </div>

                  <div>

                    <div className="flex items-center gap-2 flex-wrap">

                      <span className="font-extrabold text-sm sm:text-base text-white">Live Interactive School Editor</span>

                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">

                        Auto-Save Active

                      </span>

                    </div>

                    <p className="text-xs text-sky-100 mt-1 max-w-xl leading-relaxed">

                      Enter your 11-digit UDISE code in the top bar to auto-populate all institutional data (Board, Principal, Address, Teachers, Students). You can edit any text or photos directly on this page!

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">

                  <span className="text-[11px] text-sky-200">Active UDISE:</span>

                  <span className="font-mono font-bold text-xs text-amber-300">{displayUdise}</span>

                </div>

              </div>

            )}



            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

              

              {/* Left Column (col-span-6): Typography & Action Buttons */}

              <div className="lg:col-span-6 text-left py-4 sm:py-6 max-w-[76%] sm:max-w-xl relative z-10">




                <EditableText

                  contentKey="hero_eyebrow"

                  value="SHAPING MINDS. BUILDING FUTURES."

                  className="inline-block text-[#005689] font-black text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4"

                  showVerificationBadge={false}

                />



                <EditableText

                  contentKey="hero_heading"

                  value="For A Better Tomorrow"

                  tag="h1"

                  className="text-3xl xs:text-4xl sm:text-5xl lg:text-[56px] font-black text-[#002B49] tracking-tight leading-[1.08] mb-5 block"

                  showVerificationBadge={false}

                />



                <EditableText

                  contentKey="hero_desc"

                  value={`Empowering students at ${displayName} with knowledge, values, and skills to become responsible global citizens.`}

                  multiline={true}

                  rows={2}

                  className="text-slate-600 text-sm sm:text-base lg:text-lg mb-8 leading-relaxed font-normal block"

                  showVerificationBadge={false}

                />



                {/* CSEEL Style Action Buttons */}

                <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">

                  <button

                    type="button"

                    onClick={() => handleTabSwitch('about')}

                    className="button_primary inline-flex items-center justify-center gap-2.5 bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-[12px] text-sm md:text-[15px] shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_22px_rgba(0,111,204,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"

                  >

                    <EditableText contentKey="hero_cta_explore" value="Explore More" showVerificationBadge={false} />

                    <ArrowRight className="w-4 h-4 text-white stroke-[2.5]" />

                  </button>



                  <button

                    type="button"

                    onClick={() => setIsTourModalOpen(true)}

                    className="button_secondary inline-flex items-center justify-center gap-2.5 bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] hover:text-[#005499] font-bold px-6 py-3 rounded-[12px] text-sm md:text-[15px] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"

                  >

                    <div className="w-5 h-5 rounded-full border border-[#006FCC] flex items-center justify-center text-[#006FCC] shrink-0">

                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />

                    </div>

                    <EditableText contentKey="hero_cta_video" value="Watch Video" showVerificationBadge={false} />

                  </button>

                </div>

              </div>



              {/* Right Column (col-span-12 lg:col-span-6): Campus Photo 3D Spiral Flipbook */}

              <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">

                <div className="relative w-full max-w-[560px] lg:max-w-[620px] xl:max-w-[660px] h-[320px] sm:h-[380px] lg:h-[400px]">

                  {/* 3D Smooth Page Flip Photo Book (Open Book on Desktop, Rolled Spiral Book on Mobile) */}

                  <SchoolPhotoBook

                    key={`${displayName}-${displayBoard}`}

                    displayName={displayName}

                    board={displayBoard}

                    primaryImage={imageUrl}

                    logoUrl={actualSchoolLogo}

                    onApplyClick={() => setIsApplyModalOpen(true)}

                    onTabSwitch={(tabId: any) => handleTabSwitch(tabId)}

                  />

                </div>

              </div>



            </div>

          </div>



          {/* Floating Stats Ribbon - 5 Stats in a Row matching reference screenshot */}

          <div className="relative z-20 max-w-6xl mx-auto px-4 mt-8 sm:mt-10">

            {/* ========================================================= */}
            {/* HERO FLOATING PRESTIGE BAR (Parent & Student Attraction) */}
            {/* ========================================================= */}
            <div className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,35,70,0.08)] border border-slate-100 p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              
              {/* Metric 1: Board Results / Academic Excellence (Top parent query) */}
              <div className="flex items-center gap-3.5 p-2">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="stat_icon_1" defaultIcon="Award" className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight flex items-center flex-wrap gap-1.5">
                    <EditableText
                      contentKey="hero_stat_val_1"
                      value="100%"
                      maxLength={10}
                      showVerificationBadge={false}
                      className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight"
                    />
                  </div>
                  <EditableText
                    contentKey="hero_stat_lbl_1"
                    value="Board Pass Rate"
                    maxLength={25}
                    className="text-xs font-semibold text-slate-500 block truncate"
                    showVerificationBadge={false}
                  />
                </div>
              </div>

              {/* Metric 2: Individual Attention / Student-Teacher Ratio */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#005689] flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="stat_icon_2" defaultIcon="Users" className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight flex items-center flex-wrap gap-1.5">
                    <EditableText
                      contentKey="hero_stat_val_2"
                      value="1:15"
                      maxLength={10}
                      showVerificationBadge={false}
                      className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight"
                    />
                  </div>
                  <EditableText
                    contentKey="hero_stat_lbl_2"
                    value="Student-Teacher Ratio"
                    maxLength={25}
                    className="text-xs font-semibold text-slate-500 block truncate"
                    showVerificationBadge={false}
                  />
                </div>
              </div>

              {/* Metric 3: Hi-Tech STEM & Modern Labs (Attracts Students) */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="stat_icon_3" defaultIcon="FlaskConical" className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight flex items-center flex-wrap gap-1.5">
                    <EditableText
                      contentKey="hero_stat_val_3"
                      value="25+"
                      maxLength={10}
                      showVerificationBadge={false}
                      className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight"
                    />
                  </div>
                  <EditableText
                    contentKey="hero_stat_lbl_3"
                    value="Hi-Tech Labs & Studios"
                    maxLength={25}
                    className="text-xs font-semibold text-slate-500 block truncate"
                    showVerificationBadge={false}
                  />
                </div>
              </div>

              {/* Metric 4: Accreditations & Awards */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="stat_icon_4" defaultIcon="ShieldCheck" className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight flex items-center flex-wrap gap-1.5">
                    <EditableText
                      contentKey="hero_stat_val_4"
                      value="50+"
                      maxLength={10}
                      showVerificationBadge={false}
                      className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight"
                    />
                  </div>
                  <EditableText
                    contentKey="hero_stat_lbl_4"
                    value="Awards & Honors"
                    maxLength={25}
                    className="text-xs font-semibold text-slate-500 block truncate"
                    showVerificationBadge={false}
                  />
                </div>
              </div>

              {/* Metric 5: Parent Trust & Satisfaction Rating */}
              <div className="flex items-center gap-3.5 p-2 sm:pl-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="stat_icon_5" defaultIcon="Star" className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight flex items-center flex-wrap gap-1.5">
                    <EditableText
                      contentKey="hero_stat_val_5"
                      value="99%"
                      maxLength={10}
                      showVerificationBadge={false}
                      className="text-xl sm:text-2xl font-black text-[#002B49] leading-tight"
                    />
                  </div>
                  <EditableText
                    contentKey="hero_stat_lbl_5"
                    value="Parent Trust Rating"
                    maxLength={25}
                    className="text-xs font-semibold text-slate-500 block truncate"
                    showVerificationBadge={false}
                  />
                </div>
              </div>

            </div>

          </div>



        </section>

        {/* ========================================================= */}

        {/* 3. ABOUT OUR SCHOOL SECTION (Now part of Home Tab)        */}

        {/* ========================================================= */}

        <section id="about" className="py-12 sm:py-16 bg-white relative">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              

              {/* Left Narrative Column */}

              <div className="lg:col-span-6 space-y-6">

                

                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689]">

                  <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />

                  <EditableText contentKey="about_eyebrow" value="ABOUT OUR SCHOOL" showVerificationBadge={false} />

                </div>



                <EditableText

                  contentKey="about_heading"

                  value="More Than Just An Education"

                  tag="h2"

                  className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight block"

                  showVerificationBadge={false}

                />



                {isLiveTemplate && isEditMode ? (

                  <EditableText

                    value={templateData?.aboutText || `At ${displayName}, we believe education is not just about knowledge, but about developing confident, compassionate and capable individuals. Our student-centered approach focuses on holistic growth — academically, socially, emotionally and creatively.`}

                    fieldKey="aboutText"

                    multiline={true}

                    rows={4}

                    showVerificationBadge={false}

                    className="text-gray-600 leading-relaxed text-sm sm:text-base w-full block"

                  />

                ) : (

                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">

                    {templateData?.aboutText || `At ${displayName}, we believe education is not just about knowledge, but about developing confident, compassionate and capable individuals. Our student-centered approach focuses on holistic growth — academically, socially, emotionally and creatively.`}

                  </p>

                )}



                <div>

                  <button

                    onClick={() => setIsApplyModalOpen(true)}

                    className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-3 rounded-[12px] text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"

                  >

                    <EditableText contentKey="about_cta_btn" value="Discover Our Story" showVerificationBadge={false} />

                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />

                  </button>

                </div>



              </div>



              {/* Right Multi-Image Showcase with Handwritten Badge */}

              <div className="lg:col-span-6 relative pb-6 lg:pb-0">

                

                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-slate-100">

                  <EditableImage

                    imageKey="about_campus_photo"

                    defaultSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='%23002B49'%3E%3Crect width='800' height='600' fill='%230D4979'/%3E%3Crect y='480' width='800' height='120' fill='%2309375C'/%3E%3Cg fill='%23196296' opacity='0.7'%3E%3Crect x='100' y='220' width='220' height='260' rx='8'/%3E%3Crect x='360' y='160' width='340' height='320' rx='8'/%3E%3Cpolygon points='400,160 530,70 660,160' fill='%232279B5'/%3E%3Crect x='490' y='180' width='80' height='100' rx='4' fill='%23EDF5FA' opacity='0.8'/%3E%3C/g%3E%3Cg fill='%23EDF5FA' opacity='0.85'%3E%3Ccircle cx='530' cy='230' r='18' fill='%23005689'/%3E%3Crect x='140' y='260' width='40' height='50' rx='4'/%3E%3Crect x='200' y='260' width='40' height='50' rx='4'/%3E%3Crect x='260' y='260' width='40' height='50' rx='4'/%3E%3Crect x='140' y='340' width='40' height='50' rx='4'/%3E%3Crect x='200' y='340' width='40' height='50' rx='4'/%3E%3Crect x='260' y='340' width='40' height='50' rx='4'/%3E%3Crect x='410' y='320' width='50' height='60' rx='4'/%3E%3Crect x='490' y='320' width='50' height='60' rx='4'/%3E%3Crect x='570' y='320' width='50' height='60' rx='4'/%3E%3Crect x='650' y='320' width='35' height='60' rx='4'/%3E%3C/g%3E%3Ctext x='400' y='535' font-family='system-ui, sans-serif' font-size='22' font-weight='bold' fill='%23FFFFFF' text-anchor='middle'%3EOfficial Campus Infrastructure%3C/text%3E%3Ctext x='400' y='565' font-family='system-ui, sans-serif' font-size='14' fill='%2393C5FD' text-anchor='middle'%3EMedia to be Uploaded by School Administration%3C/text%3E%3C/svg%3E"

                    alt={`${displayName} Campus Architecture`}

                    className="w-full h-full object-cover"

                  />

                </div>



                <div className="absolute -top-5 right-2 sm:-right-4 bg-[#EDF5FA] border border-[#D6EDFF] rounded-2xl px-4 py-2 shadow-lg -rotate-6 z-20">

                  <EditableText

                    contentKey="about_badge_text"

                    value="A Campus Built for Big Dreams ✨"

                    className="font-serif italic text-[#005689] font-bold text-sm tracking-wide"

                    showVerificationBadge={false}

                  />

                </div>



                <div className="absolute -bottom-6 -right-3 sm:-right-6 w-40 sm:w-56 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-20">

                  <EditableImage

                    imageKey="about_lab_photo"

                    defaultSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 450' fill='%23005689'%3E%3Crect width='600' height='450' fill='%23EDF5FA'/%3E%3Cg fill='%23006FCC' opacity='0.85'%3E%3Cpath d='M280 140v80l-60 100c-8 13 1 30 17 30h126c16 0 25-17 17-30l-60-100v-80h10c6 0 10-4 10-10s-4-10-10-10h-60c-6 0-10 4-10 10s4 10 10 10h10z'/%3E%3Ccircle cx='290' cy='290' r='12' fill='%2338BDF8'/%3E%3Ccircle cx='320' cy='310' r='8' fill='%2338BDF8'/%3E%3Ccircle cx='280' cy='320' r='6' fill='%2338BDF8'/%3E%3C/g%3E%3Ctext x='300' y='390' font-family='system-ui, sans-serif' font-size='18' font-weight='bold' fill='%23002B49' text-anchor='middle'%3EExperiential Learning Lab%3C/text%3E%3Ctext x='300' y='415' font-family='system-ui, sans-serif' font-size='13' fill='%2364748B' text-anchor='middle'%3ELaboratory Media to be Uploaded%3C/text%3E%3C/svg%3E"

                    alt="Students in Science Lab"

                    className="w-full h-full object-cover"

                  />

                </div>



              </div>



            </div>



            {/* 4 Stat Cards in 1 Single Line (4 Columns, Compact Size) */}

            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-4 gap-2 sm:gap-4">

              

              {/* Card 1: Established Year */}
              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="about_stat_icon_1" defaultIcon="Building2" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <EditableText contentKey="about_stat_lbl_1" value="Established" maxLength={25} className="text-[10px] sm:text-xs text-gray-500 font-medium block truncate" showVerificationBadge={false} />
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        value={templateData?.establishedYear || displayEstablished}
                        fieldKey="establishedYear"
                        maxLength={12}
                        showVerificationBadge={false}
                        className="text-xs sm:text-xl font-black text-gray-950 leading-tight"
                      />
                    ) : (
                      <span>{displayEstablished}</span>
                    )}
                    <VerifiedBadge fieldKey="establishedYear" size="sm" />
                  </div>
                </div>
              </div>

              {/* Card 2: Student Strength */}
              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="about_stat_icon_2" defaultIcon="Users" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <EditableText contentKey="about_stat_lbl_2" value="Students" maxLength={25} className="text-[10px] sm:text-xs text-gray-500 font-medium block truncate" showVerificationBadge={false} />
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        value={String(templateData?.totalStudents ?? 1250)}
                        fieldKey="totalStudents"
                        maxLength={12}
                        showVerificationBadge={false}
                        className="text-xs sm:text-xl font-black text-gray-950 leading-tight"
                      />
                    ) : (
                      <span>{displayStudents}</span>
                    )}
                    <VerifiedBadge fieldKey="totalStudents" size="sm" />
                  </div>
                </div>
              </div>

              {/* Card 3: Faculty Strength */}
              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="about_stat_icon_3" defaultIcon="Award" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <EditableText contentKey="about_stat_lbl_3" value="Faculty" maxLength={25} className="text-[10px] sm:text-xs text-gray-500 font-medium block truncate" showVerificationBadge={false} />
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        value={String(templateData?.totalTeachers ?? 65)}
                        fieldKey="totalTeachers"
                        maxLength={12}
                        showVerificationBadge={false}
                        className="text-xs sm:text-xl font-black text-gray-950 leading-tight"
                      />
                    ) : (
                      <span>{displayTeachers}</span>
                    )}
                    <VerifiedBadge fieldKey="totalTeachers" size="sm" />
                  </div>
                </div>
              </div>

              {/* Card 4: Campus Area */}
              <div className="bg-white rounded-xl p-2 sm:p-3.5 shadow-2xs border border-gray-100 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-3 hover:shadow-xs transition-shadow min-w-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">
                  <EditableIcon iconKey="about_stat_icon_4" defaultIcon="Compass" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 w-full">
                  <EditableText contentKey="about_stat_lbl_4" value="Campus Area" maxLength={25} className="text-[10px] sm:text-xs text-gray-500 font-medium block truncate" showVerificationBadge={false} />
                  <div className="text-xs sm:text-xl font-black text-gray-950 truncate flex items-center gap-1">
                    {isLiveTemplate && isEditMode ? (
                      <EditableText
                        value={templateData?.campusArea || '12 Acres'}
                        fieldKey="campusArea"
                        maxLength={18}
                        showVerificationBadge={false}
                        className="text-xs sm:text-xl font-black text-gray-950 leading-tight"
                      />
                    ) : (
                      <span>{templateData?.campusArea || '12 Acres'}</span>
                    )}
                  </div>
                </div>
              </div>



            </div>



          </div>

        </section>



        {/* ========================================================= */}

        {/* COLLAPSIBLE ACCREDITATION & QUICK PROFILE CARD            */}

        {/* ========================================================= */}

        <section id="credentials" className="py-2.5 sm:py-3.5 bg-slate-50/70">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-hidden">

              

              {/* Collapsible Header (Click to Open/Close) */}

              <button

                type="button"

                onClick={() => setIsCredOpen(prev => !prev)}

                className="w-full flex items-center justify-between p-3 sm:px-4 text-left hover:bg-slate-50 transition cursor-pointer"

              >

                <div className="flex items-center gap-2.5">

                  <div className="w-7 h-7 rounded-lg bg-[#EDF5FA] text-[#005689] flex items-center justify-center shrink-0 border border-[#D0E5F5]/60">

                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>

                  </div>

                  <div>

                    <span className="text-[8.5px] font-bold tracking-wider uppercase text-[#005689] block leading-none">Accreditation</span>

                    <h3 className="text-xs sm:text-[13px] font-black text-[#002B49] leading-tight flex items-center gap-1.5">

                      <span>Quick Profile</span>

                      <span className="text-[10px] font-normal text-slate-500">

                        {isCredOpen ? '(Tap to collapse)' : '(Tap to expand)'}

                      </span>

                    </h3>

                  </div>

                </div>



                <div className="flex items-center gap-2.5">

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">

                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>UDISE Verified

                  </span>

                  

                  {/* Visible Arrow / Chevron Icon */}

                  <div className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-200 ${isCredOpen ? 'rotate-180' : ''}`}>

                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>

                  </div>

                </div>

              </button>



              {/* Collapsible List Content (Hidden by default) */}

              <div className={`${isCredOpen ? 'block' : 'hidden'} border-t border-slate-100 bg-[#F8FAFC] divide-y divide-slate-100`}>

                

                {/* Board */}

                <div className="flex items-center justify-between px-4 py-2.5 text-xs">

                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Board</span>

                  <span className="font-bold text-slate-900 flex items-center gap-1.5">

                    {isLiveTemplate && isEditMode ? (

                      <EditableText

                        value={templateData?.board || displayBoard}

                        fieldKey="board"

                        showVerificationBadge={false}

                        className="font-bold text-slate-900"

                      />

                    ) : (

                      <span>{boardsList.length > 0 ? boardsList.join(' / ') : displayBoard}</span>

                    )}

                    <VerifiedBadge fieldKey="board" size="sm" />

                  </span>

                </div>



                {/* UDISE Code */}

                <div className="flex items-center justify-between px-4 py-2.5 text-xs">

                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">UDISE Code</span>

                  <span className="font-mono font-bold text-slate-900 flex items-center gap-1.5">

                    <span className="font-mono font-bold text-slate-900 inline-flex items-center gap-1.5">
                      <span>{displayUdise}</span>
                      {isLiveTemplate && isEditMode && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 select-none" title="UDISE Code is verified and locked">
                          <Lock className="w-2.5 h-2.5 text-amber-700" /> Locked
                        </span>
                      )}
                    </span>

                    <VerifiedBadge fieldKey="udiseCode" size="sm" />

                  </span>

                </div>



                {/* School Type */}

                <div className="flex items-center justify-between px-4 py-2.5 text-xs">

                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">School Type</span>

                  <span className="font-bold text-slate-900 flex items-center gap-1.5">

                    {isLiveTemplate && isEditMode ? (

                      <EditableText

                        value={templateData?.management || displayManagementLabel}

                        fieldKey="management"

                        showVerificationBadge={false}

                        className="font-bold text-slate-900"

                      />

                    ) : (

                      <span>{displayManagementLabel}</span>

                    )}

                    <VerifiedBadge fieldKey="management" size="sm" />

                  </span>

                </div>



                {/* Medium */}

                <div className="flex items-center justify-between px-4 py-2.5 text-xs">

                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Medium</span>

                  <span className="font-bold text-slate-900 flex items-center gap-1.5">

                    {isLiveTemplate && isEditMode ? (

                      <EditableText

                        value={templateData?.medium || displayMedium}

                        fieldKey="medium"

                        showVerificationBadge={false}

                        className="font-bold text-slate-900"

                      />

                    ) : (

                      <span>{mediumsList.length > 0 ? mediumsList.join(' / ') : displayMedium}</span>

                    )}

                    <VerifiedBadge fieldKey="medium" size="sm" />

                  </span>

                </div>



                {/* Classes */}

                <div className="flex items-center justify-between px-4 py-2.5 text-xs">

                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Classes</span>

                  <span className="font-bold text-slate-900 flex items-center gap-1.5">

                    {isLiveTemplate && isEditMode ? (

                      <span className="flex items-center gap-1 font-bold text-slate-900">

                        <EditableText

                          value={templateData?.classFrom || classFrom || 'Class 1'}

                          fieldKey="classFrom"

                          showVerificationBadge={false}

                          className="font-bold text-slate-900"

                        />

                        <span>to</span>

                        <EditableText

                          value={templateData?.classTo || classTo || 'Class 12th'}

                          fieldKey="classTo"

                          showVerificationBadge={false}

                          className="font-bold text-slate-900"

                        />

                      </span>

                    ) : (

                      <span>{displayClasses}</span>

                    )}

                    <VerifiedBadge fieldKey="classFrom" size="sm" />

                  </span>

                </div>



              </div>



            </div>

          </div>

        </section>





      {/* ========================================================= */}

      {/* 4. MESSAGE FROM THE PRINCIPAL SECTION                     */}

      {/* ========================================================= */}

      <section id="principal" className="pt-8 sm:pt-14 pb-4 sm:pb-8 bg-gradient-to-b from-white via-sky-50/50 to-white relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          

          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">

            <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />

            <EditableText

              contentKey="principal_eyebrow"

              value="MESSAGE FROM THE PRINCIPAL"

              className="inline-block"

            />

          </div>



          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-12">

            <EditableText

              contentKey="principal_heading"

              value="A Message for a Brighter Tomorrow"

              className="inline"

            />

          </h2>



          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            

            {/* Left Principal Photo Card */}

            <div className="lg:col-span-4">

              <div className="bg-white rounded-3xl p-3 shadow-lg border border-gray-100 max-w-sm mx-auto">

                <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">

                  <EditableImage

                    imageKey="principal_photo"

                    defaultSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250' fill='%23f1f5f9'%3E%3Crect width='200' height='250' fill='%23f8fafc'/%3E%3Ccircle cx='100' cy='85' r='38' fill='%23cbd5e1'/%3E%3Cpath d='M35 210c0-42 29-65 65-65s65 23 65 65z' fill='%23cbd5e1'/%3E%3Ctext x='100' y='235' font-family='sans-serif' font-size='11' font-weight='600' fill='%2394a3b8' text-anchor='middle'%3EPrincipal Desk%3C/text%3E%3C/svg%3E"

                    alt={displayPrincipal}

                    className="w-full h-full object-cover object-top"

                  />

                </div>

                <div className="p-4 flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">

                    <EditableIcon iconKey="principal_badge_icon" defaultIcon="Building" className="w-5 h-5" />

                  </div>

                  <div>

                    <h3 className="font-bold text-gray-950 text-base leading-snug flex items-center gap-1.5">

                      {isLiveTemplate && isEditMode ? (

                        <EditableText

                          value={templateData?.principalName || displayPrincipal}

                          fieldKey="principalName"

                          showVerificationBadge={false}

                          className="font-bold text-gray-950 text-base leading-snug"

                        />

                      ) : (

                        <span>{displayPrincipal}</span>

                      )}

                      <VerifiedBadge fieldKey="principalName" size="sm" />

                    </h3>

                    <EditableText

                      contentKey="principal_role_label"

                      value="Principal / Head of Institution"

                      className="text-xs text-gray-500 font-medium block"

                    />

                  </div>

                </div>

              </div>

            </div>



            {/* Right Quote & Narrative */}

            <div className="lg:col-span-8 space-y-6">

              

              <div className="bg-[#EDF5FA] border border-[#D6EDFF] rounded-3xl p-6 sm:p-8 relative">

                <div className="text-amber-400 text-5xl font-serif leading-none select-none">“</div>

                <EditableText

                  contentKey="principal_quote"

                  value='"Our commitment is to cultivate an inspiring learning space rooted in inquiry, character, and experiential discovery."'

                  multiline={true}

                  rows={2}

                  className="italic text-base sm:text-lg text-gray-800 font-medium mt-1 leading-relaxed block"

                />

                <EditableText

                  contentKey="principal_quote_author"

                  value="— From the Principal's Desk"

                  className="text-xs text-gray-500 font-semibold mt-3 block"

                />

              </div>



              <EditableText

                contentKey="principal_narrative"

                value={`At ${displayName}, we are committed to nurturing every child's unique potential. Our goal is to create a safe, supportive and inspiring environment where students not only excel academically, but also grow into responsible, kind and confident global citizens.`}

                multiline={true}

                rows={4}

                className="text-gray-600 text-sm sm:text-base leading-relaxed block"

              />



              <div className="pt-4 flex items-center gap-6">

                <div>

                  <div className="font-serif italic text-2xl sm:text-3xl text-[#005689] font-bold tracking-wide">

                    {displayPrincipal.replace(/^(Dr\.|Mrs\.|Mr\.|Shri|Ms\.)\s*/i, '')}

                  </div>

                  <div className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1.5">

                    <span>{displayPrincipal}, Principal</span>

                    <VerifiedBadge fieldKey="principalName" size="sm" />

                  </div>

                </div>

              </div>



            </div>



          </div>



        </div>

      </section>



      {/* ========================================================= */}

      {/* 5. OUR GUIDING PRINCIPLES (WITH MATCHING ILLUSTRATIONS)   */}

      {/* ========================================================= */}

      <section id="principles" className="pt-6 sm:pt-10 pb-10 sm:pb-16 bg-white relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          

          <div className="text-left max-w-2xl mb-8 sm:mb-10">

            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">

              <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />

              <EditableText

                contentKey="principles_eyebrow"

                value="VISION • MISSION • VALUES"

                className="inline-block"

              />

            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">

              <EditableText

                contentKey="principles_heading"

                value="Our Guiding Principles"

                className="inline"

              />

            </h2>

            <EditableText

              contentKey="principles_subheading"

              value="Every initiative, laboratory experiment, and classroom interaction is driven by our core philosophy to nurture holistic global citizens."

              multiline={true}

              rows={2}

              className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed block"

            />

          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

            

            {/* Card 1: Vision (Telescope / Looking into Future) */}

            <div className="bg-gradient-to-b from-blue-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">

              <div>

                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-blue-50 group-hover:scale-105 transition-transform duration-500">

                  <EditableImage

                    imageKey="vision_image"

                    defaultSrc="/images/illustrations/vision-telescope.jpg"

                    alt="Vision Illustration"

                    className="w-full h-full object-contain"

                  />

                </div>

                <div className="flex items-center gap-3 mb-3">

                  <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center">

                    <EditableIcon iconKey="vision_icon" defaultIcon="Eye" className="w-5 h-5" />

                  </div>

                  <EditableText

                    contentKey="vision_title"

                    value="Vision"

                    className="text-2xl font-bold text-gray-950 inline-block"

                  />

                </div>

                {isLiveTemplate && isEditMode ? (

                  <EditableText

                    value={templateData?.visionText || 'Empowering every learner to imagine, explore, and create a better future through deep curiosity, scientific inquiry, and purposeful leadership.'}

                    fieldKey="visionText"

                    multiline={true}

                    rows={3}

                    showVerificationBadge={false}

                    className="text-gray-600 text-sm leading-relaxed block"

                  />

                ) : (

                  <p className="text-gray-600 text-sm leading-relaxed">

                    {templateData?.visionText || 'Empowering every learner to imagine, explore, and create a better future through deep curiosity, scientific inquiry, and purposeful leadership.'}

                  </p>

                )}

              </div>



              <div className="pt-6 border-t border-blue-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">

                <Sparkles className="w-4 h-4 text-amber-400" />

                <EditableText

                  contentKey="vision_tagline"

                  value="Future-Ready Thinking"

                  className="inline-block"

                />

              </div>

            </div>



            {/* Card 2: Mission (Target & Goal Collaboration) */}

            <div className="bg-gradient-to-b from-sky-50/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">

              <div>

                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-sky-50 group-hover:scale-105 transition-transform duration-500">

                  <EditableImage

                    imageKey="mission_image"

                    defaultSrc="/images/illustrations/mission-target.png"

                    alt="Mission Illustration"

                    className="w-full h-full object-contain"

                  />

                </div>

                <div className="flex items-center gap-3 mb-3">

                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">

                    <EditableIcon iconKey="mission_icon" defaultIcon="Target" className="w-5 h-5" />

                  </div>

                  <EditableText

                    contentKey="mission_title"

                    value="Mission"

                    className="text-2xl font-bold text-gray-950 inline-block"

                  />

                </div>

                {isLiveTemplate && isEditMode ? (

                  <EditableText

                    value={templateData?.missionText || 'To provide meaningful, experiential learning environments that cultivate real-world problem solving, character building, and creative confidence.'}

                    fieldKey="missionText"

                    multiline={true}

                    rows={3}

                    showVerificationBadge={false}

                    className="text-gray-600 text-sm leading-relaxed block"

                  />

                ) : (

                  <p className="text-gray-600 text-sm leading-relaxed">

                    {templateData?.missionText || 'To provide meaningful, experiential learning environments that cultivate real-world problem solving, character building, and creative confidence.'}

                  </p>

                )}

              </div>



              <div className="pt-6 border-t border-sky-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">

                <Sparkles className="w-4 h-4 text-amber-400" />

                <EditableText

                  contentKey="mission_tagline"

                  value="Action-Oriented Learning"

                  className="inline-block"

                />

              </div>

            </div>



            {/* Card 3: Values (Care, Empathy & Growth) */}

            <div className="bg-gradient-to-b from-amber-50/40 via-white to-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">

              <div>

                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white mb-6 p-2 flex items-center justify-center border border-amber-50 group-hover:scale-105 transition-transform duration-500">

                  <EditableImage

                    imageKey="values_image"

                    defaultSrc="/images/illustrations/values-community.jpg"

                    alt="Values Illustration"

                    className="w-full h-full object-contain"

                  />

                </div>

                <div className="flex items-center gap-3 mb-3">

                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">

                    <EditableIcon iconKey="values_icon" defaultIcon="Heart" className="w-5 h-5" />

                  </div>

                  <EditableText

                    contentKey="values_title"

                    value="Values"

                    className="text-2xl font-bold text-gray-950 inline-block"

                  />

                </div>



                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700 pt-1">

                  {['Integrity', 'Curiosity', 'Respect', 'Excellence', 'Innovation', 'Compassion'].map((val, idx) => (

                    <div key={val} className="flex items-center gap-2">

                      <div className="w-3.5 h-3.5 rounded-full bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0">

                        <Check className="w-2.5 h-2.5 stroke-[3]" />

                      </div>

                      <EditableText

                        contentKey={`value_item_${idx}`}

                        value={val}

                        className="inline-block"

                      />

                    </div>

                  ))}

                </div>

              </div>



              <div className="pt-6 border-t border-amber-50 mt-6 flex items-center gap-2 text-xs font-bold text-[#006FCC]">

                <Sparkles className="w-4 h-4 text-amber-400" />

                <EditableText

                  contentKey="values_tagline"

                  value="Character & Empathy"

                  className="inline-block"

                />

              </div>

            </div>



          </div>



        </div>
      </section>

      {/* School Frequently Asked Questions (FAQ) Section */}
      <SchoolFaqSection id="home-faq" />
        </>
      )}





      {/* ========================================================= */}

      {/* 3.5 ACADEMICS, CURRICULUM & NEP 2020 PEDAGOGY TAB         */}

      {/* ========================================================= */}

      {activeTab === 'academics' && (

        <section id="academics" className="py-12 sm:py-16 bg-white relative">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}

            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">

              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">

                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />

                <EditableText

                  contentKey="academics_eyebrow"

                  value="ACADEMIC EXCELLENCE & CURRICULUM"

                  className="inline-block"

                />

              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">

                <EditableText

                  contentKey="academics_heading"

                  value="Rigorous Academics, NEP 2020 Aligned Pedagogy"

                  className="inline"

                />

              </h2>

              <EditableText

                contentKey="academics_description"

                value={`At ${displayName}, education transcends rote memorization. We integrate experiential STEM learning, critical inquiry, and comprehensive continuous evaluation from foundational years to senior secondary board examinations.`}

                multiline={true}

                rows={3}

                className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed block"

              />

            </div>



            {/* 4 Pillars of Learning */}

            {/* Classes Offered Range */}

            <div className="mb-10 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>

                <h3 className="text-xl font-black text-gray-950 flex items-center gap-2">

                  <GraduationCap className="w-6 h-6 text-[#005689]" />

                  Classes Offered

                </h3>

                <p className="text-sm text-gray-500 mt-1">Select the grade range available at this school</p>

              </div>

              <div className="flex items-center gap-3">

                {isEditMode ? (

                  <>

                    <input type="text" className="w-24 sm:w-32 px-3 py-2 text-sm font-bold border border-blue-200 rounded-xl text-center focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors" defaultValue="Nursery" />

                    <span className="text-gray-400 font-medium">to</span>

                    <input type="text" className="w-24 sm:w-32 px-3 py-2 text-sm font-bold border border-blue-200 rounded-xl text-center focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-colors" defaultValue="Class 12" />

                  </>

                ) : (

                  <>

                    <span className="bg-blue-50 text-[#005689] font-bold px-5 py-2.5 rounded-xl border border-blue-100 shadow-sm">Nursery</span>

                    <span className="text-gray-400 font-medium text-sm uppercase tracking-widest">to</span>

                    <span className="bg-blue-50 text-[#005689] font-bold px-5 py-2.5 rounded-xl border border-blue-100 shadow-sm">Class 12</span>

                  </>

                )}

              </div>

            </div>



            {/* Senior Secondary Academic Streams & Subjects */}

            <div className="mb-14">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">

                <div>

                  <h3 className="text-2xl font-black text-gray-950 flex items-center gap-2">

                    <BookOpen className="w-6 h-6 text-[#005689]" />

                    Academic Streams & Subjects

                  </h3>

                  <p className="text-sm text-gray-500 mt-1">Categorized subjects offered under different academic streams</p>

                </div>

                

              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {streamCategories.map((stream, sIdx) => (

                  <div key={sIdx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group/stream hover:shadow-md transition-shadow">

                    {/* Delete Stream Button */}

                    {isEditMode && (

                      <button 

                        onClick={() => removeStream(sIdx)}

                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/stream:opacity-100"

                        title="Remove Stream"

                      >

                        <X className="w-4 h-4" />

                      </button>

                    )}

                    

                    <div className="flex items-center gap-2 mb-3">

                      <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>

                      <h4 className="text-sm font-bold text-gray-900">{stream.name}</h4>

                    </div>



                    <div className="flex flex-wrap gap-2">

                      {stream.subjects.map((sub, i) => (

                        <div key={i} className="group/sub flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full hover:bg-gray-100 transition-colors cursor-default">

                          <span className="text-[11px] font-medium text-gray-700">{sub}</span>

                          {isEditMode && (

                            <button 

                              onClick={() => removeSubject(sIdx, i)}

                              className="text-gray-400 hover:text-red-500 transition-colors"

                            >

                              <X className="w-3 h-3" />

                            </button>

                          )}

                        </div>

                      ))}

                      {stream.subjects.length === 0 && (

                        <span className="text-[11px] text-gray-400 italic py-1">No subjects</span>

                      )}

                      

                      {/* Add Subjects Input Inline */}

                      {isEditMode && (

                        <input 

                          type="text" 

                          placeholder="+ Add subject..." 

                          className="px-2.5 py-1 text-[11px] font-medium border border-dashed border-gray-300 rounded-full focus:outline-none focus:border-blue-400 bg-transparent w-28 sm:w-32 text-gray-600 placeholder-gray-400"

                          value={newSubjectInputs[sIdx] || ''}

                          onChange={(e) => setNewSubjectInputs(prev => ({...prev, [sIdx]: e.target.value}))}

                          onKeyDown={(e) => handleAddSubjectToStream(e, sIdx)}

                        />

                      )}

                    </div>

                  </div>

                ))}

                

                {streamCategories.length === 0 && (

                  <div className="col-span-1 md:col-span-2 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500">

                    No streams added. Use the input below to add a stream.

                  </div>

                )}

                

                {isEditMode && (

                  <div className="col-span-1 md:col-span-2 pt-2 flex justify-start">

                    <input 

                      type="text" 

                      placeholder="+ Add new stream (Type & Enter)..." 

                      className="px-4 py-2 text-sm font-medium border border-dashed border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 w-full sm:w-auto min-w-[250px] shadow-sm transition-all text-gray-600"

                      value={newStreamTitle}

                      onChange={(e) => setNewStreamTitle(e.target.value)}

                      onKeyDown={handleAddNewStream}

                    />

                  </div>

                )}

              </div>

            </div>



            {/* Official Board Examination Records Section */}
            <div className="bg-[#EDF5FA] rounded-[32px] p-8 sm:p-12 border border-[#D6EDFF] text-center max-w-4xl mx-auto my-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-white text-[#005689] flex items-center justify-center mx-auto shadow-xs border border-blue-100 mb-4">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-[#005689] text-xs font-bold uppercase tracking-wider mb-3">
                <span>Official Academic Records</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#002B49] tracking-tight">
                Board Examination Results & Merit Honors
              </h3>
              <p className="text-sm text-gray-600 mt-2.5 max-w-xl mx-auto leading-relaxed">
                Official Class 10th and 12th board merit results, subject pass percentages, and academic honors for {displayName} are submitted and verified during institutional accreditation cycles.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 text-xs font-semibold text-slate-700 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official Records Awaiting Direct Upload by School Administration</span>
              </div>
            </div>

          </div>

        </section>

      )}

      {/* 6. OUR FACILITIES SECTION (10-GRID)                       */}

            {/* ========================================================= */}

      {/* ─── TAB 5: FACILITIES ─── */}

      {activeTab === 'facilities' && (

        <section id="facilities" className="pt-10 sm:pt-16 pb-6 sm:pb-8 bg-[#F8FAFC] relative">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="mb-10">

              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">

                <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />

                <EditableText

                  contentKey="facilities_eyebrow"

                  value="OUR FACILITIES"

                  className="inline-block"

                />

              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">

                <EditableText

                  contentKey="facilities_heading"

                  value="Everything Students Need to Learn, Explore & Grow"

                  className="inline"

                />

              </h2>

              {isLiveTemplate && isEditMode && (

                <p className="mt-3 text-gray-600 font-medium max-w-2xl">

                  Select the facilities available at your school. This helps parents understand your infrastructure at a glance.

                </p>

              )}

            </div>



            <div className="space-y-10">

              {FACILITY_CATEGORIES.map((category) => {

                // Determine if we should show this category in view mode (only if it has selected items)

                const selectedItemsInCategory = category.items.filter(item => 

                  effectiveFacilities.some(f => f.name === item.name)

                );

                

                if (!isEditMode && selectedItemsInCategory.length === 0) return null;



                return (

                  <div key={category.category} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">

                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">

                      {renderCategoryHeaderIcon(category.category, category.categoryIcon)}

                      <h3 className="text-xl font-bold text-[#002B49]">{category.category}</h3>

                    </div>



                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">

                      {(isEditMode ? category.items : selectedItemsInCategory).map((item) => {

                        const isSelected = effectiveFacilities.some(f => f.name === item.name);

                        return (

                          <div

                            key={item.name}

                            onClick={() => {

                              if (!isEditMode || !templateCtx) return;

                              if (isSelected) {

                                // Find ID and delete

                                const existing = effectiveFacilities.find(f => f.name === item.name);

                                if (existing && existing.id) {

                                  templateCtx.deleteFacilityCard(existing.id);

                                }

                              } else {

                                // Add minimal card

                                templateCtx.addFacilityCard({

                                  title: item.name,

                                  desc: '',

                                  icon: item.icon, // Store image URL as icon

                                  points: [],

                                });

                              }

                            }}

                            className={`

                              relative flex flex-col items-center justify-center text-center gap-2 p-2.5 rounded-xl border transition-all

                              ${isEditMode ? 'cursor-pointer hover:shadow-md' : ''}

                              ${isSelected 

                                ? 'border-[#005689] bg-[#EDF5FA] shadow-sm' 

                                : 'border-slate-100 bg-slate-50 hover:border-sky-200'

                              }

                            `}

                          >

                            <div className={`flex items-center justify-center shrink-0 [&>svg]:w-9 [&>svg]:h-9 sm:[&>svg]:w-10 sm:[&>svg]:h-10 mb-1 transition-transform group-hover:scale-110 ${isSelected ? 'text-[#005689] drop-shadow-sm' : 'text-slate-600'}`}>

                              {renderFacilityIcon(item)}

                            </div>

                            <span className={`text-xs sm:text-[13px] font-bold leading-tight ${isSelected ? 'text-[#005689]' : 'text-slate-600'}`}>

                              {item.name}

                            </span>

                            

                            {isEditMode && (

                                <div className={`absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-[#005689] border-[#005689] text-white shadow-sm' : 'bg-white border-2 border-slate-300 text-transparent'}`}>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>

                                </div>

                              )}

                          </div>

                        );

                      })}

                    </div>

                  </div>

                );

              })}

            </div>



            {/* If no facilities selected in view mode */}

            {!isEditMode && effectiveFacilities.length === 0 && (

              <div className="py-16 text-center bg-white rounded-2xl border border-slate-100">

                <p className="text-gray-500 font-medium">Facility details are being updated.</p>

              </div>

            )}

            

          </div>

        </section>

      )}





      {/* ========================================================= */}

      {/* 6.4 FACULTY & MENTORS TAB                                 */}

      {/* ========================================================= */}

      {activeTab === 'gallery' && (

        <section id="gallery" className="py-12 sm:py-16 bg-white relative">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}

            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">

              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] px-3.5 py-1.5 rounded-full mb-3">

                <span className="w-2 h-2 bg-[#FBBC04] rounded-full inline-block" />

                <span>VISUAL CAMPUS TOUR</span>

              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">

                Campus Gallery, <br className="hidden sm:inline" />

                <span className="text-[#005689]">Modern Architecture & Learning Spaces</span>

              </h2>

              <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">

                Explore the green lawns, state-of-the-art laboratory benches, smart interactive classrooms, and multi-sport complexes at {displayName}. Complete transparency for visiting parents.

              </p>



              {isLiveTemplate && isEditMode && (

                <div className="mt-5 flex justify-center">

                  <button

                    type="button"

                    onClick={() => setIsGalleryModalOpen(true)}

                    className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"

                  >

                    <Plus className="w-4 h-4" />

                    <span>+ Add External Media (Image / Video URL)</span>

                  </button>

                </div>

              )}

            </div>



            {/* Gallery Media Grid (External Images & Embedded Videos with Caption Headings) */}

            {(!templateData?.galleryItems || templateData.galleryItems.length === 0) ? (

              <div className="py-16 px-6 text-center bg-slate-50 rounded-3xl border border-slate-200/80 mb-12 max-w-2xl mx-auto">

                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3 shadow-xs">

                  <Camera className="w-7 h-7" />

                </div>

                <h3 className="font-bold text-slate-800 text-base mb-1">Campus Media to be Uploaded</h3>

                <p className="text-xs text-slate-500 max-w-md mx-auto">

                  Official campus photographs and walk-through videos can be uploaded through the institution dashboard.

                </p>

              </div>

            ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

              {templateData.galleryItems

                .slice(0, galleryVisibleCount)

                .map((item: any, gIdx: number) => {

                  const isVideo = item.type === 'video';

                  const isYouTube = item.url?.includes('youtube.com') || item.url?.includes('youtu.be');

                  let embedUrl = item.url;

                  if (isYouTube) {

                    if (item.url.includes('watch?v=')) {

                      const vId = item.url.split('watch?v=')[1]?.split('&')[0];

                      embedUrl = `https://www.youtube.com/embed/${vId}`;

                    } else if (item.url.includes('youtu.be/')) {

                      const vId = item.url.split('youtu.be/')[1]?.split('?')[0];

                      embedUrl = `https://www.youtube.com/embed/${vId}`;

                    }

                  }



                  return (

                    <div

                      key={item.id || gIdx}

                      className="bg-white rounded-3xl p-3 sm:p-4 border-2 border-gray-100 shadow-md hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between relative group"

                    >

                      {isLiveTemplate && isEditMode && (

                        <button

                          type="button"

                          onClick={() => {

                            if (confirm(`Remove media "${item.title}"?`)) {

                              templateCtx?.deleteGalleryItem(item.id);

                            }

                          }}

                          title="Delete Media"

                          className="absolute top-5 right-5 z-20 p-1.5 rounded-lg bg-white/95 backdrop-blur-xs hover:bg-rose-100 text-rose-600 shadow-md border border-slate-200 cursor-pointer"

                        >

                          <Trash2 className="w-3.5 h-3.5" />

                        </button>

                      )}



                      {/* Top Media Display: External Image or Video */}

                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xs">

                        {isVideo ? (

                          isYouTube ? (

                            <iframe

                              src={embedUrl}

                              title={item.title}

                              className="w-full h-full border-0"

                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

                              allowFullScreen

                            />

                          ) : (

                            <video

                              controls

                              src={item.url}

                              className="w-full h-full object-cover"

                            />

                          )

                        ) : (

                          <img

                            src={item.url}

                            alt={item.title}

                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"

                            onError={(e) => {

                              e.currentTarget.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80';

                            }}

                          />

                        )}



                        <span className="absolute bottom-2.5 left-2.5 text-[9.5px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md pointer-events-none">

                          {isVideo ? '▶ Video' : '📷 Photo'} {item.category ? `• ${item.category}` : ''}

                        </span>

                      </div>



                      {/* Underneath: ONLY clean image/video caption heading */}

                      <div className="pt-3 pb-1 px-1">

                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">

                          {item.title}

                        </h3>

                      </div>

                    </div>

                  );

                })}

            </div>

            )}



            {/* "Load More" Pagination with 2-Second Realistic Loading Animation */}

            {(templateData?.galleryItems?.length || 0) > galleryVisibleCount && (

              <div className="mt-8 mb-12 text-center">

                <button

                  type="button"

                  disabled={isGalleryLoadingMore}

                  onClick={() => {

                    setIsGalleryLoadingMore(true);

                    setTimeout(() => {

                      setGalleryVisibleCount((prev) => prev + 6);

                      setIsGalleryLoadingMore(false);

                    }, 2000);

                  }}

                  className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs sm:text-sm px-7 py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-80 cursor-pointer"

                >

                  {isGalleryLoadingMore ? (

                    <>

                      <Loader2 className="w-4 h-4 animate-spin" />

                      <span>Fetching External Media (2s)...</span>

                    </>

                  ) : (

                    <>

                      <span>Load More Media ({Math.min(galleryVisibleCount, templateData?.galleryItems?.length || 0)} of {templateData?.galleryItems?.length || 0})</span>

                      <ChevronDown className="w-4 h-4" />

                    </>

                  )}

                </button>

              </div>

            )}



            {/* Virtual Campus Tour Prompt Card */}

            <div className="bg-gradient-to-r from-[#002B49] to-[#005689] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">

              <div className="max-w-xl text-center md:text-left">

                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">

                  Interactive Experience

                </span>

                <h3 className="text-2xl sm:text-3xl font-black mt-1">

                  Want to Experience {displayName} in Person?

                </h3>

                <p className="text-xs sm:text-sm text-blue-100/90 mt-2">

                  Schedule a 45-minute guided campus walkthrough with our admissions team. Experience classrooms, labs, sports arenas, and interact with senior faculty.

                </p>

              </div>



              <div className="flex flex-wrap items-center gap-3 shrink-0">

                <button

                  type="button"

                  onClick={() => setIsTourModalOpen(true)}

                  className="bg-white hover:bg-blue-50 text-[#005689] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"

                >

                  <Play className="w-4 h-4 fill-current text-[#005689]" />

                  <span>Watch Video Tour</span>

                </button>

                <button

                  type="button"

                  onClick={() => setIsApplyModalOpen(true)}

                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"

                >

                  Book Campus Visit

                </button>

              </div>

            </div>



          </div>

        </section>

      )}





      {/* ========================================================= */}

      {/* 7. ADMISSIONS 2026-27 (CLEAR STEP-BY-STEP ROADMAP)         */}

      {/* ========================================================= */}

      {/* ─── TAB 4: ADMISSIONS & FEES ─── */}

      {activeTab === 'admissions' && (

        <>

        <section id="admissions" className="pt-6 sm:pt-10 pb-12 sm:pb-20 bg-white relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-12 w-full">
            {/* Top: Dynamic Tables (Full Width) */}
            <div className="w-full overflow-hidden">
              {renderDynamicTable('Admission & Tuition Fees', feesTable, setFeesTable)}
              {renderDynamicTable('Extra / Other Charges', extraChargesTable, setExtraChargesTable)}
            </div>

            {/* Bottom: Info / Contact Card */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="bg-[#EDF5FA] rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
                <h3 className="text-2xl font-black text-[#005689] mb-4">Admissions Contact</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
                  For any queries regarding the fee structure or admission process, feel free to contact us.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full">
                  {isEditMode ? (
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-800 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#005689] shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          value={admissionPhone} 
                          onChange={e => setAdmissionPhone(e.target.value)} 
                          placeholder="Admission Phone"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005689]"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-800 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#005689] shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input 
                          type="text" 
                          value={admissionEmail} 
                          onChange={e => setAdmissionEmail(e.target.value)} 
                          placeholder="Admission Email"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005689]"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {admissionPhone ? (
                        <a href={`tel:${admissionPhone}`} className="flex items-center gap-3 text-sm font-bold text-white bg-[#005689] hover:bg-[#003c6e] px-6 py-3.5 rounded-xl transition-all shadow-md shadow-[#005689]/20 hover:shadow-lg hover:shadow-[#005689]/30 hover:-translate-y-0.5 group">
                          <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span>Call Admissions: {admissionPhone}</span>
                        </a>
                      ) : (
                        <button disabled className="flex items-center gap-3 text-sm font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3.5 rounded-xl opacity-40 cursor-not-allowed pointer-events-none select-none">
                          <Phone className="w-5 h-5 text-slate-400" />
                          <span>Admissions Phone Not Available</span>
                        </button>
                      )}

                      {admissionEmail ? (
                        <a href={`mailto:${admissionEmail}`} className="flex items-center gap-3 text-sm font-bold text-[#005689] bg-white border border-[#D6EDFF] hover:bg-[#EDF5FA] px-6 py-3.5 rounded-xl transition-all shadow-sm">
                          <Mail className="w-5 h-5" />
                          <span>Email Admissions: {admissionEmail}</span>
                        </a>
                      ) : (
                        <button disabled className="flex items-center gap-3 text-sm font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3.5 rounded-xl opacity-40 cursor-not-allowed pointer-events-none select-none">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <span>Admissions Email Not Available</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* School Frequently Asked Questions (FAQ) Section */}
      <SchoolFaqSection id="faq" />
        </>
      )}





      {/* ========================================================= */}

      {/* 9. AUTHENTIC PARENTS & STUDENTS REVIEWS (100% GENUINE)    */}

      {/* ========================================================= */}

      {/* ─── TAB 5: REVIEWS ─── */}

      {activeTab === 'reviews' && (

        <section id="reviews" className="py-12 sm:py-20 bg-white relative">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header & Write Review Action */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">

              <div>

                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">

                  <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />

                  <span>GENUINE COMMUNITY RATINGS</span>

                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-[#002B49] tracking-tight">

                  What Parents & Students Say

                </h2>

                <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">

                  Real, verified feedback from enrolled families, current scholars, and distinguished alumni of {displayName}.

                </p>

              </div>



              <div className="flex flex-wrap items-center gap-3">

                <button

                  type="button"

                  onClick={handleInitiateWriteReview}

                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-6 py-3 rounded-[12px] text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"

                >

                  <MessageSquare className="w-4 h-4" />

                  <span>Write a Review</span>

                </button>

              </div>

            </div>



            {/* Review Overview: Zero-State when 0 reviews, dynamic calculation when real reviews exist */}
            {reviewsList.length === 0 ? (
              <div className="bg-[#F8FAFD] rounded-3xl p-8 sm:p-12 border border-blue-100/80 mb-10 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-white text-amber-500 border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs mb-3.5">
                  <Star className="w-7 h-7 fill-amber-400/20 text-amber-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#002B49] tracking-tight">
                  No Community Reviews Yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
                  Be the first verified parent, student, or alumnus of {displayName} to submit an authentic review and rating.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setIsWriteReviewOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#006FCC] hover:bg-[#005499] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Write First Review</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#F8FAFD] rounded-3xl p-6 sm:p-8 border border-blue-100/80 mb-10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 text-center lg:text-left lg:border-r border-gray-200 lg:pr-8">
                    <div className="flex items-baseline justify-center lg:justify-start gap-2">
                      <span className="text-5xl sm:text-6xl font-black text-[#002B49] tracking-tight">
                        {(reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1)}
                      </span>
                      <span className="text-lg font-bold text-gray-400">/ 5.0</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 my-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      Based on <strong>{reviewsList.length} Verified Community Review{reviewsList.length > 1 ? 's' : ''}</strong>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#137333] text-[11px] font-semibold px-3 py-1 rounded-full mt-3">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Authenticated by CSEEL
                    </div>
                  </div>
                  <div className="lg:col-span-7 space-y-2 text-xs text-gray-600">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#005689] mb-2">Community Ratings</h4>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewsList.filter((r) => r.rating === star).length;
                      const pct = Math.round((count / reviewsList.length) * 100);
                      return (
                        <div key={star} className="flex items-center gap-2.5">
                          <span className="w-14 font-semibold text-gray-700">{star} Stars</span>
                          <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right font-bold text-gray-800">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Inline "Write a Review" Questionnaire Panel */}

            {isWriteReviewOpen && (

              <div

                id="write-review-questionnaire-card"

                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#006FCC]/30 shadow-xl mb-12 relative animate-fade-in"

              >

                <button

                  type="button"

                  onClick={() => setIsWriteReviewOpen(false)}

                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"

                >

                  <X className="w-4 h-4" />

                </button>



                <div className="max-w-3xl">

                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">

                    <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />

                    <span>AUTHENTIC COMMUNITY FEEDBACK</span>

                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#002B49]">

                    Rate & Review {displayName}

                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mt-1 mb-6 leading-relaxed">

                    Your authentic feedback helps other parents and students make the best decision for their education. Please answer the 5-point evaluation questions below:

                  </p>



                  <form onSubmit={handleReviewSubmit} className="space-y-6">

                    

                    {/* Role & Basic Info */}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">

                      <div>

                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">

                          You are a *

                        </label>

                        <select

                          value={reviewerRole}

                          onChange={(e) => setReviewerRole(e.target.value)}

                          className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"

                        >

                          <option value="Parent">Parent of Student</option>

                          <option value="Student">Current Student</option>

                          <option value="Alumni">Student Alumni</option>

                          <option value="Faculty">Faculty / Teacher</option>

                        </select>

                      </div>



                      <div>

                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">

                          Your Full Name *

                        </label>

                        <input

                          type="text"

                          required

                          placeholder="e.g. Ramesh Sharma"

                          value={reviewerName}

                          onChange={(e) => setReviewerName(e.target.value)}

                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"

                        />

                      </div>



                      <div>

                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">

                          Class / Batch

                        </label>

                        <input

                          type="text"

                          placeholder="e.g. Class 10th / Batch 2024"

                          value={reviewerClass}

                          onChange={(e) => setReviewerClass(e.target.value)}

                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006FCC]"

                        />

                      </div>

                    </div>



                    {/* The 6 5-Point Questionnaire Ratings */}

                    <div className="space-y-4 pt-2">

                      <h4 className="text-xs font-black uppercase tracking-wider text-[#005689] flex items-center gap-1.5">

                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />

                        <span>Star Rating Questions (Answer on 5-Point Scale)</span>

                      </h4>



                      {[

                        {

                          id: 'overall',

                          q: '1. Overall School Experience & Recommendation',

                          desc: 'Overall experience, discipline and whether you recommend this school to others',

                          value: ratingOverall,

                          setter: setRatingOverall,

                          labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent / Highly Recommended']

                        },

                        {

                          id: 'academics',

                          q: '2. Academics & Faculty Teaching Quality',

                          desc: 'Teacher dedication, teaching quality, doubt solving & CBSE/board results',

                          value: ratingAcademics,

                          setter: setRatingAcademics,

                          labels: ['Needs Attention', 'Satisfactory', 'Good', 'Very Good', 'Outstanding & Dedicated']

                        },

                        {

                          id: 'infrastructure',

                          q: '3. Campus Infrastructure, Classrooms & Science Labs',

                          desc: 'Physics, Chemistry, Computer labs, library, smart digital classrooms & campus grounds',

                          value: ratingInfrastructure,

                          setter: setRatingInfrastructure,

                          labels: ['Inadequate', 'Basic', 'Decent', 'Modern & Equipped', 'World-Class & Advanced']

                        },

                        {

                          id: 'safety',

                          q: '4. Student Safety, Discipline & Transport Care',

                          desc: 'CCTV surveillance, student care, female conductors in buses & safe environment',

                          value: ratingSafety,

                          setter: setRatingSafety,

                          labels: ['Safety Concerns', 'Average', 'Safe & Disciplined', 'Very Safe', '100% Secure & Attentive']

                        },

                        {

                          id: 'sports',

                          q: '5. Sports Coaching & Extracurricular Activities',

                          desc: 'Playgrounds, sports coaching, cultural fests, debate, dance & arts',

                          value: ratingSports,

                          setter: setRatingSports,

                          labels: ['Minimal', 'Limited', 'Good Activities', 'Active & Regular', 'Top-Tier Sports Academy']

                        },

                        {

                          id: 'value',

                          q: '6. Fee Justification & Value for Money',

                          desc: 'Is the fee structure justified by the education, practical facilities and care provided?',

                          value: ratingValue,

                          setter: setRatingValue,

                          labels: ['High / Overpriced', 'Expensive', 'Reasonable', 'Good Value', 'Exceptional Value']

                        }

                      ].map((item) => (

                        <div key={item.id} className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 hover:border-blue-200 transition-colors">

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">

                            <div>

                              <p className="text-[11px] sm:text-xs font-bold text-gray-900">{item.q}</p>

                              <p className="text-[11px] text-gray-500">{item.desc}</p>

                            </div>

                            <span className="text-xs font-bold text-[#006FCC] shrink-0">

                              {item.labels[item.value - 1]}

                            </span>

                          </div>



                          <div className="flex items-center gap-1.5 text-amber-400 pt-1">

                            {[1, 2, 3, 4, 5].map((star) => (

                              <button

                                key={star}

                                type="button"

                                onClick={() => item.setter(star)}

                                className="p-1 hover:scale-125 transition-transform cursor-pointer"

                              >

                                <Star

                                  className={`w-6 h-6 sm:w-7 sm:h-7 ${

                                    star <= item.value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'

                                  }`}

                                />

                              </button>

                            ))}

                            <span className="ml-2 text-xs font-bold text-gray-800 bg-white px-2 py-0.5 rounded-md border border-gray-200">

                              {item.value} / 5 Stars

                            </span>

                          </div>

                        </div>

                      ))}

                    </div>



                    {/* Detailed Review Comments */}

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">

                        Your Detailed Review / Feedback *

                      </label>

                      <textarea

                        required

                        rows={4}

                        placeholder="Share your experience regarding teaching quality, faculty support, student safety, labs, sports facilities, and advice for prospective parents..."

                        value={reviewComment}

                        onChange={(e) => setReviewComment(e.target.value)}

                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC] text-xs sm:text-sm leading-relaxed"

                      />

                    </div>



                    {/* Action buttons */}

                    <div className="flex items-center gap-3 pt-2">

                      <button

                        type="submit"

                        className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-7 py-3 rounded-[12px] text-xs sm:text-sm flex items-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all active:scale-95 cursor-pointer"

                      >

                        <Send className="w-4 h-4" />

                        <span>Publish Verified Review</span>

                      </button>

                      <button

                        type="button"

                        onClick={() => setIsWriteReviewOpen(false)}

                        className="button_secondary bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-3 rounded-[12px] text-xs sm:text-sm transition-all cursor-pointer"

                      >

                        Cancel

                      </button>

                    </div>



                  </form>

                </div>

              </div>

            )}



            {/* Filter, Search & Sort Bar */}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50 p-3 sm:p-4 rounded-2xl border border-gray-200/90 mb-6">

              

              {/* Role Filters */}

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">

                {[

                  { id: 'all', label: 'All Reviews' },

                  { id: 'Parent', label: 'Parents' },

                  { id: 'Student', label: 'Students' },

                  { id: 'Alumni', label: 'Alumni' },

                ].map((role) => (

                  <button

                    key={role.id}

                    type="button"

                    onClick={() => {

                      setReviewRoleFilter(role.id as any);

                      setVisibleReviewsCount(4);

                    }}

                    className={`text-xs font-semibold px-3.5 py-2 rounded-[12px] transition-colors shrink-0 cursor-pointer ${

                      reviewRoleFilter === role.id

                        ? 'bg-[#006FCC] text-white shadow-xs'

                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'

                    }`}

                  >

                    {role.label}

                  </button>

                ))}

              </div>



              {/* Star Filter & Search */}

              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">

                <select

                  value={reviewStarFilter}

                  onChange={(e) => {

                    setReviewStarFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value));

                    setVisibleReviewsCount(4);

                  }}

                  className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006FCC]"

                >

                  <option value="all">All Star Ratings</option>

                  <option value="5">5 Stars only</option>

                  <option value="4">4 Stars only</option>

                  <option value="3">3 Stars only</option>

                </select>



                <select

                  value={reviewSortBy}

                  onChange={(e) => setReviewSortBy(e.target.value as any)}

                  className="text-xs font-semibold bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#006FCC]"

                >

                  <option value="recent">Most Recent</option>

                  <option value="highest">Highest Rating</option>

                  <option value="helpful">Most Helpful</option>

                </select>



                <div className="relative flex-1 sm:w-48">

                  <input

                    type="text"

                    placeholder="Search reviews..."

                    value={reviewSearchText}

                    onChange={(e) => {

                      setReviewSearchText(e.target.value);

                      setVisibleReviewsCount(4);

                    }}

                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#006FCC]"

                  />

                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />

                </div>

              </div>



            </div>



            {/* Vertical Reviews Feed (No Cards, Vertical Layout with Continuous List) */}

            {/* Google Reviews Style Compact Reviews Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">

              {filteredReviewsList.slice(0, visibleReviewsCount).map((rev) => (

                <div

                  key={rev.id}

                  className="bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"

                >

                  {/* Header: User Avatar + Name + Verified Badge + Stars & Relative Time */}

                  <div>

                    <div className="flex items-start justify-between gap-2.5 mb-2">

                      <div className="flex items-center gap-2.5 min-w-0">

                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#005689] to-[#006FCC] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">

                          {rev.author.charAt(0)}

                        </div>

                        <div className="min-w-0">

                          <div className="flex items-center gap-1.5 flex-wrap">

                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{rev.author}</h4>

                            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-200">

                              <CheckCircle2 className="w-2.5 h-2.5" /> Verified {rev.role}

                            </span>

                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">

                            <div className="flex items-center text-amber-400">

                              {[...Array(rev.rating)].map((_, i) => (

                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />

                              ))}

                            </div>

                            <span>•</span>

                            <span>{rev.date}</span>

                            {rev.studentClass && (

                              <>

                                <span className="hidden sm:inline">•</span>

                                <span className="hidden sm:inline text-slate-500 text-[10.5px] truncate max-w-[150px]">{rev.studentClass}</span>

                              </>

                            )}

                          </div>

                        </div>

                      </div>

                    </div>



                    {/* Compact Review Snippet */}

                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed line-clamp-3 sm:line-clamp-4 mt-1.5 mb-3">

                      "{rev.comment}"

                    </p>

                  </div>



                  {/* Bottom Action: Compact Helpful Button + Verified Tag */}

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">

                    <button

                      type="button"

                      onClick={() => handleToggleLike(rev.id)}

                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${

                        userLikesMap[rev.id]

                          ? 'bg-blue-50 text-[#006FCC] border border-blue-200'

                          : 'hover:bg-slate-100 text-slate-600 border border-slate-200/60'

                      }`}

                    >

                      <ThumbsUp className={`w-3 h-3 ${userLikesMap[rev.id] ? 'fill-[#006FCC]' : ''}`} />

                      <span>Helpful ({rev.likes + (userLikesMap[rev.id] ? 1 : 0)})</span>

                    </button>

                    <span className="inline-flex items-center gap-1 text-[10.5px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">

                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Authenticated

                    </span>

                  </div>

                </div>

              ))}



              {filteredReviewsList.length === 0 && (

                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">

                  <p className="text-sm text-gray-500 font-medium">No reviews match your selected filter or search.</p>

                  <button

                    type="button"

                    onClick={() => {

                      setReviewRoleFilter('all');

                      setReviewStarFilter('all');

                      setReviewSearchText('');

                    }}

                    className="mt-3 text-xs font-bold text-[#006FCC] hover:underline"

                  >

                    Reset all filters

                  </button>

                </div>

              )}

            </div>



            {/* Load More Reviews Button */}

            {visibleReviewsCount < filteredReviewsList.length ? (

              <div className="text-center pt-8 pb-4">

                <button

                  type="button"

                  onClick={() => setVisibleReviewsCount((c) => c + 4)}

                  className="button_secondary inline-flex items-center gap-2 bg-[#EDF5FA] hover:bg-[#D6EDFF] border border-[#D6EDFF] text-[#006FCC] font-bold text-xs sm:text-sm px-8 py-3.5 rounded-[12px] shadow-sm transition-all active:scale-95 cursor-pointer"

                >

                  <span>Load More Reviews</span>

                  <span className="text-xs bg-[#006FCC]/10 px-2 py-0.5 rounded-full font-bold">

                    Showing {visibleReviewsCount} of {filteredReviewsList.length}

                  </span>

                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />

                </button>

              </div>

            ) : filteredReviewsList.length > 0 ? (

              <div className="text-center py-8 text-xs text-gray-500 font-medium">

                ✓ You've viewed all {filteredReviewsList.length} verified community reviews

              </div>

            ) : null}



          </div>

        </section>

      )}





      {/* ========================================================= */}

      {/* 10. DIRECT CONTACT DESK & LIVE CAMPUS MAP                 */}

      {/* ========================================================= */}

      {/* ─── TAB 9: CONTACT & MAP ─── */}

      {activeTab === 'contact' && (

        <section id="contact-info" className="py-12 sm:py-16 bg-[#F8FAFC] relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}

          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">

            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-2">

              <span className="w-6 h-1 bg-[#FBBC04] rounded-full inline-block" />

              <EditableText

                contentKey="contact_eyebrow"

                value="GET IN TOUCH"

                className="inline-block"

              />

            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">

              <EditableText

                contentKey="contact_heading"

                value="Contact & Campus Location"

                className="inline"

              />

            </h2>

            <EditableText

              contentKey="contact_subheading"

              value="Have questions regarding admissions, academics, or campus visits? Reach out to us directly or drop a message below."

              className="text-sm text-gray-600 mt-2 block"

            />

          </div>



          {/* Standard 2-Column Professional Contact Layout */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            

            {/* Left Column (col-span-12 lg:col-span-6): Contact Information & Send Message Form */}

            <div className="lg:col-span-6 space-y-6">

              

              {/* Compact 4-Channel Contact Desk & Address */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#006FCC] inline-block animate-pulse" />
                    <h3 className="text-base font-bold text-gray-950">Official Contact Desks</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    UDISE Verified
                  </span>
                </div>

                {/* 4 Dedicated Contact Channels in 2x2 High-Density Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Channel 1: General & Admin Desk */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#006FCC] flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 leading-tight">General & Admin Desk</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {isLiveTemplate && isEditMode ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                          <EditableText fieldKey="generalPhone" value={templateData?.generalPhone || templateData?.phone || ''} placeholder="General phone" className="text-xs text-gray-900" />
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                          <EditableText fieldKey="generalEmail" value={templateData?.generalEmail || templateData?.email || ''} placeholder="General email" className="text-xs text-gray-900" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayGeneralPhone ? (
                              <a href={`tel:${displayGeneralPhone}`} className="text-[#006FCC] font-medium hover:underline truncate">{displayGeneralPhone}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayGeneralEmail ? (
                              <a href={`mailto:${displayGeneralEmail}`} className="text-gray-700 hover:text-[#006FCC] font-medium hover:underline truncate" title={displayGeneralEmail}>{displayGeneralEmail}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Channel 2: Admissions Office */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 leading-tight">Admissions Desk</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {isLiveTemplate && isEditMode ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                          <EditableText fieldKey="admissionsPhone" value={templateData?.admissionsPhone || ''} placeholder="Admissions phone" className="text-xs text-gray-900" />
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                          <EditableText fieldKey="admissionsEmail" value={templateData?.admissionsEmail || ''} placeholder="Admissions email" className="text-xs text-gray-900" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayAdmissionsPhone ? (
                              <a href={`tel:${displayAdmissionsPhone}`} className="text-emerald-700 font-medium hover:underline truncate">{displayAdmissionsPhone}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayAdmissionsEmail ? (
                              <a href={`mailto:${displayAdmissionsEmail}`} className="text-gray-700 hover:text-emerald-700 font-medium hover:underline truncate" title={displayAdmissionsEmail}>{displayAdmissionsEmail}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Channel 3: Principal's Office */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-purple-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 leading-tight">Principal Desk</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {isLiveTemplate && isEditMode ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                          <EditableText fieldKey="principalPhone" value={templateData?.principalPhone || ''} placeholder="Principal phone" className="text-xs text-gray-900" />
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                          <EditableText fieldKey="principalEmail" value={templateData?.principalEmail || ''} placeholder="Principal email" className="text-xs text-gray-900" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayPrincipalPhone ? (
                              <a href={`tel:${displayPrincipalPhone}`} className="text-purple-700 font-medium hover:underline truncate">{displayPrincipalPhone}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayPrincipalEmail ? (
                              <a href={`mailto:${displayPrincipalEmail}`} className="text-gray-700 hover:text-purple-700 font-medium hover:underline truncate" title={displayPrincipalEmail}>{displayPrincipalEmail}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Channel 4: Careers & HR Desk */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 leading-tight">Careers & HR</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {isLiveTemplate && isEditMode ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                          <EditableText fieldKey="careersPhone" value={templateData?.careersPhone || ''} placeholder="Careers phone" className="text-xs text-gray-900" />
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Email</label>
                          <EditableText fieldKey="careersEmail" value={templateData?.careersEmail || ''} placeholder="Careers email" className="text-xs text-gray-900" />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayCareersPhone ? (
                              <a href={`tel:${displayCareersPhone}`} className="text-amber-800 font-medium hover:underline truncate">{displayCareersPhone}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            {displayCareersEmail ? (
                              <a href={`mailto:${displayCareersEmail}`} className="text-gray-700 hover:text-amber-800 font-medium hover:underline truncate" title={displayCareersEmail}>{displayCareersEmail}</a>
                            ) : (
                              <span className="text-gray-400 opacity-60 cursor-not-allowed select-none">Not listed</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Campus Address & Website Summary Strip */}
                <div className="pt-3 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs text-gray-700">
                    <MapPin className="w-4 h-4 text-[#006FCC] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-900">Campus Address</span>
                        {isLiveTemplate && isEditMode && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 select-none">
                            <Lock className="w-2.5 h-2.5 text-amber-700" /> UDISE Locked
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 mt-0.5 leading-relaxed">{displayAddress}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Mon – Sat: 8:00 AM – 3:30 PM (Sun Closed)</span>
                    </div>

                    {/* Official Website Button - Active if link exists, Disabled if empty */}
                    {displayWebsiteUrl && displayWebsiteUrl !== '#' && displayWebsiteUrl !== '' ? (
                      <a
                        href={displayWebsiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EDF5FA] hover:bg-[#006FCC] text-[#006FCC] hover:text-white font-semibold text-xs border border-blue-200 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-400 font-semibold text-xs border border-slate-200 cursor-not-allowed opacity-40 select-none pointer-events-none"
                        title="Website not listed"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>No Website Listed</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>



              {/* Compact Quick Inquiry Form */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#006FCC]" />
                    <span>Quick Direct Inquiry</span>
                  </h3>
                  <span className="text-[11px] text-gray-400">Response within 24h</span>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thank you! Your inquiry has been dispatched to the relevant school desk.');
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Parent / Student Name"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Contact Phone *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 Mobile number"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="parent@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Select Inquiry Desk *</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent bg-white text-gray-800">
                        <option value="admissions">Admissions & New Enrollment</option>
                        <option value="general">General & Administration</option>
                        <option value="principal">Principal's Office Desk</option>
                        <option value="careers">Careers & Faculty Recruitment</option>
                        <option value="fees">Fee Structure & Transport Desk</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Inquiry Details *</label>
                    <textarea 
                      required 
                      rows={3}
                      placeholder="Type your message or questions here..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="button_primary w-full bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Send Message to Selected Desk</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </form>
              </div>



            </div>



            {/* Right Column (col-span-12 lg:col-span-6): Interactive Live Campus Map */}

            <div className={`lg:col-span-6 transition-all ${isMapFullscreen ? 'fixed inset-4 z-[99999] bg-white rounded-3xl p-6 shadow-2xl flex flex-col' : ''}`}>

              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200/90 overflow-hidden relative flex flex-col h-full">

                

                {/* Map Header Strip */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">

                  <div className="flex items-center gap-2.5">

                    <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">

                      <MapPin className="w-4 h-4" />

                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h4 className="font-bold text-gray-950 text-sm sm:text-base leading-tight">{displayName} Campus</h4>

                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">

                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />

                          Verified GPS

                        </span>

                      </div>

                      <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xs sm:max-w-md">{displayAddress}</p>

                    </div>

                  </div>



                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">

                    <a

                      href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}

                      target="_blank"

                      rel="noreferrer"

                      className="button_primary inline-flex items-center gap-1.5 bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-3.5 py-2 rounded-[10px] shadow-[0_4px_14px_rgba(0,111,204,0.35)] transition-transform active:scale-95 cursor-pointer"

                    >

                      <Navigation className="w-3.5 h-3.5" />

                      <span>Directions</span>

                    </a>

                  </div>

                </div>



                {/* Map Mode Selector Bar */}

                <div className="flex items-center justify-between gap-2 py-2 px-1">

                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">

                    <button

                      type="button"

                      onClick={() => setMapMode('osm')}

                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${

                        mapMode === 'osm'

                          ? 'bg-white text-[#006FCC] shadow-xs'

                          : 'text-gray-600 hover:text-gray-900'

                      }`}

                    >

                      <MapPin className="w-3 h-3" />

                      <span>Campus Map</span>

                    </button>

                    <button

                      type="button"

                      onClick={() => setMapMode('satellite')}

                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${

                        mapMode === 'satellite'

                          ? 'bg-white text-[#006FCC] shadow-xs'

                          : 'text-gray-600 hover:text-gray-900'

                      }`}

                    >

                      <Layers className="w-3 h-3" />

                      <span>Satellite</span>

                    </button>

                    <button

                      type="button"

                      onClick={() => setMapMode('google')}

                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${

                        mapMode === 'google'

                          ? 'bg-white text-[#006FCC] shadow-xs'

                          : 'text-gray-600 hover:text-gray-900'

                      }`}

                    >

                      <Globe className="w-3 h-3" />

                      <span>Google Map</span>

                    </button>

                  </div>



                  <div className="flex items-center gap-1.5">

                    {/* Recenter Button */}

                    {mapMode !== 'google' && (

                      <button

                        type="button"

                        onClick={() => {

                          if (mapInstanceRef.current) {

                            mapInstanceRef.current.setView([mapLat, mapLng], 15, { animate: true });

                          }

                        }}

                        title="Re-center Campus"

                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#EDF5FA] hover:text-[#006FCC] text-gray-600 flex items-center justify-center transition-colors"

                      >

                        <Crosshair className="w-3.5 h-3.5" />

                      </button>

                    )}



                    {/* Fullscreen Button */}

                    <button

                      type="button"

                      onClick={() => setIsMapFullscreen(!isMapFullscreen)}

                      title={isMapFullscreen ? 'Exit Fullscreen' : 'View Fullscreen Map'}

                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#EDF5FA] hover:text-[#006FCC] text-gray-600 flex items-center justify-center transition-colors"

                    >

                      <Maximize2 className="w-3.5 h-3.5" />

                    </button>

                  </div>

                </div>



                {/* Map Display Container */}

                <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shadow-inner flex-1 min-h-[380px] lg:min-h-[460px]">

                  {mapMode === 'google' ? (

                    <iframe

                      title="Google Maps Verified Campus"

                      src={`https://maps.google.com/maps?q=${mapLat},${mapLng}+(${encodeURIComponent(displayName)})&hl=en&z=15&output=embed`}

                      className="w-full h-full border-0 min-h-[380px] lg:min-h-[460px]"

                      loading="lazy"

                    />

                  ) : (

                    <>

                      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] lg:min-h-[460px] z-0" />

                      {!mapLoaded && (

                        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center gap-2">

                          <div className="w-8 h-8 rounded-full border-2 border-[#006FCC] border-t-transparent animate-spin" />

                          <span className="text-xs font-semibold text-gray-500">Loading interactive campus map...</span>

                        </div>

                      )}

                    </>

                  )}



                  {/* Floating Campus Badge Preview Overlay */}

                  <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-lg border border-gray-200/90 max-w-[280px] xs:max-w-xs">

                    <div className="flex items-center gap-2 mb-1">

                      <span className="relative flex h-2.5 w-2.5">

                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />

                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Verified Location</span>

                    </div>

                    <div className="font-bold text-xs text-gray-900 truncate">{displayName}</div>

                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">

                      📍 {mapLat.toFixed(4)}° N, {mapLng.toFixed(4)}° E

                    </div>

                    <div className="mt-2 flex items-center gap-2">

                      <a

                        href={`https://www.google.com/maps/dir/?api=1&destination=${mapLat},${mapLng}`}

                        target="_blank"

                        rel="noreferrer"

                        className="text-[11px] font-bold text-[#006FCC] hover:underline flex items-center gap-1"

                      >

                        <span>Start Navigation</span>

                        <ExternalLink className="w-3 h-3" />

                      </a>

                    </div>

                  </div>

                </div>



                {/* Bottom Address Copy Strip */}

                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">

                  <span className="bg-gray-100 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-700">

                    🅿️ Free Visitor Parking Available

                  </span>

                  

                  <button

                    type="button"

                    onClick={() => {

                      if (typeof window !== 'undefined' && navigator.clipboard) {

                        navigator.clipboard.writeText(displayAddress);

                        setIsAddressCopied(true);

                        setTimeout(() => setIsAddressCopied(false), 2000);

                      }

                    }}

                    className="text-[#006FCC] hover:text-[#005499] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"

                  >

                    {isAddressCopied ? (

                      <>

                        <Check className="w-3.5 h-3.5 text-emerald-600" />

                        <span className="text-emerald-600">Address Copied!</span>

                      </>

                    ) : (

                      <>

                        <Copy className="w-3.5 h-3.5" />

                        <span>Copy Full Address</span>

                      </>

                    )}

                  </button>

                </div>



              </div>

            </div>



          </div>



        </div>

      </section>

      )}





      {/* ========================================================= */}

      {/* 11. DEEP NAVY MODERN FOOTER                               */}

      {/* ========================================================= */}

      <footer id="contact" className="relative bg-[#071F38] text-white pt-20 pb-10 overflow-hidden">

        

        {/* Curved Top Wave Divider */}

        <div className="absolute top-0 left-0 right-0 h-10 overflow-hidden leading-none pointer-events-none">

          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full text-[#F8FAFC] fill-current">

            <path d="M0,0 C300,90 600,0 900,60 C1050,90 1150,40 1200,0 L1200,0 L0,0 Z"></path>

          </svg>

        </div>



        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-blue-900/50">

            

            {/* Col 1: School Brand & Tagline */}

            <div className="lg:col-span-3 space-y-4">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-800 bg-white shadow-xs flex items-center justify-center shrink-0">

                  {actualSchoolLogo ? (

                    <img

                      src={actualSchoolLogo}

                      alt={displayName}

                      className="w-full h-full object-cover"

                    />

                  ) : (

                    <div className="w-full h-full bg-gradient-to-br from-[#005689] to-[#0D4979] text-white font-black text-sm flex items-center justify-center">

                      {displayName ? displayName.charAt(0).toUpperCase() : 'S'}

                    </div>

                  )}

                </div>

                <div>

                  <div className="text-xl font-black font-serif tracking-tight leading-none">

                    {displayName}

                  </div>

                  <div className="text-[10px] font-semibold tracking-wider uppercase text-blue-300 mt-1">

                    <EditableText

                      contentKey="footer_school_subtitle"

                      value="Public School"

                      className="inline-block"

                    />

                  </div>

                </div>

              </div>



              <p className="text-xs text-blue-200/80">

                <EditableText

                  contentKey="footer_tagline"

                  value="Rooted in Values • Ready for Tomorrow"

                  className="inline-block"

                />

              </p>



              {/* Social Icons - Disabled state when no URL configured */}

              <div className="flex items-center gap-2 pt-2">

                {[Facebook, Instagram, Youtube, Linkedin].map((SocialIcon, idx) => (

                  <span

                    key={idx}

                    aria-label="Social Link (Not Configured)"

                    title="Social handle not linked"

                    className="w-9 h-9 rounded-[10px] bg-blue-950/60 flex items-center justify-center text-blue-300/40 border border-blue-900/40 opacity-40 cursor-not-allowed select-none pointer-events-none"

                  >

                    <SocialIcon className="w-4 h-4" />

                  </span>

                ))}

              </div>

            </div>



            {/* Col 2: Quick Links */}

            <div className="lg:col-span-2">

              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Quick Links</h4>

              <ul className="space-y-2 text-xs text-blue-200/80">

                <li><button type="button" onClick={() => handleTabSwitch('home')} className="hover:text-white transition-colors text-left cursor-pointer">Home</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('about')} className="hover:text-white transition-colors text-left cursor-pointer">About Us</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('facilities')} className="hover:text-white transition-colors text-left cursor-pointer">Facilities</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('admissions')} className="hover:text-white transition-colors text-left cursor-pointer">Admissions & Fees</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('reviews')} className="hover:text-white transition-colors text-left cursor-pointer">Reviews & Ratings</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('contact')} className="hover:text-white transition-colors text-left cursor-pointer">Contact Us</button></li>

              </ul>

            </div>



            {/* Col 3: Programs & Pillars */}

            <div className="lg:col-span-2">

              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Focus Areas</h4>

              <ul className="space-y-2 text-xs text-blue-200/80">

                <li><button type="button" onClick={() => handleTabSwitch('facilities')} className="hover:text-white transition-colors text-left cursor-pointer">Modern Labs & Tech</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('academics')} className="hover:text-white transition-colors text-left cursor-pointer">Academic Curriculum</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('facilities')} className="hover:text-white transition-colors text-left cursor-pointer">Sports & Athletics</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('gallery')} className="hover:text-white transition-colors text-left cursor-pointer">Arts & Co-Curricular</button></li>

                <li><button type="button" onClick={() => handleTabSwitch('admissions')} className="hover:text-white transition-colors text-left cursor-pointer">Admissions Process</button></li>

              </ul>

            </div>



            {/* Col 4: Contact Info */}

            <div className="lg:col-span-2 space-y-3">

              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-4">Contact</h4>

              

              <div className="flex items-start gap-2 text-xs text-blue-200/80">

                <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />

                <span className="flex items-center gap-1.5 flex-wrap">

                  <span>{displayAddress}</span>

                  <VerifiedBadge fieldKey="address" size="sm" />

                </span>

              </div>



              <div className="flex items-center gap-2 text-xs text-blue-200/80">

                <Phone className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />

                <span className="flex items-center gap-1.5 flex-wrap">

                  <span>{displayPhone}</span>

                  <VerifiedBadge fieldKey="phone" size="sm" />

                </span>

              </div>



              <div className="flex items-center gap-2 text-xs text-blue-200/80">

                <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />

                <span className="flex items-center gap-1.5 flex-wrap truncate">

                  <span className="truncate">{displayEmail}</span>

                  <VerifiedBadge fieldKey="email" size="sm" />

                </span>

              </div>

            </div>



            {/* Col 5: Newsletter */}

            <div className="lg:col-span-3 space-y-3">

              <h4 className="text-xs font-bold tracking-wider uppercase text-white mb-2">Newsletter</h4>

              <p className="text-xs text-blue-200/80 leading-relaxed">

                Stay updated with our latest news, events and activities.

              </p>



              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }} className="flex flex-col sm:flex-row gap-2 pt-1">

                <input

                  type="email"

                  placeholder="Your email address"

                  required

                  className="bg-white text-gray-900 px-3.5 py-2.5 rounded-[12px] text-xs focus:outline-none focus:ring-2 focus:ring-[#006FCC] flex-1"

                />

                <button

                  type="submit"

                  className="button_primary inline-flex items-center justify-center bg-[#006FCC] hover:bg-[#005499] text-white font-bold px-5 py-2.5 rounded-[12px] text-xs shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-[0_6px_22px_rgba(0,111,204,0.45)] transition-all cursor-pointer shrink-0"

                >

                  Subscribe

                </button>

              </form>

            </div>



          </div>



          {/* Bottom Copyright & Legal Links */}

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/70 gap-4">

            <div>

              © 2026 {displayName}. All Rights Reserved.

            </div>

            <div className="flex items-center gap-6">

              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>

              <span>•</span>

              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>

              <span>•</span>

              <span className="text-blue-300/40 select-none cursor-not-allowed">Sitemap</span>

            </div>

          </div>



        </div>

      </footer>





      {/* ========================================================= */}

      {/* 12. INTERACTIVE ADMISSION APPLICATION MODAL               */}

      {/* ========================================================= */}

      {isApplyModalOpen && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">

          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">

            <button

              onClick={() => setIsApplyModalOpen(false)}

              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"

            >

              <X className="w-4 h-4" />

            </button>



            {isSubmitted ? (

              <div className="py-8 text-center space-y-3">

                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">

                  <CheckCircle2 className="w-10 h-10" />

                </div>

                <h3 className="text-2xl font-bold text-gray-950">Application Received!</h3>

                <p className="text-sm text-gray-600">

                  Our admissions counselor will contact you at <strong>{applicantPhone}</strong> within 24 hours.

                </p>

              </div>

            ) : (

              <div>

                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">

                  <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />

                  <span>ADMISSION DESK 2026-27</span>

                </div>

                <h3 className="text-2xl font-black text-gray-950">Apply for Admission</h3>

                <p className="text-xs text-gray-500 mt-1 mb-6">

                  {displayName} • UDISE: {udiseCode || 'Verified'}

                </p>



                <form onSubmit={handleApplySubmit} className="space-y-4">

                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">

                      Student / Parent Name *

                    </label>

                    <input

                      type="text"

                      required

                      placeholder="e.g. Rahul Sharma"

                      value={applicantName}

                      onChange={(e) => setApplicantName(e.target.value)}

                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

                    />

                  </div>



                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">

                        Phone Number *

                      </label>

                      <input

                        type="tel"

                        required

                        placeholder="+91 98765 43210"

                        value={applicantPhone}

                        onChange={(e) => setApplicantPhone(e.target.value)}

                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

                      />

                    </div>

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">

                        Applying for Class

                      </label>

                      <select

                        value={applicantClass}

                        onChange={(e) => setApplicantClass(e.target.value)}

                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"

                      >

                        <option>Nursery / KG</option>

                        <option>Class 1 - 5 (Primary)</option>

                        <option>Class 6 - 8 (Middle)</option>

                        <option>Class 9 - 10 (Secondary)</option>

                        <option>Class 11 - 12 (Senior Sec)</option>

                      </select>

                    </div>

                  </div>



                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">

                      Email Address

                    </label>

                    <input

                      type="email"

                      placeholder="parent@example.com"

                      value={applicantEmail}

                      onChange={(e) => setApplicantEmail(e.target.value)}

                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

                    />

                  </div>



                  <button

                    type="submit"

                    className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3.5 rounded-[12px] text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all mt-6 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"

                  >

                    <span>Submit Admission Inquiry</span>

                    <Send className="w-4 h-4" />

                  </button>

                </form>

              </div>

            )}

          </div>

        </div>

      )}





      {/* ========================================================= */}

      {/* 13. WRITE A REVIEW MODAL                                  */}

      {/* ========================================================= */}

      {isReviewModalOpen && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">

          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">

            <button

              onClick={() => setIsReviewModalOpen(false)}

              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"

            >

              <X className="w-4 h-4" />

            </button>



            {reviewSubmitted ? (

              <div className="py-8 text-center space-y-3">

                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">

                  <CheckCircle2 className="w-10 h-10" />

                </div>

                <h3 className="text-2xl font-bold text-gray-950">Review Published!</h3>

                <p className="text-sm text-gray-600">

                  Thank you for contributing your genuine feedback to help other parents and students.

                </p>

              </div>

            ) : (

              <div>

                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#005689] mb-1">

                  <span className="w-4 h-1 bg-[#FBBC04] rounded-full inline-block" />

                  <span>COMMUNITY FEEDBACK</span>

                </div>

                <h3 className="text-2xl font-black text-gray-950">Write a Review</h3>

                <p className="text-xs text-gray-500 mt-1 mb-6">

                  Share your authentic experience with {displayName}

                </p>



                <form onSubmit={handleReviewSubmit} className="space-y-4">

                  {/* Rating Stars Selector */}

                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">

                      Overall Rating: {userRating} / 5 Stars

                    </label>

                    <div className="flex items-center gap-2 text-amber-400">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <button

                          key={star}

                          type="button"

                          onClick={() => setUserRating(star)}

                          className="hover:scale-125 transition-transform"

                        >

                          <Star

                            className={`w-7 h-7 ${star <= userRating ? 'fill-amber-400' : 'text-gray-200'}`}

                          />

                        </button>

                      ))}

                    </div>

                  </div>



                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">

                        Your Name *

                      </label>

                      <input

                        type="text"

                        required

                        placeholder="e.g. Ramesh Gupta"

                        value={reviewerName}

                        onChange={(e) => setReviewerName(e.target.value)}

                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

                      />

                    </div>

                    <div>

                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">

                        You are a

                      </label>

                      <select

                        value={reviewerRole}

                        onChange={(e) => setReviewerRole(e.target.value)}

                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"

                      >

                        <option>Parent of Student</option>

                        <option>Current Student</option>

                        <option>Student Alumni</option>

                        <option>Faculty / Teacher</option>

                      </select>

                    </div>

                  </div>



                  <div>

                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">

                      Your Detailed Review *

                    </label>

                    <textarea

                      required

                      rows={4}

                      placeholder="Share your experience about academics, teachers, lab facilities, campus safety, and school culture..."

                      value={reviewComment}

                      onChange={(e) => setReviewComment(e.target.value)}

                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"

                    />

                  </div>



                  <button

                    type="submit"

                    className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3.5 rounded-[12px] text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all mt-6 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"

                  >

                    <span>Post Verified Review</span>

                    <Send className="w-4 h-4" />

                  </button>

                </form>

              </div>

            )}

          </div>

        </div>

      )}





      {/* ========================================================= */}

      {/* 14. VIRTUAL CAMPUS TOUR MODAL                             */}

      {/* ========================================================= */}

      {isTourModalOpen && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">

          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative">

            <button

              onClick={() => setIsTourModalOpen(false)}

              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors z-10"

            >

              <X className="w-4 h-4" />

            </button>



            <h3 className="text-xl font-bold text-gray-950 mb-4 flex items-center gap-2">

              <Play className="w-5 h-5 text-blue-600 fill-current" />

              <span>{displayName} Campus Walkthrough</span>

            </h3>



            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative flex items-center justify-center">

              <iframe

                className="w-full h-full"

                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"

                title="School Campus Walkthrough"

                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

                allowFullScreen

              />

            </div>

          </div>

        </div>

      )}





      {/* ========================================================= */}

      {/* 15. FACILITY DETAIL MODAL (REAL PHOTO & LAB SPECS)        */}

      {/* ========================================================= */}

      {selectedFacility && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">

          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-gray-100">

            <button

              onClick={() => setSelectedFacility(null)}

              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"

            >

              <X className="w-4 h-4" />

            </button>



            {/* Real Photograph Header or Fallback SVG Illustration */}

            <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden flex items-center justify-center">

              {!selectedFacility.photo || imageErrors[selectedFacility.id] ? (

                <div className="w-full h-full bg-slate-50 flex items-center justify-center p-4">

                  <selectedFacility.Illustration className="w-full h-full object-contain max-h-56" />

                </div>

              ) : (

                <img

                  src={selectedFacility.photo}

                  alt={selectedFacility.name}

                  onError={() => setImageErrors((prev) => ({ ...prev, [selectedFacility.id]: true }))}

                  className="w-full h-full object-cover"

                />

              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">

                <div>

                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${selectedFacility.color} text-white shadow-md mb-2`}>

                    {selectedFacility.category}

                  </span>

                  <h3 className="text-2xl font-black">{selectedFacility.name}</h3>

                  <p className="text-xs text-blue-200 mt-0.5">{selectedFacility.tagline}</p>

                </div>

                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold">

                  👥 {selectedFacility.capacity}

                </div>

              </div>

            </div>



            <div className="p-6 space-y-4">

              <p className="text-sm text-gray-700 leading-relaxed">

                {selectedFacility.details}

              </p>



              {/* Lab Specifications List */}

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">

                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">

                  Technical Specifications & Equipment

                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">

                  {selectedFacility.specs?.map((sp: any, sIdx: number) => (

                    <div key={sIdx} className="bg-white p-2.5 rounded-xl border border-gray-100">

                      <div className="text-[10px] font-bold text-gray-400 uppercase">{sp.label}</div>

                      <div className="font-semibold text-gray-900 mt-0.5">{sp.val}</div>

                    </div>

                  ))}

                </div>

              </div>



              <div className="pt-2 flex justify-between items-center">

                <button

                  onClick={() => {

                    setSelectedFacility(null);

                    setIsApplyModalOpen(true);

                  }}

                  className="button_primary bg-[#006FCC] hover:bg-[#005499] text-white text-xs font-bold px-6 py-3 rounded-[12px] flex items-center gap-1.5 shadow-[0_4px_14px_rgba(0,111,204,0.35)] hover:shadow-btn-hi transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"

                >

                  <span>Book Lab Tour & Visit</span>

                  <ArrowRight className="w-3.5 h-3.5" />

                </button>



                <button

                  onClick={() => setSelectedFacility(null)}

                  className="text-xs text-gray-500 hover:text-gray-700 font-semibold px-4 py-2"

                >

                  Close

                </button>

              </div>

            </div>

          </div>

        </div>

      )}





      {/* ========================================================= */}

      {/* 16. CSEEL AUTHENTICATION MODAL (GATED REVIEWS)            */}

      {/* ========================================================= */}

      {isAuthModalOpen && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">

          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">

            <button

              onClick={() => setIsAuthModalOpen(false)}

              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"

            >

              <X className="w-4 h-4" />

            </button>



            {/* Security Brand Header */}

            <div className="flex items-center gap-2.5 mb-5">

              <div className="w-10 h-10 rounded-2xl bg-[#005689] text-white flex items-center justify-center shadow-md">

                <ShieldCheck className="w-5 h-5" />

              </div>

              <div>

                <h3 className="text-lg font-bold text-gray-950 leading-tight">CSEEL Verified Community</h3>

                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">

                  <CheckCircle2 className="w-3 h-3" /> 100% Genuine, Spam-Free Reviews

                </span>

              </div>

            </div>



            <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-[#EDF5FA] p-3 rounded-xl border border-[#D6EDFF]">

              To maintain authenticity and trust for prospective parents and students, reviews can only be posted by verified CSEEL accounts.

            </p>



            {/* Tabs: Sign In / Create Account */}

            <div className="flex border-b border-gray-200 mb-5">

              <button

                type="button"

                onClick={() => setAuthTab('signin')}

                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors ${

                  authTab === 'signin'

                    ? 'border-[#006FCC] text-[#006FCC]'

                    : 'border-transparent text-gray-500 hover:text-gray-800'

                }`}

              >

                Sign In

              </button>

              <button

                type="button"

                onClick={() => setAuthTab('signup')}

                className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-colors ${

                  authTab === 'signup'

                    ? 'border-[#006FCC] text-[#006FCC]'

                    : 'border-transparent text-gray-500 hover:text-gray-800'

                }`}

              >

                Create CSEEL Account

              </button>

            </div>



            {/* Google One-Click SSO */}

            <button

              type="button"

              onClick={() => {

                setIsLoggedIn(true);

                setLoggedInUser({

                  name: 'Sunita Sharma',

                  email: 'sunita.sharma@gmail.com',

                  role: 'Verified Parent'

                });

                setReviewerName('Sunita Sharma');

                setReviewerRole('Parent');

                setIsAuthModalOpen(false);

                setIsReviewModalOpen(true);

              }}

              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-[12px] text-xs font-bold text-gray-700 hover:bg-[#EDF5FA] shadow-sm transition-all active:scale-[0.99] mb-4 cursor-pointer"

            >

              <svg className="w-4 h-4" viewBox="0 0 24 24">

                <path

                  fill="#4285F4"

                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"

                />

                <path

                  fill="#34A853"

                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"

                />

                <path

                  fill="#FBBC05"

                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"

                />

                <path

                  fill="#EA4335"

                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"

                />

              </svg>

              <span>Continue with Google</span>

            </button>



            <div className="flex items-center my-4">

              <div className="flex-1 border-t border-gray-200" />

              <span className="px-3 text-[11px] text-gray-400 font-medium uppercase">Or with mobile / email</span>

              <div className="flex-1 border-t border-gray-200" />

            </div>



            {/* Form */}

            <form

              onSubmit={(e) => {

                e.preventDefault();

                setIsLoggedIn(true);

                setLoggedInUser({

                  name: authName || 'CSEEL Community Member',

                  email: authEmailOrPhone,

                  role: `Verified ${authRole}`

                });

                setReviewerName(authName || 'Community Member');

                setReviewerRole(authRole);

                setIsAuthModalOpen(false);

                setIsReviewModalOpen(true);

              }}

              className="space-y-3.5"

            >

              {authTab === 'signup' && (

                <div>

                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">

                    Full Name *

                  </label>

                  <input

                    type="text"

                    required

                    placeholder="e.g. Priya Sharma"

                    value={authName}

                    onChange={(e) => setAuthName(e.target.value)}

                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"

                  />

                </div>

              )}



              <div>

                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">

                  Email or Mobile Number *

                </label>

                <input

                  type="text"

                  required

                  placeholder="e.g. 9876543210 or email@domain.com"

                  value={authEmailOrPhone}

                  onChange={(e) => setAuthEmailOrPhone(e.target.value)}

                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"

                />

              </div>



              <div>

                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">

                  Password *

                </label>

                <input

                  type="password"

                  required

                  placeholder="••••••••"

                  value={authPassword}

                  onChange={(e) => setAuthPassword(e.target.value)}

                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#006FCC]"

                />

              </div>



              {authTab === 'signup' && (

                <div>

                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">

                    Your Relationship with {displayName}

                  </label>

                  <div className="grid grid-cols-3 gap-2">

                    {(['Parent', 'Student', 'Alumni'] as const).map((r) => (

                      <button

                        type="button"

                        key={r}

                        onClick={() => setAuthRole(r)}

                        className={`py-2 px-2 text-[11px] font-bold rounded-[12px] border text-center transition-colors cursor-pointer ${

                          authRole === r

                            ? 'border-[#006FCC] bg-[#EDF5FA] text-[#006FCC]'

                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'

                        }`}

                      >

                        {r}

                      </button>

                    ))}

                  </div>

                </div>

              )}



              <button

                type="submit"

                className="w-full button_primary bg-[#006FCC] hover:bg-[#005499] text-white font-bold py-3 rounded-[12px] text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,111,204,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4 cursor-pointer"

              >

                <Lock className="w-3.5 h-3.5" />

                <span>{authTab === 'signin' ? 'Sign In & Write Review' : 'Create Account & Write Review'}</span>

              </button>

            </form>

          </div>

        </div>

      )}



      {/* Dynamic Add/Edit Card Modals for Facilities and Admissions */}

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

              const facilityPayload = {

                title: card.title,

                desc: card.desc || card.criteria || 'Standard school facility',

                points: card.points,

                icon: card.icon,

                illustration: card.illustration,

                badge: card.badge

              };

              if (editingFacility) {

                templateCtx?.updateFacilityCard(editingFacility.id, facilityPayload);

              } else {

                templateCtx?.addFacilityCard(facilityPayload);

              }

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

              const admissionPayload = {

                title: card.title,

                criteria: card.criteria || card.desc || 'Standard admission criteria',

                points: card.points,

                fees: card.fees,

                icon: card.icon,

                illustration: card.illustration,

                badge: card.badge

              };

              if (editingAdmission) {

                templateCtx?.updateAdmissionCard(editingAdmission.id, admissionPayload);

              } else {

                templateCtx?.addAdmissionCard(admissionPayload);

              }

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

              if (editingFaculty) {

                templateCtx?.updateFacultyCard(editingFaculty.id, member);

              } else {

                templateCtx?.addFacultyCard(member);

              }

            }}

          />

          <GalleryModal

            isOpen={isGalleryModalOpen}

            onClose={() => setIsGalleryModalOpen(false)}

            onSave={(item) => {

              templateCtx?.addGalleryItem(item);

            }}

          />

          <AwardModal

            isOpen={isAwardModalOpen}

            onClose={() => {

              setIsAwardModalOpen(false);

              setEditingAward(null);

            }}

            initialData={editingAward}

            onSave={(award) => {

              if (editingAward) {

                templateCtx?.updateAwardCard(editingAward.id, award);

              } else {

                templateCtx?.addAwardCard(award);

              }

            }}

          />

        </>

      )}



    </div>

  );

}

