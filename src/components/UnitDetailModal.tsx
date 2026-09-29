import React from 'react';
import { X, MapPin, Train, Bed, Bath, Maximize2, ShieldCheck, CheckCircle2, User, Phone, Calendar } from 'lucide-react';
import { CondoUnit } from '../types';

interface UnitDetailModalProps {
  unit: CondoUnit | null;
  onClose: () => void;
  onBookViewing: (unit: CondoUnit) => void;
  onApplyLease: (unit: CondoUnit) => void;
}

export const UnitDetailModal: React.FC<UnitDetailModalProps> = ({
  unit,
  onClose,
  onBookViewing,
  onApplyLease
}) => {
  if (!unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Close */}
        <div className="relative h-72 bg-slate-900">
          <img
            src={unit.images[0]}
            alt={unit.title}
            className="w-full h-full object-cover opacity-90"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="text-white">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/90 backdrop-blur-md inline-block mb-2">
                {unit.projectName}
              </span>
              <h2 className="text-2xl font-bold">{unit.title}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-200 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{unit.location}</span>
                <span>•</span>
                <Train className="w-4 h-4 text-blue-300" />
                <span>{unit.station} ({unit.stationDistance})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
              <div className="text-xs text-slate-500">ค่าเช่ารายเดือน</div>
              <div className="text-lg font-bold text-blue-600">฿{unit.monthlyRent.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xs text-slate-500">เงินประกันสัญญา (2ด.)</div>
              <div className="text-base font-semibold text-slate-700">฿{unit.depositAmount.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xs text-slate-500">ขนาด / ชั้น</div>
              <div className="text-base font-semibold text-slate-700">{unit.sizeSqM} ตร.ม. (ชั้น {unit.floor})</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div className="text-xs text-slate-500">ผังห้อง</div>
              <div className="text-base font-semibold text-slate-700">{unit.bedrooms} นอน / {unit.bathrooms} น้ำ</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">รายละเอียดห้องพัก</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {unit.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">สิ่งอำนวยความสะดวกในห้องและโครงการ</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {unit.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner / Agent Verified Info */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {unit.ownerName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                  {unit.ownerName}
                  <span title="กรรมสิทธิ์ห้องผ่านการตรวจสอบแล้ว">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {unit.ownerPhone}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-medium">
                ยืนยันเอกสารโฉนดแล้ว
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onBookViewing(unit);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>นัดหมายเข้าดูห้องจริง</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onApplyLease(unit);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>ขอทำสัญญาเช่าออนไลน์ (E-Lease)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
