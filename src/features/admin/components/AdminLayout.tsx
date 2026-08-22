'use client';

import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from '../contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminLoginScreen from './AdminLoginScreen';
import SuperAdminDashboard from './modules/SuperAdminDashboard';
import HrAdminModule from './modules/HrAdminModule';
import SchoolAdminModule from './modules/SchoolAdminModule';
import RecruitmentAdminModule from './modules/RecruitmentAdminModule';
import ScienceAdminModule from './modules/ScienceAdminModule';
import ProjectokartAdminModule from './modules/ProjectokartAdminModule';
import InventoryAdminModule from './modules/InventoryAdminModule';
import ProgramsAdminModule from './modules/ProgramsAdminModule';
import RndAdminModule from './modules/RndAdminModule';
import ContentAdminModule from './modules/ContentAdminModule';
import DailyWorkHistoryModule from './modules/DailyWorkHistoryModule';

const AdminContentRouter: React.FC<{ onToggleMobileMenu: () => void }> = ({ onToggleMobileMenu }) => {
  const { activeModule, currentRole } = useAdminAuth();

  const renderModule = () => {
    switch (activeModule) {
      case 'overview':
        return <SuperAdminDashboard />;
      case 'audit_logs':
        return <DailyWorkHistoryModule />;
      case 'hr_careers':
        return <HrAdminModule />;
      case 'schools_institutions':
        return <SchoolAdminModule />;
      case 'teaching_recruitment':
        return <RecruitmentAdminModule />;
      case 'science_simulations':
        return <ScienceAdminModule />;
      case 'projectokart_inventions':
        return <ProjectokartAdminModule />;
      case 'inventory_materials':
        return <InventoryAdminModule />;
      case 'programs_events':
        return <ProgramsAdminModule />;
      case 'research_rnd':
        return <RndAdminModule />;
      case 'content_homepage':
        return <ContentAdminModule />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full bg-[#f8fafc] overflow-x-hidden">
      <AdminHeader onToggleMobileMenu={onToggleMobileMenu} />
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
        {renderModule()}
      </main>
    </div>
  );
};

const AdminPortalRoot: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Loading CSEEL Governance Portal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginScreen />;
  }

  return (
    <div className="min-h-screen flex bg-slate-950 font-sans text-slate-900 selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <AdminContentRouter onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <AdminAuthProvider>
      <AdminPortalRoot />
    </AdminAuthProvider>
  );
};

export default AdminLayout;
