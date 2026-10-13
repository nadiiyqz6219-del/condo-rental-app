import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Home,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  HelpCircle,
  Building2,
  Minimize2
} from 'lucide-react';
import { CondoUnit } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  recommendedUnits?: CondoUnit[];
  quickReplies?: string[];
}

interface ChatbotWidgetProps {
  units: CondoUnit[];
  onSelectUnit: (unit: CondoUnit) => void;
  onNavigateTab: (tab: string) => void;
}

const INITIAL_QUICK_REPLIES = [
  '🔍 แนะนำห้องว่างยอดนิยม',
  '💰 เงินประกันและค่าแรกเข้าคิดยังไง?',
  '🐶 มีห้องที่เลี้ยงสัตว์ได้ไหม?',
  '🛠️ แอร์เสีย/ท่อตัน แจ้งซ่อมยังไง?',
  '📝 ขั้นตอนการทำสัญญาเช่า E-Sign'
];

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  units,
  onSelectUnit,
  onNavigateTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'สวัสดีครับ! ยินดีต้อนรับสู่ CondoRent Hub 🏢\n\nผมคือ **น้องคอนโด (AI Assistant)** ผู้ช่วยที่จะช่วยคุณค้นหาห้องพัก ตอบคำถามเรื่องสัญญาเช่า และขั้นตอนการแจ้งซ่อม มีอะไรให้ผมช่วยไหมครับ?',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      quickReplies: INITIAL_QUICK_REPLIES
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Knowledge base logic & intent matching
  const generateBotReply = (userQuery: string): { text: string; recommendedUnits?: CondoUnit[]; quickReplies?: string[] } => {
    const q = userQuery.toLowerCase().trim();

    // 1. Pet-Friendly Query
    if (q.includes('เลี้ยงสัตว์') || q.includes('สัตว์เลี้ยง') || q.includes('หมา') || q.includes('แมว') || q.includes('pet')) {
      const petFriendlyUnits = units.filter(
        (u) =>
          u.amenities.some((a) => a.toLowerCase().includes('pet')) ||
          u.description.toLowerCase().includes('เลี้ยงสัตว์') ||
          u.description.toLowerCase().includes('pet')
      );

      if (petFriendlyUnits.length > 0) {
        return {
          text: `พบโครงการที่สามารถเลี้ยงสัตว์ได้ (${petFriendlyUnits.length} ห้อง) สำหรับคนรักสัตว์โดยเฉพาะครับ:`,
          recommendedUnits: petFriendlyUnits,
          quickReplies: ['🔍 แนะนำห้องอื่นๆ', '💰 สอบถามเงินประกัน']
        };
      }
      return {
        text: 'ปัจจุบันห้องพักส่วนใหญ่เป็นพื้นที่ปลอดสัตว์เลี้ยงตามกฎนิติบุคคล แต่จะมีห้องประเภท Pet Friendly บางโครงการ รบกวนตรวจสอบรายละเอียดของแต่ละห้องได้เลยครับ',
        quickReplies: ['🔍 แนะนำห้องว่างยอดนิยม', '📝 ขั้นตอนการทำสัญญา']
      };
    }

    // 2. Budget / Price Inquiry (e.g. "ไม่เกิน 20000", "งบ 30000")
    const priceMatch = q.match(/(\d{4,6})/);
    if ((q.includes('งบ') || q.includes('ราคา') || q.includes('ไม่เกิน') || q.includes('บาท')) && priceMatch) {
      const targetBudget = parseInt(priceMatch[1], 10);
      const matchedUnits = units.filter((u) => u.monthlyRent <= targetBudget && u.status === 'AVAILABLE');

      if (matchedUnits.length > 0) {
        return {
          text: `พบคอนโดราคาไม่เกิน ฿${targetBudget.toLocaleString()} บาท/เดือน ทั้งหมด ${matchedUnits.length} ห้อง พร้อมเข้าอยู่ทันทีครับ:`,
          recommendedUnits: matchedUnits,
          quickReplies: ['📅 นัดหมายดูห้องพัก', '💰 เงินมัดจำคิดยังไง?']
        };
      } else {
        return {
          text: `ไม่พบคอนโดว่างในงบ ฿${targetBudget.toLocaleString()} บาท/เดือน ในขณะนี้ครับ คอนโดราคาเริ่มต้นของเราอยู่ที่ประมาณ ฿16,000 บาท/เดือน ลองเพิ่มงบประมาณดูไหมครับ?`,
          quickReplies: ['🔍 ดูห้องพักทั้งหมด', '📍 คอนโดใกล้ BTS ทองหล่อ']
        };
      }
    }

    // 3. Location / Train Station Inquiry (BTS, MRT, ทองหล่อ, อโศก, พระราม 9, อารีย์)
    if (q.includes('ทองหล่อ') || q.includes('อารีย์') || q.includes('พระราม 9') || q.includes('อโศก') || q.includes('bts') || q.includes('mrt') || q.includes('รถไฟฟ้า')) {
      let matchedUnits: CondoUnit[] = [];
      let locName = 'ใกล้รถไฟฟ้า';

      if (q.includes('ทองหล่อ')) {
        matchedUnits = units.filter((u) => u.station.includes('ทองหล่อ') || u.district.includes('ทองหล่อ') || u.location.includes('ทองหล่อ'));
        locName = 'ย่าน BTS ทองหล่อ';
      } else if (q.includes('พระราม 9') || q.includes('อโศก')) {
        matchedUnits = units.filter((u) => u.station.includes('พระราม 9') || u.location.includes('พระราม 9') || u.location.includes('อโศก'));
        locName = 'ย่าน MRT พระราม 9 / อโศก';
      } else if (q.includes('อารีย์')) {
        matchedUnits = units.filter((u) => u.station.includes('อารีย์') || u.location.includes('อารีย์'));
        locName = 'ย่าน BTS อารีย์';
      } else {
        matchedUnits = units.filter((u) => u.status === 'AVAILABLE');
      }

      if (matchedUnits.length > 0) {
        return {
          text: `นี่คือรายการคอนโดใน ${locName} ที่เดินทางสะดวก ใกล้สถานีรถไฟฟ้าครับ:`,
          recommendedUnits: matchedUnits,
          quickReplies: ['💰 เงินประกันคิดยังไง?', '📅 นัดหมายเข้าดูห้อง']
        };
      }
    }

    // 4. Deposit & Advance Rent (เงินประกัน / ค่าแรกเข้า)
    if (q.includes('มัดจำ') || q.includes('ประกัน') || q.includes('แรกเข้า') || q.includes('ค่าแรกเข้า') || q.includes('เงินมัดจำ')) {
      return {
        text: `💰 **เงื่อนไขเงินประกันและค่าแรกเข้า (ตามมาตรฐานสัญญา):**\n\n1. **เงินประกันความเสียหาย:** 2 เดือนของค่าเช่า\n2. **ค่าเช่าล่วงหน้า:** 1 เดือน\n👉 รวมชำระก่อนเข้าพักทั้งหมด **3 เดือน**\n\n*เงินประกัน 2 เดือนจะได้รับคืนเต็มจำนวนภายใน 15 วันหลังจากสิ้นสุดสัญญาและตรวจรับห้องเรียบร้อยครับ*`,
        quickReplies: ['📝 ขอดูตัวอย่างสัญญา', '⚡ ค่าน้ำ-ค่าไฟ คิดยังไง?']
      };
    }

    // 5. Utility Bills (ค่าน้ำ, ค่าไฟ, ส่วนกลาง)
    if (q.includes('น้ำ') || q.includes('ไฟ') || q.includes('ค่าไฟ') || q.includes('ค่าน้ำ') || q.includes('ส่วนกลาง') || q.includes('บิล')) {
      return {
        text: `⚡ **อัตราค่าสาธารณูปโภคและส่วนกลาง:**\n\n• **ค่าไฟฟ้า:** อัตราตามการไฟฟ้านครหลวง (ประมาณ ฿7/หน่วย หรือบิลตรง)\n• **ค่าน้ำประปา:** ฿20 ต่อหน่วย (ชำระตามมิเตอร์จริง)\n• **ค่าส่วนกลาง:** รวมอยู่ในค่าเช่ารายเดือนแล้ว ผู้เช่าไม่ต้องจ่ายเพิ่ม!\n\nระบบจะออกใบแจ้งหนี้อัตโนมัติก่อนสิ้นเดือน และสามารถสแกนจ่ายผ่าน PromptPay QR Code ในระบบได้ทันทีครับ`,
        quickReplies: ['💳 เมนูชำระเงิน/บิล', '💰 สอบถามเรื่องเงินมัดจำ']
      };
    }

    // 6. Maintenance / Repair (แจ้งซ่อม)
    if (q.includes('ซ่อม') || q.includes('แอร์') || q.includes('รั่ว') || q.includes('พัง') || q.includes('ช่าง') || q.includes('เสีย')) {
      return {
        text: `🛠️ **การแจ้งซ่อมแซมและบำรุงรักษา:**\n\nหากพบปัญหาในห้องพัก (เช่น แอร์ไม่เย็น, ก๊อกน้ำรั่ว, ไฟดับ) คุณสามารถไปที่เมนู **"แจ้งซ่อมบำรุง"** แล้วกด **"เปิดใบแจ้งซ่อมใหม่"** แนบรายละเอียดและรูปภาพได้ทันทีครับ\n\nช่างอาคารและนิติบุคคลจะประสานงานเข้าตรวจเช็คภายใน 24-48 ชั่วโมงครับ`,
        quickReplies: ['🛠️ ไปที่หน้าแจ้งซ่อม', '📞 ติดต่อนิติบุคคล']
      };
    }

    // 7. Contract & E-Signature
    if (q.includes('สัญญา') || q.includes('e-sign') || q.includes('เซ็น') || q.includes('เอกสาร') || q.includes('บัตรประชาชน')) {
      return {
        text: `📝 **การทำสัญญาเช่าออนไลน์ (E-Lease):**\n\n• ทำสัญญาออนไลน์ได้ 100% ไม่ต้องเดินทาง\n• ยืนยันตัวตนและลงนามดิจิทัลผ่าน **SMS OTP** ปลอดภัยตาม พ.ร.บ.ธุรกรรมทางอิเล็กทรอนิกส์\n• เมื่อลงนามครบทั้งสองฝ่าย ระบบจะสร้างไฟล์ PDF พร้อมประทับตรารับรองเวลาดิจิทัล (Digital Timestamp) ให้ดาวน์โหลดได้ทันทีครับ`,
        quickReplies: ['📝 ไปที่หน้าสัญญาเช่า', '💰 เงินมัดจำคิดยังไง?']
      };
    }

    // 8. Viewing Appointment (นัดดูห้อง)
    if (q.includes('นัด') || q.includes('ดูห้อง') || q.includes('จองคิว') || q.includes('เวลา')) {
      return {
        text: `📅 **การนัดหมายเข้าชมห้องพักจริง:**\n\nคุณสามารถกดปุ่ม **"นัดดูห้อง"** ในการ์ดคอนโดที่สนใจ เพื่อเลือกรอบวันที่และเวลาที่สะดวกได้ฟรี ไม่มีค่าใช้จ่ายครับ เจ้าของห้องหรือเอเจนต์จะกดยืนยันนัดหมายกลับมาอย่างรวดเร็วครับ`,
        quickReplies: ['🔍 แนะนำห้องว่างยอดนิยม', '🐶 ห้องที่เลี้ยงสัตว์ได้']
      };
    }

    // 9. Popular / Available Units
    if (q.includes('ห้องว่าง') || q.includes('แนะนำ') || q.includes('ยอดนิยม') || q.includes('คอนโด') || q.includes('ทั้งหมด')) {
      const available = units.filter((u) => u.status === 'AVAILABLE').slice(0, 3);
      return {
        text: `นี่คือห้องพักที่ว่างพร้อมเข้าอยู่และได้รับความนิยมสูงในระบบตอนนี้ครับ:`,
        recommendedUnits: available,
        quickReplies: ['💰 สอบถามเรื่องเงินมัดจำ', '🐶 เลี้ยงสัตว์ได้ไหม?']
      };
    }

    // Default Fallback
    return {
      text: `ผมเข้าใจว่าคุณกำลังสอบถามเกี่ยวกับ "${userQuery}"\n\nคุณสามารถสอบถามข้อมูลที่ต้องการได้เลยครับ เช่น:\n• แนะนำคอนโดตามงบประมาณ (เช่น "งบไม่เกิน 30,000")\n• ค้นหาทำเล (เช่น "ใกล้ BTS ทองหล่อ" หรือ "พระราม 9")\n• เงื่อนไขเงินประกันและค่าแรกเข้า\n• ขั้นตอนการแจ้งซ่อมและค่าน้ำค่าไฟ`,
      quickReplies: INITIAL_QUICK_REPLIES
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate natural AI thinking delay (400-700ms)
    setTimeout(() => {
      const replyData = generateBotReply(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyData.text,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        recommendedUnits: replyData.recommendedUnits,
        quickReplies: replyData.quickReplies
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: 'เริ่มต้นบทสนทนาใหม่แล้วครับ! มีคำถามเกี่ยวกับคอนโด สัญญาเช่า หรือการแจ้งซ่อมเรื่องไหน สอบถามได้เลยครับ ✨',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: INITIAL_QUICK_REPLIES
      }
    ]);
  };

  const handleQuickAction = (reply: string) => {
    if (reply.includes('ไปที่หน้าแจ้งซ่อม')) {
      onNavigateTab('maintenance');
      setIsOpen(false);
      return;
    }
    if (reply.includes('ไปที่หน้าสัญญาเช่า')) {
      onNavigateTab('contract');
      setIsOpen(false);
      return;
    }
    if (reply.includes('เมนูชำระเงิน')) {
      onNavigateTab('billing');
      setIsOpen(false);
      return;
    }

    handleSendMessage(reply);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <div className="mb-2 mr-1 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-xl shadow-lg border border-slate-700/80 animate-bounce hidden sm:flex items-center gap-1.5 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>สอบถามเรื่องคอนโด & สัญญาได้ที่นี่!</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${
            isOpen
              ? 'bg-slate-800 text-white rotate-90 scale-95 shadow-slate-900/30'
              : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white hover:scale-105 shadow-blue-500/40 ring-4 ring-blue-400/20'
          }`}
          aria-label="เปิดแชทบอท"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform" />
          ) : (
            <div className="relative">
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse"></span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Window Modal / Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[400px] h-[580px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-blue-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-indigo-900 rounded-full"></span>
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1.5">
                  น้องคอนโด (AI Assistant)
                  <span className="px-1.5 py-0.2 bg-blue-500/30 text-[10px] rounded text-blue-200 border border-blue-400/20">
                    24h
                  </span>
                </div>
                <div className="text-[11px] text-blue-200/80 flex items-center gap-1">
                  <span>ผู้ช่วยค้นหาห้องพักและตอบคำถาม</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleResetChat}
                title="ล้างการสนทนา"
                className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="ย่อขนาด"
                className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Units Recommendations Cards (if any) */}
                  {msg.recommendedUnits && msg.recommendedUnits.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.recommendedUnits.map((u) => (
                        <div
                          key={u.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors flex gap-2.5 items-center text-slate-800"
                        >
                          <img
                            src={u.images[0]}
                            alt={u.title}
                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs truncate text-slate-800">{u.title}</div>
                            <div className="text-[11px] text-slate-500 truncate">{u.station} • {u.sizeSqM} ตร.ม.</div>
                            <div className="text-blue-600 font-bold text-xs mt-0.5">
                              ฿{u.monthlyRent.toLocaleString()} <span className="font-normal text-[10px] text-slate-400">/เดือน</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onSelectUnit(u);
                              setIsOpen(false);
                            }}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold rounded-lg text-[11px] transition-colors shrink-0 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>ดูห้อง</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Reply Suggestions */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((qr, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickAction(qr)}
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-[11px] transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                        >
                          <span>{qr}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] text-slate-400 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-slate-200 flex items-center space-x-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="พิมพ์คำถาม เช่น แนะนำห้องงบ 25,000..."
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="ส่งข้อความ"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="text-[10px] text-center text-slate-400 mt-1.5">
              CondoRent Hub AI Assistant • ให้ข้อมูลห้องพักและสัญญาเช่าทันที
            </div>
          </div>

        </div>
      )}
    </>
  );
};
