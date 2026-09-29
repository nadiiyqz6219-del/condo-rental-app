import React, { useState } from 'react';
import { CreditCard, QrCode, CheckCircle2, AlertCircle, Download, Clock, DollarSign, Receipt, Sparkles } from 'lucide-react';
import { Invoice } from '../types';

interface BillingPaymentViewProps {
  invoices: Invoice[];
  onPayInvoice: (invoiceId: string, method: string) => void;
}

export const BillingPaymentView: React.FC<BillingPaymentViewProps> = ({
  invoices,
  onPayInvoice
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
    invoices.find((i) => i.status === 'UNPAID') || invoices[0] || null
  );
  const [isPaying, setIsPaying] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<Invoice | null>(null);

  const handleSimulatePayment = () => {
    if (!selectedInvoice) return;
    setIsPaying(true);

    setTimeout(() => {
      onPayInvoice(selectedInvoice.id, 'PromptPay QR (Omise)');
      setIsPaying(false);
      setActiveReceipt({
        ...selectedInvoice,
        status: 'PAID',
        paidAt: new Date().toLocaleString('th-TH'),
        receiptNumber: `RCP-202610-${Math.floor(1000 + Math.random() * 9000)}`
      });
      setShowReceipt(true);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            ระบบคำนวณและตัดยอดอัตโนมัติ (Automated Invoicing)
          </div>
          <h1 className="text-2xl font-bold text-slate-800">ใบแจ้งหนี้และการชำระเงิน (Billing & Payments)</h1>
          <p className="text-xs text-slate-500">จัดการค่าเช่า ค่าน้ำ ค่าไฟ พร้อมออกใบเสร็จรับเงินทันที</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">รอบบิลปัจจุบัน:</span>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-xs border border-blue-200">
            ตุลาคม 2026
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Invoices List (Left Column) */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>รายการบิลทั้งหมด ({invoices.length})</span>
          </h3>

          <div className="space-y-3">
            {invoices.map((inv) => {
              const isSelected = selectedInvoice?.id === inv.id;
              const isPaid = inv.status === 'PAID';

              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{inv.monthYear}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isPaid ? '● ชำระแล้ว' : '● รอชำระ'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 line-clamp-1 mb-2">{inv.unitTitle}</div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">ยอดชำระสุทธิ</span>
                    <span className="text-base font-bold text-slate-800">฿{inv.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Detail & Payment Gateway Simulator (Right 2 Cols) */}
        {selectedInvoice ? (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">เลขที่ใบแจ้งหนี้: {selectedInvoice.invoiceNumber}</span>
                <h2 className="text-xl font-bold text-slate-800">ใบแจ้งหนี้ค่าเช่าและสาธารณูปโภค</h2>
                <div className="text-xs text-slate-500 mt-0.5">ประจำเดือน {selectedInvoice.monthYear}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">กำหนดชำระภายใน</div>
                <div className="text-sm font-bold text-red-600 flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedInvoice.dueDate}
                </div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">รายละเอียดค่าใช้จ่าย</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">รายการ</th>
                      <th className="py-2.5 px-4 font-semibold text-center">หน่วยที่ใช้</th>
                      <th className="py-2.5 px-4 font-semibold text-center">ราคา/หน่วย</th>
                      <th className="py-2.5 px-4 font-semibold text-right">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-4 font-medium">ค่าเช่าห้องพักประจำเดือน</td>
                      <td className="py-2.5 px-4 text-center">-</td>
                      <td className="py-2.5 px-4 text-center">-</td>
                      <td className="py-2.5 px-4 text-right font-medium">฿{selectedInvoice.rentAmount.toLocaleString()}</td>
                    </tr>
                    {selectedInvoice.waterTotal > 0 && (
                      <tr>
                        <td className="py-2.5 px-4 font-medium">ค่าน้ำประปา</td>
                        <td className="py-2.5 px-4 text-center">{selectedInvoice.waterUnit} ยูนิต</td>
                        <td className="py-2.5 px-4 text-center">฿{selectedInvoice.waterRate}</td>
                        <td className="py-2.5 px-4 text-right font-medium">฿{selectedInvoice.waterTotal.toLocaleString()}</td>
                      </tr>
                    )}
                    {selectedInvoice.electricityTotal > 0 && (
                      <tr>
                        <td className="py-2.5 px-4 font-medium">ค่าไฟฟ้า</td>
                        <td className="py-2.5 px-4 text-center">{selectedInvoice.electricityUnit} ยูนิต</td>
                        <td className="py-2.5 px-4 text-center">฿{selectedInvoice.electricityRate}</td>
                        <td className="py-2.5 px-4 text-right font-medium">฿{selectedInvoice.electricityTotal.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50/80 font-bold border-t border-slate-200 text-slate-900">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right text-sm">ยอดรวมที่ต้องชำระทั้งสิ้น:</td>
                      <td className="py-3 px-4 text-right text-base text-blue-600">฿{selectedInvoice.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Section / Receipt Status */}
            {selectedInvoice.status === 'PAID' ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-950">ชำระเงินเรียบร้อยแล้ว</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    ชำระเมื่อ {selectedInvoice.paidAt} ผ่าน {selectedInvoice.paymentMethod || 'PromptPay'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveReceipt(selectedInvoice);
                    setShowReceipt(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>ดูใบเสร็จรับเงิน (E-Receipt)</span>
                </button>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-sm">สแกนชำระด้วย PromptPay QR Code</h3>
                  </div>
                  <span className="text-[11px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
                    Dynamic QR Code
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2">
                  {/* Mock PromptPay QR */}
                  <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-md text-center">
                    <div className="w-40 h-40 bg-slate-900 flex flex-col items-center justify-center text-white rounded-lg p-2 relative overflow-hidden">
                      <div className="text-[9px] font-bold tracking-widest text-blue-300 mb-1">PROMPTPAY</div>
                      {/* Fake QR Pattern */}
                      <div className="w-28 h-28 bg-white p-1 rounded grid grid-cols-4 gap-1">
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-white"></div>
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-slate-900 rounded-sm"></div>
                        <div className="bg-white"></div>
                      </div>
                      <div className="text-[8px] text-slate-300 mt-1">ยอด: ฿{selectedInvoice.totalAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Payment Simulator Button */}
                  <div className="space-y-3 max-w-xs text-center sm:text-left">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      เปิดแอปพลิเคชันธนาคารใดก็ได้ แล้วสแกนเพื่อโอนเงิน ระบบจะตรวจสอบยอดเงินและออกใบเสร็จแบบ Real-time
                    </p>
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isPaying}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isPaying ? (
                        <span>กำลังยืนยันยอดเงินจากธนาคาร...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>จำลองการโอนเงินสำเร็จ (Test Pay)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : null}

      </div>

      {/* E-Receipt Modal */}
      {showReceipt && activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center border-b border-slate-200 pb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">ใบเสร็จรับเงินอิเล็กทรอนิกส์ (E-Receipt)</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                เลขที่: {activeReceipt.receiptNumber || 'RCP-202610-8812'}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl">
              <div className="flex justify-between">
                <span>ได้รับเงินจาก:</span>
                <span className="font-semibold text-slate-800">{activeReceipt.tenantName}</span>
              </div>
              <div className="flex justify-between">
                <span>ห้องชุด:</span>
                <span className="font-semibold text-slate-800">{activeReceipt.unitTitle}</span>
              </div>
              <div className="flex justify-between">
                <span>รอบบิล:</span>
                <span className="font-semibold text-slate-800">{activeReceipt.monthYear}</span>
              </div>
              <div className="flex justify-between">
                <span>ช่องทางชำระ:</span>
                <span className="font-semibold text-slate-800">PromptPay QR</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-800">ยอดเงินที่ได้รับ:</span>
                <span className="font-bold text-emerald-600">฿{activeReceipt.totalAmount.toLocaleString()} บาท</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={() => alert('ดาวน์โหลดใบเสร็จ PDF เรียบร้อย')}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>โหลด PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
