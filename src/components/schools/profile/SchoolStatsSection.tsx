'use client';

import React, { useState } from 'react';
import { Info, X, ExternalLink, ShieldCheck } from 'lucide-react';
import EditableText from '@/components/schools/template/EditableText';
import EditableIcon from '@/components/schools/template/EditableIcon';

export interface SchoolStatsSectionProps {
  displayBoard: string;
  displayUdise: string;
  totalStudents: number;
  totalTeachers: number;
  classroomsCount: number;
  schoolCategory: string;
  classFrom: string;
  classTo: string;
  templateData: any;
  residentialSchool?: string;
  schoolType?: string;
  medium?: string;
  genderType?: string;
  establishedYear?: string;
  campusArea?: string;
  affiliationNumber?: string;
  isUnverified?: boolean;
  atalStemLab?: string;
  scienceLab?: string;
  library?: string;
  computerIctLab?: string;
  lat?: number;
  lng?: number;
  state?: string;
  district?: string;
  blockName?: string;
  clusterName?: string;
  village?: string;
}

export function formatShortStatKeyword(text: string, type: 'management' | 'gender' | 'nature' | 'medium'): string {
  if (!text) return '';
  const lower = text.toLowerCase().trim();
  
  if (type === 'management') {
    if (lower.includes('private') || lower.includes('pvt') || lower.includes('unaided') || lower.includes('un-aided')) return 'Private';
    if (lower.includes('aided')) return 'Aided';
    if (lower.includes('central') || lower.includes('kendriya') || lower.includes('kvs') || lower.includes('jnv')) return 'Central Govt';
    if (lower.includes('govt') || lower.includes('government') || lower.includes('dept') || lower.includes('tribal')) return 'Govt';
    return 'Private';
  }

  if (type === 'gender') {
    if (lower.includes('co-ed') || lower.includes('coed') || lower.includes('co-educat')) return 'Co-Edu';
    if (lower.includes('boys')) return 'Boys';
    if (lower.includes('girls')) return 'Girls';
    return 'Co-Edu';
  }

  if (type === 'nature') {
    if (lower.includes('day') && (lower.includes('boarding') || lower.includes('residen'))) return 'Day-Boarding';
    if (lower.includes('day')) return 'Day School';
    if (lower.includes('boarding') || lower.includes('residen')) return 'Residential';
    return text.length > 12 ? text.slice(0, 12) : text;
  }

  if (type === 'medium') {
    if (lower.includes('english') && lower.includes('hindi')) return 'Eng / Hin';
    if (lower.includes('english')) return 'English';
    if (lower.includes('hindi')) return 'Hindi';
    return text.length > 10 ? text.slice(0, 10) : text;
  }

  return text;
}

