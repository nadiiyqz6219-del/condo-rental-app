import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { MaintenanceTicket, MaintenanceCategory } from '../types';

interface MaintenanceViewProps {
  tickets: MaintenanceTicket[];
  onSubmitTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const CATEGORY_NAMES: Record<MaintenanceCategory, string> = {
  AIR_CONDITIONER: 'เครื่องปรับอากาศ (แอร์)',
  PLUMBING: 'ระบบประปา / ห้องน้ำ',
  ELECTRICAL: 'ระบบไฟฟ้า / แสงสว่าง',
  APPLIANCES: 'เครื่องใช้ไฟฟ้า',
  FURNITURE: 'เฟอร์นิเจอร์ / บานประตู',
  OTHER: 'อื่นๆ'
};

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  tickets,
  onSubmitTicket
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('AIR_CONDITIONER');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmitTicket({
      unitId: 'unit-101',
      unitTitle: 'Ideo Q Sukhumvit 36 (#280)',
      tenantName: 'กฤษณะ วงศ์ประเสริฐ',
      category,
      title,
      description,
      status: 'PENDING'
    });

    setTitle('');
    setDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ระบบประสานงานนิติและช่างอาคาร (Service Desk)
          </div>
          <h1 className="text-2xl font-bold text-slate-800">แจ้งซ่อมแซมและบำรุงรักษา (Maintenance)</h1>
          <p className="text-xs text-slate-500">ติดตามสถานะงานซ่อม และประสานงานช่างเข้าตรวจเช็คในห้องพัก</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>เปิดใบแจ้งซ่อมใหม่ (New Ticket)</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {CATEGORY_NAMES[ticket.category]}
                </span>
                <h3 className="font-bold text-slate-800 text-base mt-2">{ticket.title}</h3>
                <div className="text-xs text-slate-400 mt-0.5">{ticket.unitTitle} • แจ้งเมื่อ {ticket.createdAt}</div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                  ticket.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : ticket.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {ticket.status === 'RESOLVED' && '● ซ่อมเสร็จสิ้น'}
                {ticket.status === 'IN_PROGRESS' && '● กำลังดำเนินการ'}
                {ticket.status === 'PENDING' && '● รับเรื่องแล้ว'}
              </span>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {ticket.description}
            </p>

            {ticket.technicianNote && (
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>บันทึกจากช่าง/นิติ:</strong> {ticket.technicianNote}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                แจ้งปัญหา / ซ่อมบำรุง
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่งานซ่อม</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MaintenanceCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AIR_CONDITIONER">เครื่องปรับอากาศ (แอร์)</option>
                  <option value="PLUMBING">ระบบประปา / ก๊อกน้ำ / ท่อตัน</option>
                  <option value="ELECTRICAL">ระบบไฟฟ้า / สวิตช์ / ปลั๊กไฟ</option>
                  <option value="APPLIANCES">เครื่องใช้ไฟฟ้า (ตู้เย็น/ไมโครเวฟ)</option>
                  <option value="FURNITURE">เฟอร์นิเจอร์ / ประตู / ลูกบิด</option>
                  <option value="OTHER">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">หัวข้อปัญหา</label>
                <input
                  type="text"
                  placeholder="เช่น ก๊อกน้ำอ่างล้างจานรั่วซึม"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">รายละเอียดปัญหา</label>
                <textarea
                  rows={3}
                  placeholder="อธิบายอาการที่เกิดขึ้น เวลาที่พบปัญหา และเวลาที่สะดวกให้ช่างเข้าตรวจ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md"
                >
                  ส่งแจ้งซ่อม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
