import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { CondoUnit, ViewingBooking } from '../types';

interface BookingModalProps {
  unit: CondoUnit | null;
  onClose: () => void;
  onSubmitBooking: (booking: Omit<ViewingBooking, 'id' | 'createdAt'>) => void;
  existingBookings: ViewingBooking[];
}

const AVAILABLE_TIMES = [
  '10:00 น.',
  '11:30 น.',
  '14:00 น.',
  '15:30 น.',
  '17:00 น.'
];

export const BookingModal: React.FC<BookingModalProps> = ({
  unit,
  onClose,
  onSubmitBooking,
  existingBookings
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-06');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!unit) return null;

  // Check which timeslots on selectedDate are already booked for this unit
  const isTimeBooked = (time: string) => {
    return existingBookings.some(
      (b) => b.unitId === unit.id && b.bookingDate === selectedDate && b.bookingTime === time && b.status !== 'REJECTED'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;

    onSubmitBooking({
      unitId: unit.id,
      unitTitle: unit.title,
      tenantId: 'usr_tenant_01',
      tenantName: 'กฤษณะ วงศ์ประเสริฐ',
      tenantPhone: '081-234-5678',
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      status: 'PENDING',
      notes
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <Calendar className="w-5 h-5" />
            <span>นัดหมายเข้าดูห้องพัก</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">ส่งคำขอนัดหมายเรียบร้อย!</h3>
            <p className="text-sm text-slate-500">
              ระบบได้ส่งคำขอไปยังเจ้าของห้องแล้ว และจะแจ้งเตือนเมื่อได้รับการยืนยัน
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="text-xs text-blue-600 font-medium">ห้องที่เลือก:</div>
              <div className="text-sm font-bold text-slate-800 line-clamp-1">{unit.title}</div>
              <div className="text-xs text-slate-500">{unit.projectName} • {unit.monthlyRent.toLocaleString()} บ./ด.</div>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลือกวันที่ต้องการดูห้อง
              </label>
              <input
                type="date"
                value={selectedDate}
                min="2026-10-01"
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                เลือกรอบเวลาที่สะดวก
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_TIMES.map((time) => {
                  const booked = isTimeBooked(time);
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      type="button"
                      key={time}
                      disabled={booked}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        booked
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {time}
                      {booked && <span className="block text-[10px] text-red-500">ติดจอง</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมายเหตุเพิ่มเติม (ถ้ามี)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="เช่น ขอดูทิศระเบียงเป็นพิเศษ หรือต้องการนัดหมายผ่านวิดีโอคอล"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!selectedTime}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-xl text-sm shadow-md transition-colors cursor-pointer"
              >
                ยืนยันการนัดหมาย
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
