import React, { useState } from 'react';
import { FileText, ShieldCheck, CheckCircle2, Lock, Download, AlertTriangle, Key } from 'lucide-react';
import { LeaseContract, User } from '../types';

interface ContractViewProps {
  contracts: LeaseContract[];
  currentUser: User;
  onSignContract: (contractId: string, signature: string) => void;
}

export const ContractView: React.FC<ContractViewProps> = ({
  contracts,
  currentUser,
  onSignContract
}) => {
  const [selectedContract, setSelectedContract] = useState<LeaseContract | null>(
    contracts[0] || null
  );
  const [signatureName, setSignatureName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSigningSuccess, setIsSigningSuccess] = useState(false);

  const handleStartSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName.trim()) return;
    setShowOtpModal(true);
  };

  const handleConfirmOtp = () => {
    if (otpCode !== '1234' && otpCode.length < 4) {
      alert('กรุณากรอกรหัส OTP 4 หลัก (ใช้ 1234 สำหรับการทดสอบ)');
      return;
    }

    if (selectedContract) {
      onSignContract(selectedContract.id, signatureName);
      setIsSigningSuccess(true);
      setShowOtpModal(false);
      setTimeout(() => {
        setIsSigningSuccess(false);
      }, 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            มาตรฐาน E-Signature พ.ร.บ.ธุรกรรมอิเล็กทรอนิกส์
          </div>
          <h1 className="text-2xl font-bold text-slate-800">สัญญาเช่าอิเล็กทรอนิกส์ (Digital Lease Agreement)</h1>
          <p className="text-xs text-slate-500">ตรวจสอบเงื่อนไขสัญญา ลงลายมือชื่อดิจิทัล พร้อม Digital Timestamp</p>
        </div>

        {/* Contract Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">เลือกสัญญา:</span>
          <select
            value={selectedContract?.id || ''}
            onChange={(e) => {
              const c = contracts.find((item) => item.id === e.target.value);
              if (c) setSelectedContract(c);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.contractNumber} ({c.unitTitle})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedContract ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Contract Document Preview (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Watermark / Badge */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">เลขที่สัญญา: {selectedContract.contractNumber}</span>
                <h2 className="text-xl font-bold text-slate-800">สัญญาเช่าห้องชุดพักอาศัย</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedContract.status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}>
                {selectedContract.status === 'ACTIVE' ? '● มีผลบังคับใช้ (Active)' : '● รอการลงนาม (Pending)'}
              </span>
            </div>

            {/* Parties Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <div className="font-semibold text-slate-800">ผู้ให้เช่า (เจ้าของห้อง):</div>
                <div className="text-slate-600">{selectedContract.ownerName}</div>
                <div className="text-slate-400">สถานะ: ยืนยันกรรมสิทธิ์โฉนดแล้ว</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-slate-800">ผู้เช่า:</div>
                <div className="text-slate-600">{selectedContract.tenantName}</div>
                <div className="text-slate-400">เลขบัตร ปชช: {selectedContract.tenantIdCard}</div>
              </div>
            </div>

            {/* Key Terms & Financials */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">สาระสำคัญของสัญญา</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100">
                  <span className="text-slate-500">ค่าเช่ารายเดือน:</span>
                  <p className="text-sm font-bold text-blue-600">฿{selectedContract.monthlyRent.toLocaleString()} /เดือน</p>
                </div>
                <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100">
                  <span className="text-slate-500">เงินประกัน (2 เดือน):</span>
                  <p className="text-sm font-bold text-slate-800">฿{selectedContract.securityDeposit.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100">
                  <span className="text-slate-500">ระยะเวลาสัญญา:</span>
                  <p className="text-xs font-semibold text-slate-800">{selectedContract.startDate} ถึง {selectedContract.endDate}</p>
                </div>
              </div>
            </div>

            {/* Clauses */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 text-sm">ข้อตกลงและเงื่อนไข (Terms & Conditions)</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                {selectedContract.terms.map((term, index) => (
                  <li key={index} className="pl-1">{term}</li>
                ))}
              </ol>
            </div>

            {/* Signatures Display */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl text-center space-y-2">
                <div className="text-xs text-slate-500">ลายมือชื่อผู้ให้เช่า</div>
                <div className="h-12 flex items-center justify-center font-serif text-lg italic text-blue-700 font-bold border-b border-dashed border-slate-300">
                  {selectedContract.ownerSignature || '(รอลงนาม)'}
                </div>
                <div className="text-[11px] text-slate-600">{selectedContract.ownerName}</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-center space-y-2">
                <div className="text-xs text-slate-500">ลายมือชื่อผู้เช่า</div>
                <div className="h-12 flex items-center justify-center font-serif text-lg italic text-blue-700 font-bold border-b border-dashed border-slate-300">
                  {selectedContract.tenantSignature || '(รอลงนาม)'}
                </div>
                <div className="text-[11px] text-slate-600">{selectedContract.tenantName}</div>
              </div>
            </div>

            {selectedContract.signedAt && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Audit Record:</strong> ประทับตรารับรองเวลาดิจิทัลเมื่อ {selectedContract.signedAt}
                </span>
              </div>
            )}
          </div>

          {/* Action & Signature Pad Sidebar (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                การลงนามดิจิทัล (E-Sign)
              </h3>

              {selectedContract.status === 'ACTIVE' ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">สัญญามีผลสมบูรณ์แล้ว</h4>
                    <p className="text-xs text-slate-500 mt-1">ทั้งสองฝ่ายได้ลงนามและยืนยันตัวตนเรียบร้อย</p>
                  </div>
                  <button
                    onClick={() => alert('ดาวน์โหลดสัญญา PDF พร้อม Digital Certificate สำเร็จ')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลดสัญญา PDF (Signed)</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleStartSign} className="space-y-4">
                  <div className="text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>การลงนามถือเป็นนิติกรรมสัญญาที่มีผลผูกพันทางกฎหมาย กรุณาพิมพ์ชื่อ-นามสกุลจริง</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      พิมพ์ชื่อ-นามสกุล เพื่อลงลายมือชื่อดิจิทัล
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น กฤษณะ วงศ์ประเสริฐ"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>ยืนยันตัวตนด้วย SMS OTP เพื่อลงนาม</span>
                  </button>
                </form>
              )}
            </div>

            {/* Contract Guidelines Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-600" />
                สิทธิประโยชน์สัญญาเช่าออนไลน์
              </h4>
              <ul className="space-y-1.5 text-indigo-900/80 list-disc list-inside">
                <li>แจ้งเตือนวันครบกำหนดชำระค่าเช่าอัตโนมัติ</li>
                <li>บันทึกสภาพห้องก่อนและหลังพัก (Inspection Checklist)</li>
                <li>รับประกันการคืนเงินมัดจำผ่านระบบที่เป็นธรรม</li>
              </ul>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">ไม่มีสัญญาเช่าในระบบ</div>
      )}

      {/* OTP Confirmation Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">ยืนยันรหัส SMS OTP</h3>
              <p className="text-xs text-slate-500 mt-1">
                ระบบได้ส่งรหัส OTP 4 หลัก ไปยังหมายเลข <strong>{currentUser.phone}</strong> (กรอก <strong>1234</strong> สำหรับ Demo)
              </p>
            </div>

            <div>
              <input
                type="text"
                maxLength={4}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="1234"
                className="w-full text-center text-2xl tracking-widest font-mono py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmOtp}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md"
              >
                ยืนยันลงนาม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {isSigningSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <div className="font-bold text-sm">ลงนามสัญญาสำเร็จ!</div>
            <div className="text-xs text-emerald-100">สัญญาเปิดใช้งานแล้วและระบบได้ออกบิลรอบแรกให้เรียบร้อย</div>
          </div>
        </div>
      )}
    </div>
  );
};
