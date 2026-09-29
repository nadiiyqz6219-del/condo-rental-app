import React from 'react';
import { LayoutDashboard, TrendingUp, Users, Home, CheckCircle2, Clock, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { CondoUnit, ViewingBooking, LeaseContract, Invoice, MaintenanceTicket } from '../types';

interface DashboardViewProps {
  units: CondoUnit[];
  bookings: ViewingBooking[];
  contracts: LeaseContract[];
  invoices: Invoice[];
  tickets: MaintenanceTicket[];
  onConfirmBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  units,
  bookings,
  contracts,
  invoices,
  tickets,
  onConfirmBooking,
  onRejectBooking
}) => {
  const totalRevenue = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingAmount = invoices
    .filter((i) => i.status === 'UNPAID')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const availableUnitsCount = units.filter((u) => u.status === 'AVAILABLE').length;
  const activeContractsCount = contracts.filter((c) => c.status === 'ACTIVE').length;
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">แดชบอร์ดสรุปภาพรวม (Management Dashboard)</h1>
          <p className="text-xs text-slate-500">รายงานตัวชี้วัด สถานะสัญญา นัดหมาย และรายการชำระเงินแบบ Real-time</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
          ● ข้อมูลออนไลน์
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">ยอดรายรับสะสม</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">฿{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">จากบิลที่ชำระสำเร็จในระบบ</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">ยอดรอชำระรอบนี้</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">฿{pendingAmount.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">กำหนดชำระภายใน 5 ต.ค.</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">ห้องว่าง / สัญญาใช้งาน</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{availableUnitsCount} / {units.length}</div>
          <div className="text-[11px] text-slate-400">มีสัญญา Active {activeContractsCount} ฉบับ</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">คำขอนัดหมายรอยืนยัน</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600">{pendingBookings.length} คำขอ</div>
          <div className="text-[11px] text-slate-400">งานซ่อมรอดำเนินการ {tickets.filter(t => t.status === 'PENDING').length} เรื่อง</div>
        </div>
      </div>

      {/* Viewing Bookings Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            คำขอนัดหมายดูห้องพัก (Appointment Requests)
          </h3>
          <span className="text-xs text-slate-500">ทั้งหมด {bookings.length} รายการ</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">ห้องชุด</th>
                <th className="py-3 px-4 font-semibold">ผู้ขอเข้าดู</th>
                <th className="py-3 px-4 font-semibold">วัน-เวลานัด</th>
                <th className="py-3 px-4 font-semibold">หมายเหตุ</th>
                <th className="py-3 px-4 font-semibold text-center">สถานะ</th>
                <th className="py-3 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-900">{b.unitTitle}</td>
                  <td className="py-3 px-4">
                    <div>{b.tenantName}</div>
                    <div className="text-[11px] text-slate-400">{b.tenantPhone}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{b.bookingDate} ({b.bookingTime})</td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{b.notes || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : b.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {b.status === 'CONFIRMED' && 'ยืนยันแล้ว'}
                      {b.status === 'PENDING' && 'รอยืนยัน'}
                      {b.status === 'REJECTED' && 'ปฏิเสธ'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {b.status === 'PENDING' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onConfirmBooking(b.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => onRejectBooking(b.id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          ปฏิเสธ
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
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
