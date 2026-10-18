'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, UserProfile } from '@/lib/supabase-auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile) => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin'
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setErrorMsg(res.error || 'গুগল লগইন ব্যর্থ হয়েছে');
      } else {
        setSuccessMsg('লগইন সফল হয়েছে!');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'গুগল লগইনে সমস্যা হয়েছে');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন।');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const res = await signInWithEmail(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'লগইন ব্যর্থ হয়েছে।');
        } else {
          setSuccessMsg('স্বাগতম! আপনি সফলভাবে লগইন করেছেন।');
          if (res.user && onSuccess) onSuccess(res.user);
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        if (!fullName.trim()) {
          setErrorMsg('অনুগ্রহ করে আপনার নাম প্রদান করুন।');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, fullName);
        if (!res.success) {
          setErrorMsg(res.error || 'নিবন্ধন ব্যর্থ হয়েছে।');
        } else if (res.confirmationRequired) {
          setSuccessMsg('আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। অনুগ্রহ করে ইমেইল চেক করুন।');
        } else {
          setSuccessMsg('নিবন্ধন সফল হয়েছে!');
          if (res.user && onSuccess) onSuccess(res.user);
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] dark:bg-[#141615] border-2 border-[#141615] dark:border-[#3B4D47] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="bg-[#0B4F3B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#E8A86B]" />
            <div>
              <h2 className="font-editorial text-lg font-bold leading-tight">
                {mode === 'signin' ? 'পাঠক লগইন' : 'নতুন পাঠক একাউন্ট তৈরি'}
              </h2>
              <p className="text-[11px] text-[#D5E6DF]">
                ইসলাম — প্রামাণ্য তাহকীক ও ডিজিটাল বিশ্বকোষ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="p-1 hover:bg-[#083B2C] text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-2 border-b border-[#DCD7CD] dark:border-[#26332F] bg-white dark:bg-[#1A2421]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              mode === 'signin'
                ? 'border-[#0B4F3B] text-[#0B4F3B] dark:text-[#4CC39A] bg-[#FAF8F5] dark:bg-[#141615]'
                : 'border-transparent text-[#6E7571] hover:text-[#141615]'
            }`}
          >
            লগইন (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              mode === 'signup'
                ? 'border-[#0B4F3B] text-[#0B4F3B] dark:text-[#4CC39A] bg-[#FAF8F5] dark:bg-[#141615]'
                : 'border-transparent text-[#6E7571] hover:text-[#141615]'
            }`}
          >
            নতুন নিবন্ধন (Sign Up)
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5">
          {/* MESSAGES */}
          {errorMsg && (
            <div className="p-3 bg-[#FBEAE8] border border-[#DC2626] text-[#DC2626] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-[#0B4F3B] text-[#0B4F3B] dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-CLICK GOOGLE SIGN IN */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full py-2.5 px-4 bg-white dark:bg-[#1A2421] border-2 border-[#DCD7CD] dark:border-[#3B4D47] hover:border-[#0B4F3B] text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-colors shadow-xs"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0B4F3B]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>গুগল (Google) দিয়ে ১-ক্লিকে লগইন</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#DCD7CD] dark:border-[#26332F] w-full" />
            <span className="bg-[#FAF8F5] dark:bg-[#141615] px-3 text-[11px] font-semibold text-[#6E7571] uppercase tracking-wider shrink-0">
              অথবা ইমেইল দিয়ে
            </span>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold mb-1 text-[#141615] dark:text-[#FAF8F5]">
                  আপনার পূর্ণ নাম
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7571]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="যেমন: মুহাম্মাদ আব্দুল্লাহ"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#1A2421] border border-[#DCD7CD] dark:border-[#3B4D47] focus:outline-none focus:border-[#0B4F3B]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1 text-[#141615] dark:text-[#FAF8F5]">
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7571]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#1A2421] border border-[#DCD7CD] dark:border-[#3B4D47] focus:outline-none focus:border-[#0B4F3B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-[#141615] dark:text-[#FAF8F5]">
                পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6E7571]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#1A2421] border border-[#DCD7CD] dark:border-[#3B4D47] focus:outline-none focus:border-[#0B4F3B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-2.5 px-4 bg-[#0B4F3B] hover:bg-[#083B2C] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>প্রক্রিয়াধীন...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'লগইন করুন' : 'নিবন্ধন সম্পন্ন করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-[#6E7571] text-center leading-relaxed">
            লগইন করার মাধ্যমে আপনি প্রামাণ্য দ্বীনি আলোচনা ও শালীন মন্তব্য নীতিমালা মেনে চলতে সম্মতি জ্ঞাপন করছেন।
          </p>
        </div>
      </div>
    </div>
  );
}
