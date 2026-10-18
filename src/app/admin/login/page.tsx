'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ShieldAlert,
  Fingerprint,
  Sparkles
} from 'lucide-react';
import { IslamicGeometricEmblem } from '@/components/IslamicGeometricEmblem';
import {
  signInAdminEnhanced,
  getCurrentAdminSession,
  getAdminLockoutState
} from '@/lib/supabase-auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'password' | 'magic_link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityPasskey, setSecurityPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Invisible Anti-bot trap
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  useEffect(() => {
    setIsLiveSupabase(isSupabaseConfigured());
    // If already authenticated and verified as admin, redirect to dashboard
    getCurrentAdminSession().then((session) => {
      if (session) {
        router.push('/admin');
      }
    });

    // Check rate limit lockout state
    const checkLock = () => {
      const state = getAdminLockoutState();
      if (state.isLocked) {
        setLockoutRemaining(state.remainingSeconds);
      } else {
        setLockoutRemaining(0);
      }
    };
    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (lockoutRemaining > 0) {
      setErrorMsg(`নিরাপত্তা লকডাউন সক্রিয়। অপেক্ষা করুন: ${lockoutRemaining} সেকেন্ড।`);
      return;
    }

    if (!email.trim()) {
      setErrorMsg('অ্যাডমিন ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('মাস্টার পাসওয়ার্ড প্রদান করুন।');
      return;
    }
    if (!securityPasskey.trim()) {
      setErrorMsg('২য় ফ্যাক্টর (2FA) সিক্রেট পাসকী প্রদান করুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await signInAdminEnhanced({
        email: email.trim(),
        password,
        securityPasskey: securityPasskey.trim(),
        honeypot
      });

      if (res.success) {
        setSuccessMsg('প্রমাণীকরণ সফল! নিরাপদ ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
        setTimeout(() => {
          router.push('/admin');
        }, 600);
      } else {
        if (res.lockoutSeconds) {
          setLockoutRemaining(res.lockoutSeconds);
        }
        setErrorMsg(res.error || 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।');
      }
    } catch (err: any) {
      setErrorMsg('ত্রুটি: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (lockoutRemaining > 0) {
      setErrorMsg(`নিরাপত্তা লকডাউন সক্রিয়। অপেক্ষা করুন: ${lockoutRemaining} সেকেন্ড।`);
      return;
    }

    if (!email.trim()) {
      setErrorMsg('ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await signInAdminEnhanced({
        email: email.trim(),
        magicLinkMode: true,
        honeypot
      });

      if (res.success) {
        setSuccessMsg('আপনার অফিশিয়াল ইমেইলে ওয়ান-টাইম সিকিউর লগইন লিংক পাঠানো হয়েছে!');
      } else {
        if (res.lockoutSeconds) {
          setLockoutRemaining(res.lockoutSeconds);
        }
        setErrorMsg(res.error || 'ম্যাজিক লিংক পাঠানো ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      setErrorMsg('ত্রুটি: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141615] flex flex-col justify-between py-8 px-4 sm:px-6 font-sans">
      {/* TOP HEADER */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F3B] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>মূল ওয়েবসাইটে ফিরে যান</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-[#0B4F3B] bg-emerald-50 px-2 py-0.5 border border-[#0B4F3B] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>ZERO-TRUST RLS</span>
          </span>
          <div className="text-[10px] font-mono font-bold text-[#B85D19] bg-[#F6ECE3] px-2 py-0.5 border border-[#B85D19]">
            {isLiveSupabase ? 'CLOUD SECURED' : 'LOCAL PROTECTED'}
          </div>
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="max-w-md w-full mx-auto my-auto bg-[#FFFFFF] border-4 border-[#141615] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* EMBLEM & TITLE */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <IslamicGeometricEmblem
              size={56}
              primaryColor="#0B4F3B"
              accentColor="#B85D19"
              surfaceColor="#FAF8F5"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F6ECE3] text-[#B85D19] border border-[#B85D19] text-[11px] font-mono font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3" />
            <span>এন্টারপ্রাইজ অ্যাডমিন সিকিউরিটি</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B]">
            সেন্ট্রাল অ্যাডমিন লগইন
          </h1>
          <p className="text-xs text-[#6E7571] leading-relaxed">
            জ্ঞানকোষ ব্যবস্থাপনা ও ডাটাবেজ নিয়ন্ত্রণ প্যানেলে প্রবেশের জন্য দ্বৈত-প্রমাণীকরণ (2FA) সম্পন্ন করুন।
          </p>
        </div>

        {/* LOCKOUT ACTIVE ALERT */}
        {lockoutRemaining > 0 && (
          <div className="p-3.5 bg-red-50 border-2 border-red-600 text-red-900 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-red-700">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>নিরাপত্তা লকডাউন সক্রিয়</span>
            </div>
            <p className="text-[11px] text-red-800 leading-relaxed">
              পরপর একাধিক ভুল চেষ্টার কারণে সিস্টেম সাময়িকভাবে স্থগিত করা হয়েছে।
            </p>
            <div className="font-mono text-sm font-bold text-red-950 pt-1">
              লক মুক্তির বাকি: {Math.floor(lockoutRemaining / 60)} মিনিট {lockoutRemaining % 60} সেকেন্ড
            </div>
          </div>
        )}

        {/* TABS (PASSWORD VS MAGIC LINK) */}
        <div className="flex border-2 border-[#141615] bg-[#FAF8F5] p-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold transition-colors ${
              authMode === 'password'
                ? 'bg-[#0B4F3B] text-white shadow-sm'
                : 'text-[#141615] hover:text-[#0B4F3B]'
            }`}
          >
            পাসওয়ার্ড + 2FA পাসকী
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('magic_link');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold transition-colors ${
              authMode === 'magic_link'
                ? 'bg-[#0B4F3B] text-white shadow-sm'
                : 'text-[#141615] hover:text-[#0B4F3B]'
            }`}
          >
            ম্যাজিক লিংক (OTP)
          </button>
        </div>

        {/* ALERTS */}
        {errorMsg && (
          <div className="p-3 bg-[#FBEAE8] border-2 border-[#D9381E] text-[#D9381E] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#E6F0EC] border-2 border-[#0B4F3B] text-[#0B4F3B] text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* INVISIBLE ANTI-BOT HONEYPOT TRAP */}
        <div className="opacity-0 pointer-events-none absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
          <input
            type="text"
            name="system_verification_honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* FORM */}
        {authMode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#141615] mb-1.5">
                অ্যাডমিন ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6E7571] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mohammadbitullah@gmail.com"
                  required
                  disabled={loading || lockoutRemaining > 0}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#141615] text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B] disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141615] mb-1.5">
                মাস্টার পাসওয়ার্ড
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#6E7571] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={loading || lockoutRemaining > 0}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border-2 border-[#141615] text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7571] hover:text-[#141615]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2FA SECONDARY PASSKEY (DUAL FACTOR) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#141615] flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-[#0B4F3B]" />
                  <span>২য় ফ্যাক্টর: সিক্রেট অ্যাডমিন পাসকী (2FA)</span>
                </label>
                <span className="text-[10px] text-[#B85D19] font-bold">2FA REQUIRED</span>
              </div>
              <div className="relative">
                <input
                  type={showPasskey ? 'text' : 'password'}
                  value={securityPasskey}
                  onChange={(e) => setSecurityPasskey(e.target.value)}
                  placeholder="৪-ডিজিট সিক্রেট কোড লিখুন"
                  required
                  disabled={loading || lockoutRemaining > 0}
                  className="w-full pl-3 pr-10 py-2.5 bg-[#FAF8F5] border-2 border-[#141615] text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B] disabled:opacity-50 font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E7571] hover:text-[#141615]"
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#6E7571] mt-1">
                পাসওয়ার্ড লিক হলেও এই গোপন ২য় ফ্যাক্টর ছাড়া অ্যাডমিন প্যানেলে প্রবেশ অসম্ভব।
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutRemaining > 0}
              className="w-full py-3 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-sm font-bold border-2 border-[#141615] shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'প্রমাণীকরণ যাচাই হচ্ছে...' : 'নিরাপদ লগইন সম্পন্ন করুন'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#141615] mb-1.5">
                আপনার রেজিস্টার্ড অ্যাডমিন ইমেইল
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6E7571] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mohammadbitullah@gmail.com"
                  required
                  disabled={loading || lockoutRemaining > 0}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#141615] text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B] disabled:opacity-50"
                />
              </div>
              <p className="text-[11px] text-[#6E7571] mt-1">
                শুধুমাত্র যাচাইকৃত অনুমোদিত অ্যাডমিন ইমেইলে সুরক্ষিত ওয়ান-টাইম ওটিপি লিংক প্রেরিত হবে।
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutRemaining > 0}
              className="w-full py-3 bg-[#B85D19] hover:bg-[#9B4E15] text-white text-sm font-bold border-2 border-[#141615] shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'লিংক পাঠানো হচ্ছে...' : 'ম্যাজিক লিংক পাঠান'}</span>
            </button>
          </form>
        )}
      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-[#6E7571] flex items-center justify-center gap-2">
        <span>© ২০২৬ ইসলাম পোর্টাল • সেন্ট্রাল সিকিউরিটি অপারেশনস</span>
      </div>
    </div>
  );
}
