'use client';

import React, { useState, useRef } from 'react';
import { MaterialImportRow } from '../../types/materialTypes';
import { ImportExportService } from '../../services/importExportService';
import {
  X, Upload, Download, FileSpreadsheet, Check,
  AlertTriangle, CheckCircle2, FileText
} from 'lucide-react';

interface MaterialImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: MaterialImportRow[]) => Promise<number>;
}

export default function MaterialImportModal({
  isOpen,
  onClose,
  onImport,
}: MaterialImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<MaterialImportRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const rows = ImportExportService.parseCsv(text);
        if (rows.length === 0) {
          setErrorMsg('No valid rows found in CSV. Please verify column headers against the template.');
        }
        setParsedRows(rows);
      } catch (err: any) {
        setErrorMsg('Failed to parse file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);
    setErrorMsg('');
    try {
      await onImport(parsedRows);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Bulk Import Lab Materials & Kits
              </h3>
              <p className="text-[11px] text-slate-500">
                Upload CSV or Excel spreadsheets to add or update multiple lab items simultaneously
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Template Download Step */}
          <div className="p-4 bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-bold text-teal-900 dark:text-teal-200">Step 1: Download Standard Template</p>
              <p className="text-[11px] text-teal-700/80 dark:text-teal-400">
                Use our pre-configured CSV spreadsheet with standard columns (Name, Category, Price, Stock, Image_URL).
              </p>
            </div>

            <button
              type="button"
              onClick={() => ImportExportService.downloadSampleTemplate()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
          >
            <Upload className="w-8 h-8 text-teal-600" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                {fileName ? fileName : 'Click to select CSV spreadsheet file'}
              </p>
              <p className="text-[11px] text-slate-400">Supports .csv, .txt spreadsheets</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Preview Parsed Items ({parsedRows.length})</span>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for import
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 sticky top-0 text-[10px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="p-2 pl-3">Item Name</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">Price (₹)</th>
                      <th className="p-2">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {parsedRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-2 pl-3 font-sans font-bold text-slate-800 truncate max-w-[200px]">{row.name}</td>
                        <td className="p-2 text-slate-600">{row.category}</td>
                        <td className="p-2 font-bold text-emerald-700">₹{row.price}</td>
                        <td className="p-2 text-slate-600">{row.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 10 && (
                <p className="text-[10px] text-slate-400 text-center font-medium">
                  + {parsedRows.length - 10} more items will be imported
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={parsedRows.length === 0 || isProcessing}
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Importing...' : `Import ${parsedRows.length} Items`}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
