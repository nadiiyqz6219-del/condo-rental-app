import React from 'react';
import { Building2, Search, FileText, CreditCard, Wrench, LayoutDashboard, ShieldCheck, User } from 'lucide-react';
import { UserRole, User as UserType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserType;
  setUserRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setUserRole
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CondoRent Hub
              </span>
              <span className="text-xs block text-slate-500 font-normal">ระบบบริหารเช่าคอนโดออนไลน์</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>ค้นหาห้องพัก</span>
            </button>

            <button
              onClick={() => setActiveTab('contract')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'contract'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>สัญญาเช่า E-Sign</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'billing'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>ชำระเงิน / บิล</span>
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'maintenance'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>แจ้งซ่อมบำรุง</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard สรุป</span>
            </button>
          </nav>

          {/* User Profile & Role Switcher */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
              <span className="text-slate-500 px-2">สิทธิ์:</span>
              <select
                value={currentUser.role}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-white border-0 text-slate-800 rounded px-2 py-1 font-semibold text-xs shadow-sm focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="TENANT">ผู้เช่า (Tenant)</option>
                <option value="OWNER">เจ้าของห้อง (Owner)</option>
                <option value="ADMIN">นิติ/Admin</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  {currentUser.name}
                  {currentUser.isKycVerified && (
                    <span title="KYC ยืนยันตัวตนแล้ว">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">{currentUser.phone}</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
