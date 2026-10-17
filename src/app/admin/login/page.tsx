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
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Database,
  ArrowLeft
} from 'lucide-react';
import { IslamicGeometricEmblem } from '@/components/IslamicGeometricEmblem';
import { signInAdmin, signInWithMagicLink, getCurrentAdminSession } from '@/lib/supabase-auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'password' | 'magic_link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  useEffect(() => {
    setIsLiveSupabase(isSupabaseConfigured());
    // If already logged in, redirect to /admin
    getCurrentAdminSession().then(session => {
      if (session) {
        router.push('/admin');
      }
    });
  }, [router]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await signInAdmin(email, password);
      if (res.success) {
        setSuccessMsg('লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
        setTimeout(() => {
          router.push('/admin');
        }, 800);
      } else {
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

    if (!email.trim()) {
      setErrorMsg('ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithMagicLink(email);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.error || res.message);
      }
    } catch (err: any) {
      setErrorMsg('ত্রুটি: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@islam.gov.bd');
    setPassword('islam@2026');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141615] flex flex-col justify-between py-10 px-4 sm:px-6 font-sans">
      {/* TOP HEADER */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F3B] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>মূল ওয়েবসাইটে ফিরে যান</span>
        </Link>

        <div className="text-[11px] font-mono font-bold text-[#B85D19] bg-[#F6ECE3] px-2 py-0.5 border border-[#B85D19]">
          {isLiveSupabase ? 'SUPABASE CLOUD ACTIVE' : 'LOCAL DEV READY'}
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="max-w-md w-full mx-auto my-auto bg-[#FFFFFF] border-4 border-[#141615] shadow-2xl p-6 sm:p-8 space-y-6">
        {/* EMBLEM & TITLE */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <IslamicGeometricEmblem
              size={56}
              primaryColor="#0B4F3B"
              accentColor="#B85D19"
              surfaceColor="#FAF8F5"
            />
          </div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#B85D19]">
            নিরাপদ প্রমাণীকরণ
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#0B4F3B]">
            সেন্ট্রাল অ্যাডমিন লগইন
          </h1>
          <p className="text-xs text-[#6E7571] leading-relaxed">
            ইসলাম পোর্টালের কন্টেন্ট ম্যানেজমেন্ট, তাহকীক ও ডাটাবেজ নিয়ন্ত্রণ প্যানেলে প্রবেশের জন্য লগইন করুন।
          </p>
        </div>

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
                ? 'bg-[#0B4F3B] text-white'
                : 'text-[#141615] hover:text-[#0B4F3B]'
            }`}
          >
            পাসওয়ার্ড লগইন
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
                ? 'bg-[#0B4F3B] text-white'
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
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@islam.gov.bd"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#141615] text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141615] mb-1.5">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#6E7571] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border-2 border-[#141615] text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-sm font-bold border-2 border-[#141615] shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLinkLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#141615] mb-1.5">
                আপনার রেজিস্টার্ড ইমেইল
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6E7571] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@islam.gov.bd"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#141615] text-sm text-[#141615] focus:outline-none focus:ring-1 focus:ring-[#0B4F3B]"
                />
              </div>
              <p className="text-[11px] text-[#6E7571] mt-1">
                পাসওয়ার্ডের প্রয়োজন নেই। আপনার ইমেইলে সরাসরি লগইন লিঙ্ক পাঠানো হবে।
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#B85D19] hover:bg-[#9B4E15] text-white text-sm font-bold border-2 border-[#141615] shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'লিংক পাঠানো হচ্ছে...' : 'ম্যাজিক লিংক পাঠান'}</span>
            </button>
          </form>
        )}

        {/* DEMO / ROOT ACCESS SHORTCUT */}
        <div className="pt-3 border-t-2 border-[#141615] bg-[#FAF8F5] p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#141615] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F3B]" />
              <span>রুট অ্যাক্সেস ও ডেমো ক্রেডেনশিয়াল</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-bold text-[#0B4F3B] hover:underline"
            >
              অটো ফিল
            </button>
          </div>
          <p className="text-[11px] text-[#6E7571]">
            ইমেইল: <code className="bg-[#EFEBE4] px-1 font-mono">admin@islam.gov.bd</code> | পাসওয়ার্ড: <code className="bg-[#EFEBE4] px-1 font-mono">islam@2026</code>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-xs text-[#6E7571]">
        © ২০২৬ ইসলাম পোর্টাল • শরীয়াহ তাহকীক ও এডিটোরিয়াল বোর্ড
      </div>
    </div>
  );
}