export function formatOrdinal(num: number | string): string {
  const n = parseInt(String(num).replace(/\D/g, ''), 10);
  if (isNaN(n)) return String(num);
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

export function parseGradePart(part: string): string {
  const p = (part || '').toLowerCase().trim();
  if (!p) return '';
  if (p.includes('nur') || p.includes('pre') || p.includes('kg')) return 'Nursery';
  const numMatch = p.match(/\d+/);
  if (numMatch) return formatOrdinal(numMatch[0]);
  const romanMap: Record<string, string> = {
    'i': '1st', 'ii': '2nd', 'iii': '3rd', 'iv': '4th', 'v': '5th',
    'vi': '6th', 'vii': '7th', 'viii': '8th', 'ix': '9th', 'x': '10th',
    'xi': '11th', 'xii': '12th'
  };
  const romanMatch = p.match(/\b(xii|xi|x|ix|viii|vii|vi|v|iv|iii|ii|i)\b/);
  if (romanMatch) return romanMap[romanMatch[1]];
  return p;
}

export function formatShortGradeRange(raw: string, classFrom?: string, classTo?: string): string {
  let val = (raw || '').trim();
  if (!val && classFrom && classTo) {
    val = `${classFrom} - ${classTo}`;
  }
  if (!val) return 'Nursery - 12th';

  const lower = val.toLowerCase();

  // UDISE Standard Categories
  if (lower.includes('sec and higher sec') || (lower.includes('primary') && lower.includes('higher sec'))) return '1st - 12th';
  if (lower.includes('upper pr') && lower.includes('higher sec')) return '6th - 12th';
  if (lower.includes('up pr. and secondary') || (lower.includes('primary') && lower.includes('secondary only'))) return '1st - 10th';
  if (lower.includes('upper primary only') || lower.includes('up. pr')) return '6th - 8th';
  if (lower.includes('higher secondary only')) return '11th - 12th';
  if (lower.includes('secondary only')) return '9th - 10th';
  if (lower.includes('primary only')) return '1st - 5th';

  const normalized = val
    .replace(/pre[- ]?primary/gi, 'Nursery')
    .replace(/pre[- ]?k/gi, 'Nursery')
    .replace(/nur\b/gi, 'Nursery')
    .replace(/nursery/gi, 'Nursery');

  // Split by range separators: -, –, to, /
  const parts = normalized.split(/\s*[-–]\s*|\s*\bto\b\s*|\s*\/\s*/i);
  if (parts.length >= 2) {
    const start = parseGradePart(parts[0]);
    const end = parseGradePart(parts[parts.length - 1]);
    if (start && end) {
      return `${start} - ${end}`;
    }
  }

  const single = parseGradePart(normalized);
  return single.length > 14 ? single.slice(0, 14) : single;
}

export function formatShortRooms(raw: string, count?: number): string {
  if (raw) {
    const trimmed = raw.trim();
    const match = trimmed.match(/^(\d+\+?)\s*(?:labs?\s*&?\s*rooms?|rooms?\s*&?\s*labs?|rooms?|labs?)/i);
    if (match) {
      return `${match[1]} Rooms`;
    }
    if (trimmed.length > 11) {
      return trimmed.slice(0, 11);
    }
    return trimmed;
  }
  if (count && count > 0) return `${count} Rooms`;
  return '35+ Rooms';
}

export function formatShortBoard(board: string): string {
  if (!board || board === 'N/A') return 'CBSE';
  const trimmed = board.trim();
  const lower = trimmed.toLowerCase();
  if (lower.includes('cbse')) return 'CBSE';
  if (lower.includes('icse') || lower.includes('cisce')) return 'ICSE';
  if (lower.includes('ib') || lower.includes('international baccalaureate')) return 'IB';
  if (lower.includes('cambridge') || lower.includes('igcse')) return 'Cambridge';
  if (lower.includes('state') || lower.includes('state board')) return 'State Board';
  return trimmed.length > 10 ? trimmed.split(' ')[0] : trimmed;
}

export function formatShortRatio(ratio: string): string {
  if (!ratio) return '1:20';
  const trimmed = ratio.trim();
  return trimmed.length > 8 ? trimmed.slice(0, 8) : trimmed;
}

export function formatCompactArea(raw?: string | number): string {
  if (!raw || raw === '—' || raw === 'N/A') return '—';
  const str = String(raw).trim();
  const sqMatch = str.match(/(\d[\d,]*)\s*(?:sq\.?\s*m(?:t|eters?)?|sqm)/i);
  if (sqMatch) {
    const num = parseInt(sqMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) return `${num.toLocaleString('en-IN')} sq mt`;
  }
  const acreMatch = str.match(/([\d.]+)\s*acres?/i);
  if (acreMatch) {
    const acres = parseFloat(acreMatch[1]);
    if (!isNaN(acres) && acres > 0) return `${Math.round(acres * 4046.86).toLocaleString('en-IN')} sq mt`;
  }
  return str.length > 16 ? str.slice(0, 16) : str;
}

export default function SchoolStatsSection({
  displayBoard,
  totalStudents,
  totalTeachers,
  classroomsCount,
  schoolCategory,
  classFrom,
  classTo,
  templateData,
  residentialSchool,
  schoolType,
  medium,
  genderType,
  establishedYear,
  campusArea,
  affiliationNumber,
  isUnverified = false,
  atalStemLab,
  scienceLab,
  library,
  computerIctLab,
  lat,
  lng,
  state,
  district,
  blockName,
  clusterName,
  village,
}: SchoolStatsSectionProps) {
  const [isBoardInfoModalOpen, setIsBoardInfoModalOpen] = useState(false);
  const rawResidential = templateData?.contentOverrides?.['hero_stat_val_nature'] || residentialSchool || templateData?.schoolFormat || 'Day School';
  const rawSchoolType = templateData?.contentOverrides?.['hero_stat_val_mgmt'] || templateData?.management || schoolType || 'Private';
  const rawMedium = templateData?.contentOverrides?.['hero_stat_val_med'] || templateData?.medium || medium || 'English';
  const rawGender = templateData?.contentOverrides?.['hero_stat_val_gender'] || templateData?.genderType || genderType || 'Co-Educational';
  const rawBoard = templateData?.contentOverrides?.['hero_stat_val_1'] || displayBoard || 'CBSE';
  const rawRatio = templateData?.contentOverrides?.['hero_stat_val_2'] || (totalStudents > 0 && totalTeachers > 0 ? `1:${Math.round(totalStudents / Math.max(totalTeachers, 1))}` : '1:20');
  const rawRooms = templateData?.contentOverrides?.['hero_stat_val_3'] || (classroomsCount > 0 ? `${classroomsCount} Rooms` : '—');
  const rawGrades = templateData?.contentOverrides?.['hero_stat_val_4'] || (classFrom && classTo ? `${classFrom} - ${classTo}` : '1st - 12th');

  const effStudents = Number(templateData?.totalStudents) > 0 ? Number(templateData.totalStudents) : totalStudents;
  const effTeachers = Number(templateData?.totalTeachers) > 0 ? Number(templateData.totalTeachers) : totalTeachers;
  const displayEstablished = String(templateData?.establishedYear || establishedYear || '—').trim();
  const displayAff = String(templateData?.affiliationNumber || affiliationNumber || '').trim();
  const displayArea = formatCompactArea(templateData?.campusArea || campusArea);

  const shortBoard = formatShortBoard(rawBoard);
  const defaultBoardIcon = shortBoard === 'CBSE' ? 'CBSE'
    : shortBoard === 'HBSE' ? 'HBSE'
    : shortBoard === 'ICSE' ? 'ICSE'
    : shortBoard === 'IB' ? 'IB'
    : shortBoard === 'Cambridge' ? 'Cambridge'
    : 'CBSE';

  const isValidValue = (val: any): boolean => {
    if (val === undefined || val === null) return false;
    const s = String(val).trim();
    if (!s || s === '—' || s === '-' || s === '0') return false;
    const lower = s.toLowerCase();
    return lower !== 'na' && lower !== 'n/a' && lower !== 'null' && lower !== 'undefined' && lower !== 'not listed in udise' && lower !== 'recorded in udise' && lower !== 'cluster' && lower !== 'block' && lower !== 'campus';
  };

  const isPositiveFlag = (val: any): boolean => {
    if (!val) return false;
    const s = String(val).trim().toLowerCase();
    return s === 'yes' || s === '1' || s === 'true' || s.includes('available') || s.includes('established') || s.includes('equipped');
  };

  const isResidentialSchool = (val: any): boolean => {
    if (!val) return false;
    const s = String(val).trim().toLowerCase();
    return s.includes('residential') || s.includes('boarding') || s === 'yes' || s === '1';
  };

  const isResidential = isResidentialSchool(rawResidential);
  const isAtl = isPositiveFlag(atalStemLab);
  const isScienceLab = isPositiveFlag(scienceLab);
  const isLibrary = isPositiveFlag(library);
  const isComputerLab = isPositiveFlag(computerIctLab);

  const unverifiedCards: Array<{
    label: string;
    value: string;
    valKey: string;
    lblKey: string;
    icon: string;
    tone: string;
  }> = [];

  // 1. Board / Affiliation
  if (isValidValue(shortBoard)) {
    unverifiedCards.push({
      label: 'Board / Affiliation',
      value: shortBoard,
      valKey: 'hero_stat_val_1',
      lblKey: 'hero_stat_lbl_1',
      icon: defaultBoardIcon,
      tone: 'bg-amber-50 text-amber-700 border-amber-200/80',
    });
  }

  // 2. Classes Taught
  const gradesValue = formatShortGradeRange(rawGrades, classFrom, classTo);
  if (isValidValue(gradesValue)) {
    unverifiedCards.push({
      label: 'Classes Taught',
      value: gradesValue,
      valKey: 'hero_stat_val_4',
      lblKey: 'hero_stat_lbl_4',
      icon: 'GraduationCap',
      tone: 'bg-teal-50 text-teal-700 border-teal-200/80',
    });
  }

  // 3. Co-Educational Status
  const genderValue = formatShortStatKeyword(rawGender, 'gender');
  if (isValidValue(genderValue)) {
    unverifiedCards.push({
      label: 'Co-Educational',
      value: genderValue,
      valKey: 'hero_stat_val_gender',
      lblKey: 'hero_stat_lbl_nature',
      icon: 'Home',
      tone: 'bg-purple-50 text-purple-700 border-purple-200/80',
    });
  }

  // 4. Instruction Medium
  const mediumValue = formatShortStatKeyword(rawMedium, 'medium');
  if (isValidValue(mediumValue)) {
    unverifiedCards.push({
      label: 'Instruction Medium',
      value: mediumValue,
      valKey: 'hero_stat_val_med',
      lblKey: 'hero_stat_lbl_med',
      icon: 'BookOpen',
      tone: 'bg-blue-50 text-blue-700 border-blue-200/80',
    });
  }

  // 5. Management
  const mgmtValue = formatShortStatKeyword(rawSchoolType, 'management');
  if (isValidValue(mgmtValue)) {
    unverifiedCards.push({
      label: 'Management',
      value: mgmtValue,
      valKey: 'hero_stat_val_mgmt',
      lblKey: 'hero_stat_lbl_mgmt',
      icon: 'Building2',
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    });
  }

  // 6. Established Year
  if (isValidValue(displayEstablished)) {
    unverifiedCards.push({
      label: 'Established Year',
      value: displayEstablished,
      valKey: 'hero_stat_val_est',
      lblKey: 'hero_stat_lbl_est',
      icon: 'ShieldCheck',
      tone: 'bg-slate-100 text-slate-700 border-slate-200',
    });
  }

  // 7. Residential Status (ONLY if residential)
  if (isResidential) {
    unverifiedCards.push({
      label: 'School Nature',
      value: 'Residential School',
      valKey: 'hero_stat_val_nature',
      lblKey: 'hero_stat_lbl_nature_type',
      icon: 'Home',
      tone: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    });
  }

  // 8. District
  if (isValidValue(district)) {
    unverifiedCards.push({
      label: 'District',
      value: district!,
      valKey: 'hero_stat_val_district',
      lblKey: 'hero_stat_lbl_district',
      icon: 'MapPin',
      tone: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
    });
  }

  // 9. State
  if (isValidValue(state)) {
    unverifiedCards.push({
      label: 'State',
      value: state!,
      valKey: 'hero_stat_val_state',
      lblKey: 'hero_stat_lbl_state',
      icon: 'Building2',
      tone: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    });
  }

  // 10. Block (ONLY if available & non-null)
  if (isValidValue(blockName) && blockName?.toLowerCase() !== 'campus' && blockName?.toLowerCase() !== district?.toLowerCase()) {
    unverifiedCards.push({
      label: 'Block',
      value: blockName!,
      valKey: 'hero_stat_val_block',
      lblKey: 'hero_stat_lbl_block',
      icon: 'Layers',
      tone: 'bg-amber-50 text-amber-800 border-amber-200/80',
    });
  }

  // 11. Cluster (ONLY if available & non-null)
  if (isValidValue(clusterName) && clusterName?.toLowerCase() !== 'campus') {
    unverifiedCards.push({
      label: 'Cluster',
      value: clusterName!,
      valKey: 'hero_stat_val_cluster',
      lblKey: 'hero_stat_lbl_cluster',
      icon: 'Compass',
      tone: 'bg-violet-50 text-violet-800 border-violet-200/80',
    });
  }

  // 12. Village / Ward (ONLY if available & non-null)
  if (isValidValue(village) && village?.toLowerCase() !== 'campus' && village?.toLowerCase() !== district?.toLowerCase()) {
    unverifiedCards.push({
      label: 'Village / Ward',
      value: village!,
      valKey: 'hero_stat_val_village',
      lblKey: 'hero_stat_lbl_village',
      icon: 'MapPin',
      tone: 'bg-rose-50 text-rose-800 border-rose-200/80',
    });
  }

  // 13. Atal Tinkering Lab (ONLY if available & affirmative)
  if (isAtl) {
    unverifiedCards.push({
      label: 'Atal Tinkering Lab',
      value: 'Established (ATL)',
      valKey: 'hero_stat_val_atl',
      lblKey: 'hero_stat_lbl_atl',
      icon: 'FlaskConical',
      tone: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    });
  }

  // 14. Integrated Science Lab (ONLY if available & affirmative)
  if (isScienceLab) {
    unverifiedCards.push({
      label: 'Science Lab',
      value: 'Available',
      valKey: 'hero_stat_val_sci',
      lblKey: 'hero_stat_lbl_sci',
      icon: 'FlaskConical',
      tone: 'bg-teal-50 text-teal-800 border-teal-200',
    });
  }

  // 15. Library (ONLY if available & affirmative)
  if (isLibrary) {
    unverifiedCards.push({
      label: 'School Library',
      value: 'Available',
      valKey: 'hero_stat_val_lib',
      lblKey: 'hero_stat_lbl_lib',
      icon: 'BookOpen',
      tone: 'bg-blue-50 text-blue-800 border-blue-200',
    });
  }

  // 16. Computer / ICT Lab (ONLY if available & affirmative)
  if (isComputerLab) {
    unverifiedCards.push({
      label: 'Computer Lab',
      value: 'Available',
      valKey: 'hero_stat_val_ict',
      lblKey: 'hero_stat_lbl_ict',
      icon: 'Layers',
      tone: 'bg-sky-50 text-sky-800 border-sky-200',
    });
  }

  const fullVerifiedCards = [
    {
      label: 'Board',
      value: shortBoard,
      valKey: 'hero_stat_val_1',
      lblKey: 'hero_stat_lbl_1',
      icon: defaultBoardIcon,
      tone: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    {
      label: 'Students',
      value: effStudents > 0 ? effStudents.toLocaleString('en-IN') : '—',
      valKey: 'hero_stat_val_students',
      lblKey: 'hero_stat_lbl_students',
      icon: 'Users',
      tone: 'bg-sky-50 text-[#005689] border-sky-200/80',
    },
    {
      label: `Faculty (${formatShortRatio(rawRatio)})`,
      value: effTeachers > 0 ? `${effTeachers} Teachers` : formatShortRatio(rawRatio),
      valKey: 'hero_stat_val_2',
      lblKey: 'hero_stat_lbl_2',
      icon: 'UsersRound',
      tone: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    },
    {
      label: 'Classes',
      value: formatShortGradeRange(rawGrades, classFrom, classTo),
      valKey: 'hero_stat_val_4',
      lblKey: 'hero_stat_lbl_4',
      icon: 'GraduationCap',
      tone: 'bg-teal-50 text-teal-700 border-teal-200/80',
    },
    {
      label: 'Medium',
      value: formatShortStatKeyword(rawMedium, 'medium'),
      valKey: 'hero_stat_val_med',
      lblKey: 'hero_stat_lbl_med',
      icon: 'BookOpen',
      tone: 'bg-blue-50 text-blue-700 border-blue-200/80',
    },
    {
      label: 'Management',
      value: formatShortStatKeyword(rawSchoolType, 'management'),
      valKey: 'hero_stat_val_mgmt',
      lblKey: 'hero_stat_lbl_mgmt',
      icon: 'Building2',
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    {
      label: formatShortStatKeyword(rawResidential, 'nature'),
      value: formatShortStatKeyword(rawGender, 'gender'),
      valKey: 'hero_stat_val_gender',
      lblKey: 'hero_stat_lbl_nature',
      icon: 'Home',
      tone: 'bg-purple-50 text-purple-700 border-purple-200/80',
    },
    {
      label: 'Classrooms',
      value: formatShortRooms(rawRooms, classroomsCount),
      valKey: 'hero_stat_val_3',
      lblKey: 'hero_stat_lbl_rooms',
      icon: 'FlaskConical',
      tone: 'bg-orange-50 text-orange-700 border-orange-200/80',
    },
    {
      label: 'Established',
      value: displayEstablished || '—',
      valKey: 'hero_stat_val_est',
      lblKey: 'hero_stat_lbl_est',
      icon: 'ShieldCheck',
      tone: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      label: displayAff ? 'Affiliation No.' : 'Campus Area',
      value: displayAff || (displayArea !== '—' ? displayArea : 'Verified'),
      valKey: 'hero_stat_val_aff',
      lblKey: 'hero_stat_lbl_aff',
      icon: 'Compass',
      tone: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
    },
  ];

  const cards = isUnverified ? unverifiedCards : fullVerifiedCards;

  return (
    <section id="school-key-metrics" className="relative z-20 w-full bg-[#EEF2F6] border-b border-[#DCE2E8] py-3.5 sm:py-5">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006FCC] animate-pulse" />
            <EditableText
              contentKey="stats_section_heading"
              value="School Snapshot"
              className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-[#006FCC] font-['Montserrat',sans-serif]"
              showVerificationBadge={false}
            />
          </div>
          <EditableText
            contentKey="stats_badge_text"
            value="Verified Record"
            className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline"
            showVerificationBadge={false}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {cards.map((card, i) => (
            <div
              key={card.label + i}
              className="group rounded-xl sm:rounded-2xl bg-white p-2.5 border border-[#E8E9E9] shadow-2xs hover:border-[#006FCC]/40 transition-all flex items-center gap-2 min-w-0"
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center shrink-0 ${card.tone}`}>
                <EditableIcon iconKey={`stat_icon_${i + 1}`} defaultIcon={card.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate flex items-center justify-between gap-1">
                  <EditableText
                    contentKey={card.valKey}
                    value={card.value}
                    placeholder="Enter value"
                    className="text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] block truncate"
                    showVerificationBadge={false}
                  />
                  {i === 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBoardInfoModalOpen(true);
                      }}
                      className="w-4 h-4 rounded-full text-slate-400 hover:text-[#006FCC] hover:bg-sky-50 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                      title="View Board & Affiliation Details"
                      aria-label="View Board & Affiliation Details"
                    >
                      <Info size={11} strokeWidth={2.4} />
                    </button>
                  )}
                </div>
                <div className="text-[9.5px] font-semibold text-slate-500 truncate leading-tight mt-0.5">
                  <EditableText
                    contentKey={card.lblKey}
                    value={card.label}
                    placeholder="Enter label"
                    className="text-[9.5px] font-semibold text-slate-500 block truncate"
                    showVerificationBadge={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Board & Affiliation Details Modal ── */}
      {isBoardInfoModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="bg-gradient-to-r from-[#003C6E] to-[#005689] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Board & Affiliation Details</h3>
                  <p className="text-[11px] text-sky-100">Official Educational Accreditation Record</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBoardInfoModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Education Board</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{rawBoard}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Affiliation Status</span>
                  <span className="font-bold text-emerald-700 text-sm mt-0.5 block">Affiliated / Verified</span>
                </div>
              </div>

              {displayAff && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Affiliation / Registration No.</span>
                  <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">{displayAff}</span>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved Grades:</span>
                  <span className="font-semibold text-slate-800">{rawGrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Medium of Instruction:</span>
                  <span className="font-semibold text-slate-800">{rawMedium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution Type:</span>
                  <span className="font-semibold text-slate-800">{rawSchoolType} ({rawGender})</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                This school is officially recognized under the National Education Policy guidelines with verified national board curriculum standards.
              </p>

              <button
                type="button"
                onClick={() => setIsBoardInfoModalOpen(false)}
                className="w-full py-2 px-4 rounded-xl bg-[#005689] hover:bg-[#004168] text-white text-xs font-bold shadow transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
