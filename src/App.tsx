import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PropertySearch } from './components/PropertySearch';
import { UnitDetailModal } from './components/UnitDetailModal';
import { BookingModal } from './components/BookingModal';
import { ContractView } from './components/ContractView';
import { BillingPaymentView } from './components/BillingPaymentView';
import { MaintenanceView } from './components/MaintenanceView';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { ChatbotWidget } from './components/ChatbotWidget';

import { db } from './services/db';

import {
  User,
  CondoUnit,
  ViewingBooking,
  LeaseContract,
  Invoice,
  MaintenanceTicket
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('search');
  
  // Persistent DB State
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.getCurrentUser());
  const [units, setUnits] = useState<CondoUnit[]>(() => db.getUnits());
  const [bookings, setBookings] = useState<ViewingBooking[]>(() => db.getBookings());
  const [contracts, setContracts] = useState<LeaseContract[]>(() => db.getContracts());
  const [invoices, setInvoices] = useState<Invoice[]>(() => db.getInvoices());
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => db.getTickets());

  // Modals state
  const [selectedUnitForDetail, setSelectedUnitForDetail] = useState<CondoUnit | null>(null);
  const [selectedUnitForBooking, setSelectedUnitForBooking] = useState<CondoUnit | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Check Google OAuth redirect callback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('id_token='))) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      if (accessToken) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then((res) => res.json())
          .then((profile) => {
            if (profile && profile.email) {
              const res = db.loginWithGoogle({
                name: profile.name || profile.given_name || 'Google User',
                email: profile.email,
                avatar: profile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                role: 'TENANT'
              });
              if (res.success && res.user) {
                setCurrentUser(res.user);
                window.history.replaceState(null, '', window.location.pathname);
              }
            }
          })
          .catch((err) => console.error('Error fetching Google profile from token redirect', err));
      }
    }
  }, []);

  // Sync state helpers
  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    db.setCurrentUser(user);
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
  };

  const handleResetDb = () => {
    if (confirm('คุณต้องการรีเซ็ตฐานข้อมูลเป็นค่าเริ่มต้น (Reset Seed Data) หรือไม่?')) {
      db.resetDatabase();
      setCurrentUser(db.getCurrentUser());
      setUnits(db.getUnits());
      setBookings(db.getBookings());
      setContracts(db.getContracts());
      setInvoices(db.getInvoices());
      setTickets(db.getTickets());
    }
  };

  // Handlers with DB persistence
  const handleCreateBooking = (newBookingData: Omit<ViewingBooking, 'id' | 'createdAt'>) => {
    const newBooking: ViewingBooking = {
      ...newBookingData,
      id: `bk-${Date.now()}`,
      tenantId: currentUser ? currentUser.id : 'usr_tenant_guest',
      tenantName: currentUser ? currentUser.name : 'ผู้เข้าชมทั่วไป',
      tenantPhone: currentUser ? currentUser.phone : '08X-XXX-XXXX',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    db.saveBookings(updated);
  };

  const handleConfirmBooking = (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'CONFIRMED' as const } : b));
    setBookings(updated);
    db.saveBookings(updated);
  };

  const handleRejectBooking = (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'REJECTED' as const } : b));
    setBookings(updated);
    db.saveBookings(updated);
  };

  const handleSignContract = (contractId: string, signature: string) => {
    const updated = contracts.map((c) =>
      c.id === contractId
        ? {
            ...c,
            status: 'ACTIVE' as const,
            tenantSignature: signature,
            signedAt: `${new Date().toLocaleString('th-TH')} (Digital Signature Verified)`
          }
        : c
    );
    setContracts(updated);
    db.saveContracts(updated);
  };

  const handlePayInvoice = (invoiceId: string, method: string) => {
    const updated = invoices.map((inv) =>
      inv.id === invoiceId
        ? {
            ...inv,
            status: 'PAID' as const,
            paidAt: new Date().toLocaleString('th-TH'),
            paymentMethod: method,
            receiptNumber: `RCP-202610-${Math.floor(1000 + Math.random() * 9000)}`
          }
        : inv
    );
    setInvoices(updated);
    db.saveInvoices(updated);
  };

  const handleCreateTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      tenantName: currentUser ? currentUser.name : 'กฤษณะ วงศ์ประเสริฐ',
      createdAt: new Date().toLocaleString('th-TH'),
      updatedAt: new Date().toLocaleString('th-TH')
    };
    const updated = [newTicket, ...tickets];
    setTickets(updated);
    db.saveTickets(updated);
  };

  const handleApplyLeaseFromUnit = (unit: CondoUnit) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }

    const newContract: LeaseContract = {
      id: `ctr-${Date.now()}`,
      contractNumber: `CTR-BK-2026/${Math.floor(100 + Math.random() * 900)}`,
      unitId: unit.id,
      unitTitle: unit.title,
      unitLocation: `${unit.projectName}, ${unit.location}`,
      tenantId: currentUser.id,
      tenantName: currentUser.name,
      tenantIdCard: currentUser.nationalIdMasked || '1-1002-XXXXX-89-1',
      ownerId: unit.ownerId,
      ownerName: unit.ownerName,
      startDate: '2026-11-01',
      endDate: '2027-10-31',
      monthlyRent: unit.monthlyRent,
      securityDeposit: unit.depositAmount,
      advancePayment: unit.advanceRentAmount,
      status: 'PENDING_TENANT_SIGN',
      ownerSignature: unit.ownerName.split(' ')[0],
      terms: [
        'สัญญาเช่ามีกำหนดระยะเวลา 1 ปี เริ่มตั้งแต่วันที่ 1 พ.ย. 2026 ถึง 31 ต.ค. 2027',
        `ผู้เช่าตกลงชำระค่าเช่ารายเดือน ฿${unit.monthlyRent.toLocaleString()} บาท ภายในวันที่ 5 ของทุกเดือน`,
        `เงินประกันสัญญาจำนวน ฿${unit.depositAmount.toLocaleString()} บาท จะได้รับคืนเมื่อตรวจรับห้องเรียบร้อย`,
        'ห้ามสูบบุหรี่และรักษากฎระเบียบนิติบุคคลอย่างเคร่งครัด'
      ]
    };

    const updated = [newContract, ...contracts];
    setContracts(updated);
    db.saveContracts(updated);
    setActiveTab('contract');
  };

  // Fallback default user for subviews if currentUser is null
  const activeUserForViews: User = currentUser || {
    id: 'guest',
    name: 'ผู้เยี่ยมชม (Guest)',
    email: 'guest@condorent.com',
    phone: '08X-XXX-XXXX',
    role: 'TENANT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isKycVerified: false
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Prompt',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onResetDb={handleResetDb}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'search' && (
          <PropertySearch
            units={units}
            onSelectUnit={(unit) => setSelectedUnitForDetail(unit)}
            onBookViewing={(unit) => {
              if (!currentUser) {
                handleOpenAuth('login');
              } else {
                setSelectedUnitForBooking(unit);
              }
            }}
          />
        )}

        {activeTab === 'contract' && (
          <ContractView
            contracts={contracts}
            currentUser={activeUserForViews}
            onSignContract={handleSignContract}
          />
        )}

        {activeTab === 'billing' && (
          <BillingPaymentView
            invoices={invoices}
            onPayInvoice={handlePayInvoice}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceView
            tickets={tickets}
            onSubmitTicket={handleCreateTicket}
          />
        )}

        {activeTab === 'dashboard' && currentUser?.role === 'ADMIN' && (
          <DashboardView
            units={units}
            bookings={bookings}
            contracts={contracts}
            invoices={invoices}
            tickets={tickets}
            onConfirmBooking={handleConfirmBooking}
            onRejectBooking={handleRejectBooking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>CondoRent Hub</strong> • แพลตฟอร์มบริหารเช่าคอนโดออนไลน์ (Cloudflare Pages + Persistent DB)
          </div>
          <div className="text-slate-400">
            ระบบความปลอดภัยตามมาตรฐาน PDPA & E-Signature Act
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <UnitDetailModal
        unit={selectedUnitForDetail}
        onClose={() => setSelectedUnitForDetail(null)}
        onBookViewing={(unit) => {
          setSelectedUnitForDetail(null);
          if (!currentUser) {
            handleOpenAuth('login');
          } else {
            setSelectedUnitForBooking(unit);
          }
        }}
        onApplyLease={(unit) => {
          setSelectedUnitForDetail(null);
          handleApplyLeaseFromUnit(unit);
        }}
      />

      <BookingModal
        unit={selectedUnitForBooking}
        onClose={() => setSelectedUnitForBooking(null)}
        onSubmitBooking={handleCreateBooking}
        existingBookings={bookings}
      />

      {/* Floating AI Chatbot Assistant */}
      <ChatbotWidget
        units={units}
        onSelectUnit={(unit) => setSelectedUnitForDetail(unit)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}

export default App;
