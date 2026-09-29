import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PropertySearch } from './components/PropertySearch';
import { UnitDetailModal } from './components/UnitDetailModal';
import { BookingModal } from './components/BookingModal';
import { ContractView } from './components/ContractView';
import { BillingPaymentView } from './components/BillingPaymentView';
import { MaintenanceView } from './components/MaintenanceView';
import { DashboardView } from './components/DashboardView';

import {
  CURRENT_USER,
  MOCK_UNITS,
  MOCK_BOOKINGS,
  MOCK_CONTRACTS,
  MOCK_INVOICES,
  MOCK_TICKETS
} from './data/mockData';

import {
  User,
  UserRole,
  CondoUnit,
  ViewingBooking,
  LeaseContract,
  Invoice,
  MaintenanceTicket
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);

  const [units, setUnits] = useState<CondoUnit[]>(MOCK_UNITS);
  const [bookings, setBookings] = useState<ViewingBooking[]>(MOCK_BOOKINGS);
  const [contracts, setContracts] = useState<LeaseContract[]>(MOCK_CONTRACTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(MOCK_TICKETS);

  // Modals state
  const [selectedUnitForDetail, setSelectedUnitForDetail] = useState<CondoUnit | null>(null);
  const [selectedUnitForBooking, setSelectedUnitForBooking] = useState<CondoUnit | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name: role === 'OWNER' ? 'คุณสมชาย ธนกิจ (Owner)' : role === 'ADMIN' ? 'เจ้าหน้าที่นิติบุคคล' : 'กฤษณะ วงศ์ประเสริฐ'
    }));
  };

  // Handlers
  const handleCreateBooking = (newBookingData: Omit<ViewingBooking, 'id' | 'createdAt'>) => {
    const newBooking: ViewingBooking = {
      ...newBookingData,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleConfirmBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b))
    );
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'REJECTED' } : b))
    );
  };

  const handleSignContract = (contractId: string, signature: string) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: 'ACTIVE',
              tenantSignature: signature,
              signedAt: `${new Date().toLocaleString('th-TH')} (Digital Signature Verified)`
            }
          : c
      )
    );
  };

  const handlePayInvoice = (invoiceId: string, method: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'PAID',
              paidAt: new Date().toLocaleString('th-TH'),
              paymentMethod: method,
              receiptNumber: `RCP-202610-${Math.floor(1000 + Math.random() * 9000)}`
            }
          : inv
      )
    );
  };

  const handleCreateTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      createdAt: new Date().toLocaleString('th-TH'),
      updatedAt: new Date().toLocaleString('th-TH')
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleApplyLeaseFromUnit = (unit: CondoUnit) => {
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

    setContracts((prev) => [newContract, ...prev]);
    setActiveTab('contract');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Prompt',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setUserRole={handleRoleChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'search' && (
          <PropertySearch
            units={units}
            onSelectUnit={(unit) => setSelectedUnitForDetail(unit)}
            onBookViewing={(unit) => setSelectedUnitForBooking(unit)}
          />
        )}

        {activeTab === 'contract' && (
          <ContractView
            contracts={contracts}
            currentUser={currentUser}
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

        {activeTab === 'dashboard' && (
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
            <strong>CondoRent Hub</strong> • แพลตฟอร์มบริหารเช่าคอนโดออนไลน์ Phase 1 (Cloudflare Edge Ready)
          </div>
          <div className="text-slate-400">
            ระบบความปลอดภัยตามมาตรฐาน PDPA & E-Signature Act
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UnitDetailModal
        unit={selectedUnitForDetail}
        onClose={() => setSelectedUnitForDetail(null)}
        onBookViewing={(unit) => {
          setSelectedUnitForDetail(null);
          setSelectedUnitForBooking(unit);
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
    </div>
  );
}

export default App;
