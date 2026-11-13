'use client';

import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Phone,
  Mail,
  Trash2,
  Plus,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import EditorialMarkupRenderer from '@/components/schools/profile/EditorialMarkupRenderer';
import EditorialMarkupEditor from '@/components/schools/profile/EditorialMarkupEditor';

export interface FeeTermItem {
  id: string;
  category: string;
  title: string;
  description: string;
}

export const DEFAULT_FEE_TERMS: FeeTermItem[] = [
  {
    id: 'term-1',
    category: 'Due Date',
    title: 'Quarterly / Monthly Remittance Due Date',
    description: 'School fees must be deposited on or before the 10th of every scheduled month or quarter. A nominal late fee of ₹50 per working day is applicable from the 16th onwards.'
  },
  {
    id: 'term-2',
    category: 'Payment Modes',
    title: 'Accepted Digital & Bank Payment Modes',
    description: 'Payments are accepted via the Official Online School ERP Portal, Net Banking (NEFT/RTGS), UPI QR code, and Account Payee Cheques / Demand Drafts.'
  },
  {
    id: 'term-3',
    category: 'Refund & TC',
    title: 'Withdrawal & Caution Money Policy',
    description: 'A minimum of 30 days prior written notice is mandatory for student withdrawal and Transfer Certificate (TC) issuance. Caution/Security deposits are refundable upon clearance of all school dues.'
  },
  {
    id: 'term-4',
    category: 'Concessions',
    title: 'Sibling & Merit Concession Policy',
    description: 'A 10% concession on composite tuition fees is extended to the younger sibling enrolled simultaneously in regular day school. Special merit waivers are offered to academic toppers.'
  },
  {
    id: 'term-5',
    category: 'Important Note',
    title: 'Annual Fee Revision & Documentation',
    description: 'Tuition fees are subject to regulatory annual revisions as sanctioned by the state education department. All fee receipts must be retained by parents for official records and income tax rebates.'
  }
];

export interface SchoolFeeSectionProps {
  displayName: string;
  displayBoard: string;
  displayUdise: string;
  displayAddress: string;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  classFrom?: string;
  classTo?: string;
  schoolCategory?: string;
  totalStudents?: number;
  totalTeachers?: number;
  isEditMode?: boolean;
  templateData?: any;
  initialProfileData?: any;
  admissionPhone?: string;
  setAdmissionPhone?: (val: string) => void;
  admissionEmail?: string;
  setAdmissionEmail?: (val: string) => void;
  feesTable: { columns: string[]; rows: string[][] };
  setFeesTable: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>;
  extraChargesTable: { columns: string[]; rows: string[][] };
  setExtraChargesTable: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>;
  feeTermsList?: FeeTermItem[];
  setFeeTermsList?: React.Dispatch<React.SetStateAction<FeeTermItem[]>>;
  templateCtx?: any;
}

