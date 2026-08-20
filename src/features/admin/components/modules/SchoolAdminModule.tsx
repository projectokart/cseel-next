'use client';

import React, { useState } from 'react';
import { Building2, Search, CheckCircle2, ShieldCheck, MapPin, Beaker, Plus, Star, X } from 'lucide-react';
import { ALL_ORGANIZATIONS, OrganizationItem } from '@/lib/eduNetworkData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const SchoolAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [orgs, setOrgs] = useState<OrganizationItem[]>(ALL_ORGANIZATIONS.slice(0, 15));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const filteredOrgs = orgs.filter((o) => {
    const matchSearch = !searchQuery || o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = selectedCity === 'All' || o.city.toLowerCase().includes(selectedCity.toLowerCase());
    return matchSearch && matchCity;
  });

  const toggleVerification = (id: string) => {
    setOrgs(orgs.map(o => {
      if (o.id === id) {
        const next = !o.verified;
        addAuditLog('TOGGLED_SCHOOL_VERIFICATION', 'schools_institutions', `Changed verified status to ${next} for ${o.name}`);
        return { ...o, verified: next };
      }
      return o;
    }));
  };

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-black text-blue-700">
            <Building2 className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL DIRECTORY & LAB AUDIT DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Schools, Colleges & STEM Lab Verification
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Audit 104+ schools displayed on <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-bold">/edu-network</code>. Verify composite science laboratories, fee structures, NEP-2020 compliance, and KYC authenticity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-4 py-2 bg-blue-50 text-blue-800 font-black text-xs rounded-2xl border border-blue-200">
            104 Total Schools in DB
          </span>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search school name, city or affiliation board..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold outline-none text-gray-800"
          />
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none w-full sm:w-auto"
        >
          <option value="All">All Cities</option>
          <option value="Delhi">Delhi / NCR</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bhubaneswar">Bhubaneswar</option>
        </select>
      </div>

      {/* ── SCHOOLS AUDIT LIST ── */}
      <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-700 uppercase font-black text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Institution Name</th>
                <th className="px-4 py-3">Location & Board</th>
                <th className="px-4 py-3">Monthly Fee</th>
                <th className="px-4 py-3">STEM Lab Assets</th>
                <th className="px-4 py-3">CSEEL KYC Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
              {filteredOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={org.logo} alt={org.name} className="w-9 h-9 rounded-xl object-cover border border-blue-200 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 truncate max-w-[200px]">{org.name}</p>
                        <p className="text-[10px] text-gray-500">{org.type} • {org.admissionStatus}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-600" />{org.city}, {org.state}</p>
                    <p className="text-[10px] text-gray-500">{org.board} Affiliated</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {org.monthlyFees || '₹5,000/mo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Beaker className="w-3.5 h-3.5 text-purple-600" />
                      <span className="font-bold">{org.stemLabsCount ? `${org.stemLabsCount} Verified Labs` : '3 Labs Under Audit'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleVerification(org.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
                        org.verified
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{org.verified ? 'CSEEL Verified' : 'Pending Review'}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`/edu-network/org/${org.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors inline-block"
                    >
                      View Live Page
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminModule;
