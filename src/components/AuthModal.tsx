import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, LogIn, UserPlus, Settings, ExternalLink, Key } from 'lucide-react';
import { db } from '../services/db';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'TENANT' | 'OWNER'>('TENANT');
  const [regNationalId, setRegNationalId] = useState('');

  // Status & Error
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showGoogleConfig, setShowGoogleConfig] = useState(false);

  // Google OAuth Client ID
  const DEFAULT_CLIENT_ID = '835281919061-q4piqtoovon9fs57p3h5nrn5r1f45a82.apps.googleusercontent.com';
  const [googleClientId, setGoogleClientId] = useState<string>(() => {
    return localStorage.getItem('condo_google_client_id') || DEFAULT_CLIENT_ID;
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = db.login(loginIdentifier, loginPassword);
    if (res.success && res.user) {
      setSuccessMessage(`ยินดีต้อนรับคุณ ${res.user.name}`);
      setTimeout(() => {
        onAuthSuccess(res.user!);
        onClose();
        setSuccessMessage('');
      }, 800);
    } else {
      setErrorMessage(res.message || 'อีเมล/เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPassword.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    const res = db.register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      nationalId: regNationalId
    });

    if (res.success && res.user) {
      setSuccessMessage('สร้างบัญชีผู้ใช้งานสำเร็จ!');
      setTimeout(() => {
        onAuthSuccess(res.user!);
        onClose();
        setSuccessMessage('');
      }, 1000);
    } else {
      setErrorMessage(res.message || 'ลงทะเบียนไม่สำเร็จ');
    }
  };

  // Real Google OAuth 2.0 Flow
  const handleRealGoogleOAuth = () => {
    if (!googleClientId.trim()) {
      setShowGoogleConfig(true);
      return;
    }

    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('openid email profile');
    const nonce = Math.random().toString(36).substring(2);
    
    // Redirect to Google's real OAuth2 authorization endpoint
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      googleClientId.trim()
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token%20id_token&scope=${scope}&nonce=${nonce}&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  const handleSaveClientId = (newId: string) => {
    const trimmed = newId.trim();
    setGoogleClientId(trimmed);
    localStorage.setItem('condo_google_client_id', trimmed);
    setShowGoogleConfig(false);
    if (trimmed) {
      alert('บันทึก Google OAuth Client ID เรียบร้อยแล้ว กำลังนำท่านไปยังหน้า Google Sign-In');
      handleRealGoogleOAuth();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-blue-300" />
          </div>
          <h2 className="text-xl font-bold">CondoRent Hub</h2>
          <p className="text-xs text-blue-200 mt-0.5">ระบบจัดการเช่าคอนโดออนไลน์ ปลอดภัยด้วย PDPA & E-Sign</p>

          {/* Tab Switcher */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-4 max-w-xs mx-auto border border-white/10">
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-blue-900 shadow-md ring-1 ring-black/5'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-blue-900 shadow-md ring-1 ring-black/5'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Real OAuth Button */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleRealGoogleOAuth}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{mode === 'login' ? 'เข้าสู่ระบบด้วย Google' : 'สมัครสมาชิกด้วย Google'}</span>
            </button>
          </div>

          {/* Google Cloud Client ID Configuration Box */}
          {showGoogleConfig && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-700" />
                  <span>ตั้งค่า Google OAuth 2.0 Client ID</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleConfig(false)}
                  className="text-amber-800 hover:text-amber-950 font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-amber-800 leading-relaxed">
                เนื่องจาก Google ไม่อนุญาตให้แอปภายนอกเชื่อมต่อ Gmail โดยไม่มี <strong>OAuth Client ID</strong> ที่ลงทะเบียนโดเมน <code>https://condo-rental-app.pages.dev</code>
              </p>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  วาง Google Client ID ของคุณที่นี่:
                </label>
                <input
                  type="text"
                  placeholder="เช่น 123456789-abc.apps.googleusercontent.com"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white border border-amber-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>สร้าง Client ID บน Google Cloud ฟรี</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => handleSaveClientId(googleClientId)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  บันทึก & เข้าสู่ระบบ
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
              {mode === 'login' ? 'หรือเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน' : 'หรือกรอกข้อมูลสมัครสมาชิก'}
            </span>
          </div>

          {/* Email / Password Form for Login Tab */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  อีเมล (Gmail / อีเมลใดก็ได้) หรือ เบอร์โทรศัพท์
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="เช่น your-email@gmail.com หรือ 08X-XXX-XXXX"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">รหัสผ่าน</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ (Sign In)</span>
              </button>
            </form>
          )}

          {/* Registration Form for Register Tab */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ประเภทบัญชีผู้ใช้
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('TENANT')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      regRole === 'TENANT'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    ผู้เช่า (Tenant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('OWNER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      regRole === 'OWNER'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    เจ้าของห้อง (Owner)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ-นามสกุลจริง
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="เช่น วรัญญา รัตนกิจ"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">อีเมลจริง (Gmail / อื่นๆ)</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์มือถือ</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เลขบัตรประจำตัวประชาชน (สำหรับ KYC / ทำสัญญา)
                </label>
                <input
                  type="text"
                  maxLength={13}
                  value={regNationalId}
                  onChange={(e) => setRegNationalId(e.target.value)}
                  placeholder="เลข 13 หลัก (ไม่บังคับในขั้นตอนนี้)"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">กำหนดรหัสผ่าน</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>ยืนยันการสมัครสมาชิกด้วยอีเมลนี้</span>
              </button>
            </form>
          )}

          {/* Quick config link at bottom */}
          {!showGoogleConfig && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowGoogleConfig(true)}
                className="text-[10px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3 h-3" />
                <span>ตั้งค่า Google OAuth 2.0 Client ID</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
