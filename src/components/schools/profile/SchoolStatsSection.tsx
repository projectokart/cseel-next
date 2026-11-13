'use client';

import React from 'react';
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
}: SchoolStatsSectionProps) {
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

  const cards = [
    {
      label: 'Board',
      value: formatShortBoard(rawBoard),
      icon: 'Award',
      tone: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    {
      label: 'Students',
      value: effStudents > 0 ? effStudents.toLocaleString('en-IN') : '—',
      icon: 'Users',
      tone: 'bg-sky-50 text-[#005689] border-sky-200/80',
    },
    {
      label: `Faculty (${formatShortRatio(rawRatio)})`,
      value: effTeachers > 0 ? `${effTeachers} Teachers` : formatShortRatio(rawRatio),
      icon: 'UsersRound',
      tone: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    },
    {
      label: 'Classes',
      value: formatShortGradeRange(rawGrades, classFrom, classTo),
      icon: 'GraduationCap',
      tone: 'bg-teal-50 text-teal-700 border-teal-200/80',
    },
    {
      label: 'Medium',
      value: formatShortStatKeyword(rawMedium, 'medium'),
      icon: 'BookOpen',
      tone: 'bg-blue-50 text-blue-700 border-blue-200/80',
    },
    {
      label: 'Management',
      value: formatShortStatKeyword(rawSchoolType, 'management'),
      icon: 'Building2',
      tone: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    {
      label: formatShortStatKeyword(rawResidential, 'nature'),
      value: formatShortStatKeyword(rawGender, 'gender'),
      icon: 'Home',
      tone: 'bg-purple-50 text-purple-700 border-purple-200/80',
    },
    {
      label: 'Classrooms',
      value: formatShortRooms(rawRooms, classroomsCount),
      icon: 'FlaskConical',
      tone: 'bg-orange-50 text-orange-700 border-orange-200/80',
    },
    {
      label: 'Established',
      value: displayEstablished || '—',
      icon: 'ShieldCheck',
      tone: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      label: displayAff ? 'Affiliation No.' : 'Campus Area',
      value: displayAff || (displayArea !== '—' ? displayArea : 'Verified'),
      icon: 'Compass',
      tone: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
    },
  ];

  return (
    <section id="school-key-metrics" className="relative z-20 w-full bg-[#EEF2F6] border-b border-[#DCE2E8] py-3.5 sm:py-5">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006FCC] animate-pulse" />
            <span className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-[#006FCC] font-['Montserrat',sans-serif]">
              School Snapshot &amp; UDISE+ Indicators
            </span>
          </div>
          <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
            Verified Record
          </span>
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
              <div className="min-w-0 flex-1">
                <div className="text-[11px] sm:text-xs font-bold font-['Montserrat',sans-serif] text-[#003C6E] leading-tight truncate">
                  {card.value}
                </div>
                <div className="text-[9.5px] font-semibold text-slate-500 truncate leading-tight mt-0.5">
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
