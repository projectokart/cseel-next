'use client';

import React, { useState } from 'react';
import { Package, Plus, DollarSign, CheckCircle2, AlertTriangle, Search, Filter } from 'lucide-react';
import { ALL_MATERIALS } from '@/lib/materialsData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const InventoryAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [materialList, setMaterialList] = useState(ALL_MATERIALS);

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-black text-teal-700">
            <Package className="w-3.5 h-3.5" />
            <span>LAB MATERIALS & SUPPLY CHAIN INVENTORY DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Lab Kits, Instruments & STEM Inventory
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Control the 9+ Hardware Kits & Instruments on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/materials</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/materials/[slug]</code>. Manage stock levels, wholesale quotes, and institutional supply orders.
          </p>
        </div>

        <button
          onClick={() => addAuditLog('ADDED_INVENTORY_ITEM', 'inventory_materials', 'Initiated new lab equipment catalog entry')}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lab Material</span>
        </button>
      </div>

      {/* ── INVENTORY GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materialList.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:border-teal-400 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {item.category}
                </span>
                <span className="text-xs font-black text-emerald-700">₹{item.price.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>In Stock & Ready</span>
              </span>
              <a
                href={`/materials/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-xl transition-colors"
              >
                View Product
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryAdminModule;
