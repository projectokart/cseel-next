'use client';

import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PincodeDeliveryChecker() {
  const [pincode, setPincode] = useState('');
  const [estimate, setEstimate] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      alert('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      // Simulated delivery calculation
      const days = pincode.startsWith('11') || pincode.startsWith('56') || pincode.startsWith('40') ? '2 Days (Express Available)' : '3-4 Business Days';
      setEstimate(`Delivering to ${pincode}: Free Standard Delivery by ${days}`);
    }, 400);
  };

  return (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 select-none">
      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
        <Truck className="w-4 h-4 text-teal-600" />
        <span>Check Delivery & Institutional Lead Time</span>
      </div>

      <form onSubmit={checkDelivery} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-Digit PIN Code"
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border rounded-xl font-mono text-xs outline-none focus:border-teal-500"
          />
        </div>
        <button
          type="submit"
          disabled={isChecking}
          className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
        >
          {isChecking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {estimate && (
        <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{estimate}</span>
        </p>
      )}
    </div>
  );
}