export default function SchoolFeeSection({
  displayName,
  displayBoard,
  displayUdise,
  displayAddress,
  state,
  district,
  village,
  pincode,
  classFrom,
  classTo,
  schoolCategory,
  totalStudents,
  totalTeachers,
  isEditMode = false,
  templateData,
  initialProfileData,
  admissionPhone = '',
  setAdmissionPhone,
  admissionEmail = '',
  setAdmissionEmail,
  feesTable,
  setFeesTable,
  extraChargesTable,
  setExtraChargesTable,
  feeTermsList: propFeeTermsList,
  setFeeTermsList: propSetFeeTermsList,
  templateCtx,
}: SchoolFeeSectionProps) {
  const [internalTermsList, setInternalTermsList] = useState<FeeTermItem[]>(() => {
    if (propFeeTermsList && propFeeTermsList.length > 0) return propFeeTermsList;
    if (templateData?.feeTermsList && Array.isArray(templateData.feeTermsList) && templateData.feeTermsList.length > 0) {
      return templateData.feeTermsList;
    }
    if (initialProfileData?.feeTermsList && Array.isArray(initialProfileData.feeTermsList) && initialProfileData.feeTermsList.length > 0) {
      return initialProfileData.feeTermsList;
    }
    return DEFAULT_FEE_TERMS;
  });

  const termsList = propFeeTermsList || internalTermsList;
  const updateTerms = (newTerms: FeeTermItem[]) => {
    if (propSetFeeTermsList) {
      propSetFeeTermsList(newTerms);
    } else {
      setInternalTermsList(newTerms);
    }
    if (templateData) {
      templateData.feeTermsList = newTerms;
    }
  };

  const addTermItem = () => {
    const newItem: FeeTermItem = {
      id: `term-${Date.now()}`,
      category: 'Due Date',
      title: 'New Term / Important Instruction',
      description: 'Enter fee due date guidelines, penalty grace period, or required documents here.'
    };
    updateTerms([...termsList, newItem]);
  };

  const removeTermItem = (id: string) => {
    updateTerms(termsList.filter(t => t.id !== id));
  };

  const updateTermItem = (id: string, field: keyof FeeTermItem, val: string) => {
    updateTerms(termsList.map(t => t.id === id ? { ...t, [field]: val } : t));
  };

  const getCategoryTheme = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('due') || cat.includes('date')) {
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', icon: Calendar, tag: 'Due Date' };
    }
    if (cat.includes('payment') || cat.includes('mode')) {
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', icon: CreditCard, tag: 'Payment Mode' };
    }
    if (cat.includes('refund') || cat.includes('tc') || cat.includes('withdr')) {
      return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', icon: ShieldCheck, tag: 'Refund & TC' };
    }
    if (cat.includes('concession') || cat.includes('scholarship') || cat.includes('sibling')) {
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', icon: Sparkles, tag: 'Concession' };
    }
    return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', icon: AlertCircle, tag: 'Important Note' };
  };
  const renderDynamicTable = (
    title: string, 
    data: { columns: string[]; rows: string[][] }, 
    setData: React.Dispatch<React.SetStateAction<{ columns: string[]; rows: string[][] }>>
  ) => {
    const rawCols = (
      Array.isArray(data?.columns) && data.columns.length > 0
        ? data.columns
        : ['Class / Grade', 'Admission Fee (One Time)', 'Tuition Fee (Monthly)', 'Annual Charges (One Time)', 'Total Annual (Est.)']
    ).slice(0, 5);
    const rawRows = (Array.isArray(data?.rows) ? data.rows : []).slice(0, 15);
    
    // Normalize any rows that might be objects or malformed, capping at 5 columns & 15 rows
    const safeRows: string[][] = rawRows.map((r: any) => {
      if (Array.isArray(r)) {
        const sliced = r.slice(0, rawCols.length).map((c: any) => String(c ?? ''));
        while (sliced.length < rawCols.length) sliced.push('');
        return sliced;
      }
      if (typeof r === 'object' && r !== null) {
        const mapped = rawCols.map((colName) => {
          const cn = colName.toLowerCase();
          if (cn.includes('grade') || cn.includes('class')) return r.grade || r.class || r.className || r.name || '';
          if (cn.includes('month')) return r.monthly || r.monthlyFee || '';
          if (cn.includes('qtr') || cn.includes('quarter')) return r.quarterly || r.quarterlyFee || '';
          if (cn.includes('annual') || cn.includes('year') || cn.includes('total')) return r.annual || r.totalAnnual || r.annualizedFee || '';
          return r[colName] || '';
        });
        if (mapped.every(v => !v)) {
          return Object.values(r).slice(0, rawCols.length).map(v => String(v ?? ''));
        }
        return mapped;
      }
      return Array(rawCols.length).fill('');
    });

    const safeData = {
      columns: rawCols,
      rows: safeRows
    };

    const maxCols = 5;
    const maxRows = 15;
    const lastColIdx = safeData.columns.length - 1;

    const removeCol = (colIdx: number) => {
      if (safeData.columns.length <= 2) return;
      setData({
        columns: safeData.columns.filter((_, i) => i !== colIdx),
        rows: safeData.rows.map(r => r.filter((_, i) => i !== colIdx))
      });
    };

    const addRow = () => {
      if (safeData.rows.length >= maxRows) return;
      setData({
        columns: safeData.columns,
        rows: [...safeData.rows, Array(safeData.columns.length).fill('')]
      });
    };

    const removeRow = (rowIdx: number) => {
      if (safeData.rows.length <= 1) return;
      setData({
        columns: safeData.columns,
        rows: safeData.rows.filter((_, i) => i !== rowIdx)
      });
    };

    const recalcRowTotal = (rowArray: string[], cols: string[]) => {
      const last = cols.length - 1;
      let sum = 0;
      let hasNumbers = false;
      for (let i = 1; i < last; i++) {
        const cVal = (rowArray[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
        const header = (cols[i] || '').toLowerCase();
        const num = parseFloat(cVal);
        if (!isNaN(num) && num > 0) {
          hasNumbers = true;
          let factor = 1;
          if (header.includes('month')) factor = 12;
          else if (header.includes('qtr') || header.includes('quarter')) factor = 4;
          else if (header.includes('half')) factor = 2;
          else if (header.includes('one') || header.includes('annual') || header.includes('year')) factor = 1;
          sum += num * factor;
        }
      }
      if (cols[last].toLowerCase().includes('total')) {
        rowArray[last] = hasNumbers ? `₹${Math.round(sum).toLocaleString('en-IN')}` : '';
      }
      return rowArray;
    };

    const updateCol = (colIdx: number, val: string) => {
      const newCols = [...safeData.columns];
      newCols[colIdx] = val;
      const newRows = safeData.rows.map(r => recalcRowTotal([...r], newCols));
      setData({ columns: newCols, rows: newRows });
    };

    const updateCell = (rowIdx: number, colIdx: number, val: string) => {
      const newRows = [...safeData.rows];
      newRows[rowIdx] = [...newRows[rowIdx]];
      newRows[rowIdx][colIdx] = val;
      if (colIdx < safeData.columns.length - 1) {
        newRows[rowIdx] = recalcRowTotal(newRows[rowIdx], safeData.columns);
      }
      setData({ columns: safeData.columns, rows: newRows });
    };

    const addColBeforeTotal = () => {
      if (safeData.columns.length >= maxCols) return;
      const newCols = [...safeData.columns];
      newCols.splice(lastColIdx, 0, 'New Charge (Monthly)');
      const newRows = safeData.rows.map(r => {
        const newRow = [...r];
        newRow.splice(lastColIdx, 0, '');
        return recalcRowTotal(newRow, newCols);
      });
      setData({ columns: newCols, rows: newRows });
    };

    return (
      <div className="bg-white rounded-2xl border border-[#E8EAED] shadow-xs overflow-hidden w-full">
        <div className="px-4 sm:px-5 py-3 border-b border-[#E8EAED] flex flex-wrap justify-between items-center gap-2 bg-[#F8FAFC]">
          <div>
            <h3 className="text-[16px] sm:text-lg font-bold font-['Montserrat',sans-serif] text-[#003C6E] flex items-center gap-2 m-0">
              <span className="w-2 h-2 rounded-full bg-[#006FCC] shrink-0" />
              <span>{title}</span>
            </h3>
            <p className="text-[12px] text-[#5F6368] mt-0.5 sm:hidden m-0">
              Swipe horizontally to view all {safeData.columns.length} columns →
            </p>
          </div>
          {isEditMode ? (
            <span className="text-[11px] text-[#006FCC] font-bold bg-white px-3 py-1 rounded-full border border-[#D0E4F5]">
              Cols: {safeData.columns.length}/{maxCols} • Rows: {safeData.rows.length}/{maxRows}
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[#EDF5FA] border border-[#D0E4F5] text-[#006FCC] text-[11px] font-bold">
              Academic Session Fee Schedule
            </span>
          )}
        </div>

        {/* Billing Frequency Rule Note (Edit Mode Only) */}
        {isEditMode && (
          <div className="px-4 sm:px-5 py-2.5 bg-[#EDF5FA]/60 border-b border-[#E8EAED] flex flex-col lg:flex-row lg:items-center justify-between gap-2 text-xs">
            <span className="text-[#3C4043] font-medium text-[11.5px]">
              Auto-total hint: add <strong className="text-[#003C6E]">(Monthly)</strong>, <strong className="text-[#003C6E]">(Qtr)</strong>, <strong className="text-[#003C6E]">(Half Yearly)</strong>, or <strong className="text-[#003C6E]">(One Time)</strong> in column headers.
            </span>
          </div>
        )}

        <div className="overflow-x-auto w-full [touch-action:pan-x_pan-y]">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E8EAED]">
                {safeData.columns.map((col, cIdx) => (
                  <th
                    key={cIdx}
                    className={`px-3.5 py-3 border-r last:border-r-0 border-[#E8EAED] text-[12px] font-bold uppercase tracking-wider text-[#003C6E] ${
                      cIdx === 0 ? 'min-w-[140px]' : cIdx === lastColIdx ? 'min-w-[130px] bg-emerald-50/50 text-emerald-800' : 'min-w-[130px]'
                    }`}
                  >
                    {isEditMode ? (
                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-md pr-1 focus-within:border-[#006FCC]">
                        <input
                          type="text"
                          value={col}
                          onChange={e => updateCol(cIdx, e.target.value)}
                          className="w-full bg-transparent px-2 py-1 text-xs font-bold text-[#003C6E] focus:outline-none min-w-0"
                        />
                        {cIdx !== lastColIdx && safeData.columns.length > 2 && (
                          <button type="button" onClick={() => removeCol(cIdx)} className="text-red-400 hover:text-red-600 p-0.5 shrink-0 cursor-pointer">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="block leading-snug" title={col}>{col}</span>
                    )}
                  </th>
                ))}
                {isEditMode && (
                  <th className="px-2 py-2.5 bg-[#F8FAFC] w-12 text-center align-middle">
                    <button
                      type="button"
                      onClick={addColBeforeTotal}
                      disabled={safeData.columns.length >= maxCols}
                      className="text-[#006FCC] hover:text-[#003C6E] disabled:opacity-35 p-1 rounded-md hover:bg-blue-50 transition-colors inline-block cursor-pointer"
                      title={safeData.columns.length >= maxCols ? 'Max 5 columns allowed' : 'Add column before Total'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {safeData.rows.map((row, rIdx) => {
                const breakdownParts: string[] = [];
                for (let i = 1; i < safeData.columns.length - 1; i++) {
                  const cVal = (row[i] || '').replace(/₹/g, '').replace(/,/g, '').trim();
                  const header = safeData.columns[i];
                  const num = parseFloat(cVal);
                  if (!isNaN(num) && num > 0) {
                    const lh = header.toLowerCase();
                    let factor = 1, unit = '×1';
                    if (lh.includes('month')) { factor = 12; unit = '×12'; }
                    else if (lh.includes('qtr') || lh.includes('quarter')) { factor = 4; unit = '×4'; }
                    else if (lh.includes('half')) { factor = 2; unit = '×2'; }
                    else if (lh.includes('one') || lh.includes('annual') || lh.includes('year')) { factor = 1; unit = '×1'; }
                    breakdownParts.push(`${header.split('(')[0].trim()} ${unit} = ₹${(num * factor).toLocaleString('en-IN')}`);
                  }
                }
                const breakdownTitle = breakdownParts.length > 0 ? breakdownParts.join('\n') : '';

                return (
                  <tr key={rIdx} className="hover:bg-[#F8FAFC] odd:bg-white even:bg-[#FAFBFD] border-b border-[#E8EAED] last:border-b-0 group transition-colors">
                    {row.map((cell, cIdx) => {
                      const isTotal = cIdx === safeData.columns.length - 1;
                      const isFirst = cIdx === 0;
                      return (
                        <td
                          key={cIdx}
                          className={`px-3.5 py-3 border-r last:border-r-0 border-[#E8EAED] text-[13.5px] sm:text-[14px] ${
                            isTotal
                              ? 'bg-emerald-50/50 font-semibold text-emerald-800'
                              : isFirst
                              ? 'font-semibold text-[#202124]'
                              : 'text-[#3C4043]'
                          }`}
                        >
                          {isTotal ? (
                            <span
                              className="block whitespace-nowrap"
                              title={breakdownTitle || 'Enter fees to auto-calculate'}
                            >
                              {cell || '—'}
                            </span>
                          ) : isEditMode ? (
                            <input
                              type="text"
                              value={cell}
                              onChange={e => updateCell(rIdx, cIdx, e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-md focus:border-[#006FCC] px-2.5 py-1.5 text-[13px] text-[#202124] focus:outline-none"
                              placeholder={cIdx === 0 ? 'Class name' : '₹0'}
                            />
                          ) : (
                            <span className="block whitespace-nowrap">{cell || '—'}</span>
                          )}
                        </td>
                      );
                    })}
                    {isEditMode && (
                      <td className="px-2 py-2 text-center align-middle w-10">
                        <button
                          type="button"
                          onClick={() => removeRow(rIdx)}
                          className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors inline-block cursor-pointer"
                          title="Delete row"
                        >
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

        {isEditMode && (
          <div className="px-4 py-2.5 border-t border-[#E8EAED] bg-[#F8FAFC] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#5F6368]">Max {maxCols} columns &amp; {maxRows} rows</span>
            <button
              type="button"
              onClick={addRow}
              disabled={safeData.rows.length >= maxRows}
              className="px-3.5 py-1.5 bg-[#006FCC] text-white text-xs font-bold rounded-lg hover:bg-[#005399] disabled:opacity-45 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row ({safeData.rows.length}/{maxRows})
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="fee-structure" className="py-6 sm:py-10 bg-[#EEF2F6] border-b border-[#DCE2E8] relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#EDF5FA]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Header (Unified Tab Header Design matching Academics & Reviews) */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-1 rounded-full mb-2.5 shadow-2xs font-['Montserrat',sans-serif]">
            <span className="w-1.5 h-1.5 bg-[#006FCC] rounded-full inline-block animate-pulse" />
            <span>ADMISSIONS &amp; COMPOSITE FEES</span>
          </div>

          <h2 className="text-[20px] sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-snug">
            Transparent Fee Structure &amp;
            <span className="text-[#006FCC] block mt-0.5">Admissions Guidelines</span>
          </h2>

          <p className="mt-2 text-[#5F6368] font-['Lato',var(--font-roboto),Roboto,sans-serif] font-normal max-w-2xl mx-auto !text-[15px] !leading-[1.68] m-0">
            Review detailed grade-wise tuition schedules, transparent fee breakdowns, and direct contact channels for {displayName}.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:gap-7 w-full">
          
          {/* 1. Verified Official Fee & Admissions Links (if available) */}
          {((templateData?.officialFeeUrl || templateData?.fees?.official_fee_page_url || initialProfileData?.officialFeeUrl) ||
            (templateData?.officialAdmissionsUrl || templateData?.admissions?.official_admissions_page_url || initialProfileData?.officialAdmissionsUrl)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(templateData?.officialFeeUrl || templateData?.fees?.official_fee_page_url || initialProfileData?.officialFeeUrl) && (
                <div className="bg-white border border-[#E8EAED] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#006FCC]/40 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 border border-[#D0E4F5]">
                      <FileText className="w-5 h-5 text-[#006FCC]" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold font-['Montserrat',sans-serif] text-[#003C6E] m-0">Official School Fee Structure Page</h4>
                      <p className="text-xs sm:text-sm text-[#5F6368] font-normal mt-0.5 m-0">
                        Direct link to official fee schedule on school website
                      </p>
                    </div>
                  </div>
                  <a
                    href={templateData?.officialFeeUrl || templateData?.fees?.official_fee_page_url || initialProfileData?.officialFeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-semibold font-['Montserrat',sans-serif] transition-all shrink-0 shadow-xs"
                  >
                    <span>Official Fee Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {(templateData?.officialAdmissionsUrl || templateData?.admissions?.official_admissions_page_url || initialProfileData?.officialAdmissionsUrl) && (
                <div className="bg-white border border-[#E8EAED] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#006FCC]/40 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EDF5FA] text-[#006FCC] flex items-center justify-center shrink-0 border border-[#D0E4F5]">
                      <ShieldCheck className="w-5 h-5 text-[#006FCC]" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold font-['Montserrat',sans-serif] text-[#003C6E] m-0">Official School Admissions Portal</h4>
                      <p className="text-xs sm:text-sm text-[#5F6368] font-normal mt-0.5 m-0">
                        Direct link to official admissions &amp; registration page
                      </p>
                    </div>
                  </div>
                  <a
                    href={templateData?.officialAdmissionsUrl || templateData?.admissions?.official_admissions_page_url || initialProfileData?.officialAdmissionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#006FCC] hover:bg-[#005399] text-white text-xs font-semibold font-['Montserrat',sans-serif] transition-all shrink-0 shadow-xs"
                  >
                    <span>Official Admissions Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 2. ONE Unified Horizontally Scrollable Fee Table (Max 5 Columns × 15 Rows) */}
          {renderDynamicTable('Class-Wise Fee Structure', feesTable, setFeesTable)}

          {/* 3. Additional / Extra Fees & Charges Section (Dedicated Spaced Card) */}
          {(() => {
            const legacyExtraRows = (extraChargesTable?.rows || [])
              .filter((r) => Array.isArray(r) && r.some((cell) => String(cell || '').trim() !== ''))
              .map((r) => `- **${r[0] || 'Extra Charge'}:** ${r[1] ? `**${r[1]}**` : ''}${r[2] ? ` — ${r[2]}` : ''}`);

            const defaultExtraFeesNotes = [
              `** Additional & Extra Fees (Optional / Other Charges)`,
              `In addition to the regular class-wise fee table above, ${displayName} outlines applicable optional or conditional charges below:`,
              ``,
              ...(legacyExtraRows.length > 0
                ? legacyExtraRows
                : [
                    `- **Transport / School Bus Fee:** Route and distance-based monthly charges (optional).`,
                    `- **Registration & Admission Processing:** ==One-time charge== applicable at initial enrollment.`,
                    `- **Books, Stationery & Uniform:** Charged separately as per the prescribed academic list.`,
                    `- **Science, Computer & Activity Charges:** Applicable for practical laboratory and co-curricular workshops.`,
                  ]),
            ].join('\n');

            const savedExtraNotes =
              templateCtx?.getContent?.('additional_fees_notes', '') ||
              templateData?.contentOverrides?.additional_fees_notes ||
              initialProfileData?.contentOverrides?.additional_fees_notes ||
              '';

            const effectiveExtraNotes = savedExtraNotes.trim() ? savedExtraNotes : defaultExtraFeesNotes;

            return (
              <div className="bg-white rounded-2xl border border-[#E8EAED] shadow-xs p-4 sm:p-6 w-full">
                {isEditMode ? (
                  <EditorialMarkupEditor
                    title="Additional & Extra Fees Editor"
                    initialValue={effectiveExtraNotes}
                    defaultValue={defaultExtraFeesNotes}
                    rows={8}
                    onSave={(val) => {
                      if (templateCtx?.updateContentOverride) {
                        templateCtx.updateContentOverride('additional_fees_notes', val);
                      }
                    }}
                  />
                ) : (
                  <EditorialMarkupRenderer content={effectiveExtraNotes} />
                )}
              </div>
            );
          })()}

          {/* 4. TERMS, DUE DATES & INSTITUTIONAL GUIDELINES (Dedicated Compact Card) */}
          <div className="bg-white rounded-2xl border border-[#E8EAED] shadow-xs overflow-hidden w-full">
            <div className="px-4 sm:px-6 py-3.5 border-b border-[#E8EAED] flex flex-wrap justify-between items-center gap-3 bg-[#F8FAFC]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EDF5FA] border border-[#D0E4F5] text-[#006FCC] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="!text-[15px] sm:!text-base !font-bold font-['Montserrat',sans-serif] text-[#003C6E] m-0 leading-snug">
                    Important Terms, Due Dates &amp; Guidelines
                  </h3>
                  <p className="text-[11.5px] text-[#5F6368] font-normal mt-0.5 m-0">
                    Fee cycles, payment dates, late fine policy, refund rules &amp; institutional guidelines
                  </p>
                </div>
              </div>

              {isEditMode && (
                <button
                  onClick={addTermItem}
                  className="px-3.5 py-1.5 bg-[#005689] text-white text-xs font-bold rounded-full hover:bg-[#003c6e] flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Instruction / Rule</span>
                </button>
              )}
            </div>

            {/* Terms Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {termsList.map((item) => {
                const theme = getCategoryTheme(item.category);
                const IconComp = theme.icon;

                return (
                  <div
                    key={item.id}
                    className="bg-[#FAFBFD] border border-[#E8EAED] rounded-xl p-3.5 sm:p-4 hover:border-[#006FCC]/35 transition-all relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Header: Tag + Actions */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {isEditMode ? (
                          <select
                            value={item.category}
                            onChange={(e) => updateTermItem(item.id, 'category', e.target.value)}
                            className="text-[11px] font-semibold border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-800 focus:outline-none focus:border-[#005689]"
                          >
                            <option value="Due Date">Due Date</option>
                            <option value="Payment Modes">Payment Modes</option>
                            <option value="Refund & TC">Refund &amp; TC</option>
                            <option value="Concessions">Concessions</option>
                            <option value="Important Note">Important Note</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${theme.bg} ${theme.text} ${theme.border} uppercase tracking-wider`}>
                            <IconComp className="w-3 h-3" />
                            <span>{item.category}</span>
                          </span>
                        )}

                        {isEditMode && (
                          <button
                            onClick={() => removeTermItem(item.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Title */}
                      {isEditMode ? (
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateTermItem(item.id, 'title', e.target.value)}
                          placeholder="Rule / Due Date Title"
                          className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-md px-2 py-1 mb-2 focus:border-[#005689] focus:outline-none"
                        />
                      ) : (
                        <h4 className="!text-[13.5px] sm:!text-sm !font-semibold text-[#202124] mb-1.5 leading-snug m-0">
                          {item.title}
                        </h4>
                      )}

                      {/* Description */}
                      {isEditMode ? (
                        <textarea
                          value={item.description}
                          onChange={(e) => updateTermItem(item.id, 'description', e.target.value)}
                          placeholder="Enter specific terms, dates, penalty amounts or guidelines..."
                          rows={3}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded-md p-2 focus:border-[#005689] focus:outline-none resize-none font-normal"
                        />
                      ) : (
                        <p className="!text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#3C4043] !leading-[1.68] font-normal m-0">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Admissions Inquiry Desk */}
          <div className="w-full bg-white border border-[#E8EAED] rounded-2xl p-5 sm:p-6 text-center max-w-4xl mx-auto shadow-xs">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#006FCC] bg-[#EDF5FA] border border-[#D0E4F5] px-2.5 py-1 rounded-full mb-2.5">
              <span>ADMISSION HELPDESK</span>
            </div>
            <h3 className="text-[18px] sm:text-2xl font-bold font-['Montserrat',sans-serif] text-[#003C6E] mb-2">
              Have Questions About Admissions or Fees?
            </h3>
            <p className="!text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#5F6368] mb-5 max-w-xl mx-auto !leading-[1.68] font-normal">
              Our admissions team is available to assist you with registration guidelines, documentation, and enrollment procedures for {displayName}.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {isEditMode ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                  <div className="flex-1 text-left">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Admissions Phone</label>
                    <input 
                      type="text" 
                      value={admissionPhone} 
                      onChange={e => setAdmissionPhone && setAdmissionPhone(e.target.value)} 
                      placeholder="+91 98765 43210"
                      className="w-full text-xs font-extrabold text-slate-800 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 focus:border-[#005689] focus:outline-none"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Admissions Email</label>
                    <input 
                      type="text" 
                      value={admissionEmail} 
                      onChange={e => setAdmissionEmail && setAdmissionEmail(e.target.value)} 
                      placeholder="admissions@school.org"
                      className="w-full text-xs font-extrabold text-slate-800 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2.5 focus:border-[#005689] focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {admissionPhone ? (
                    <a
                      href={`tel:${admissionPhone}`}
                      className="inline-flex items-center gap-2.5 text-xs font-black text-white bg-[#005689] hover:bg-[#004168] px-7 py-3.5 rounded-full transition-all shadow-[0_6px_20px_rgba(0,86,137,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Admissions: {admissionPhone}</span>
                    </a>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3 rounded-full opacity-60 cursor-not-allowed">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>Admissions Phone Not Available</span>
                    </button>
                  )}

                  {admissionEmail ? (
                    <a
                      href={`mailto:${admissionEmail}`}
                      className="inline-flex items-center gap-2.5 text-xs font-black text-[#005689] bg-[#EDF5FA] border border-[#D6EDFF] hover:bg-[#DDF0FD] px-7 py-3.5 rounded-full transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email Admissions: {admissionEmail}</span>
                    </a>
                  ) : (
                    <button disabled className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-6 py-3 rounded-full opacity-60 cursor-not-allowed">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>Admissions Email Not Available</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
