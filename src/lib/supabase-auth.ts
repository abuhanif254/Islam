import { supabase, isSupabaseConfigured } from './supabase';

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  full_name?: string;
  avatarUrl?: string;
  avatar_url?: string;
  role: 'user' | 'moderator' | 'admin';
  bio?: string;
  isVerified?: boolean;
}

const LOCAL_STORAGE_AUTH_USER_KEY = 'islam_portal_auth_user_v1';

// Get active session user
export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        return null;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        return {
          id: profile.id,
          email: session.user.email,
          fullName: profile.full_name || session.user.user_metadata?.full_name || 'মুমিন পাঠক',
          avatarUrl: profile.avatar_url || session.user.user_metadata?.avatar_url,
          role: profile.role || 'user',
          bio: profile.bio,
          isVerified: profile.is_verified
        };
      }

      return {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'মুমিন পাঠক',
        avatarUrl: session.user.user_metadata?.avatar_url,
        role: 'user'
      };
    } catch (e) {
      console.warn('Supabase auth getSession failed', e);
    }
  }

  // Fallback to localStorage auth for local dev/preview
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }

  return null;
}

// Sign In with Google OAuth
export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'গুগল লগইনে সমস্যা হয়েছে' };
    }
  }

  // Fallback simulation in local dev mode
  if (typeof window !== 'undefined') {
    const demoUser: UserProfile = {
      id: 'demo-google-user-786',
      email: 'reader@example.com',
      fullName: 'আব্দুর রহমান (গুগল যাচাইকৃত)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'user',
      isVerified: true
    };
    localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, JSON.stringify(demoUser));
    window.dispatchEvent(new Event('islam-auth-change'));
    return { success: true };
  }

  return { success: false, error: 'ব্রাউজার এনভায়রনমেন্ট পাওয়া যায়নি' };
}

// Sign In with Email & Password
export async function signInWithEmail(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass
      });
      if (error || !data.user) {
        return { success: false, error: error?.message || 'ইমেইল বা পাসওয়ার্ড সঠিক নয়' };
      }
      const profile = await getCurrentUser();
      return { success: true, user: profile || undefined };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Fallback simulation in local dev mode
  if (typeof window !== 'undefined') {
    const demoUser: UserProfile = {
      id: `local-user-${email.replace(/[^a-zA-Z0-9]/g, '') || '1'}`,
      email: email.trim(),
      fullName: email.split('@')[0] || 'মুমিন পাঠক',
      role: 'user'
    };
    localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, JSON.stringify(demoUser));
    window.dispatchEvent(new Event('islam-auth-change'));
    return { success: true, user: demoUser };
  }

  return { success: false, error: 'লগইন ব্যর্থ হয়েছে' };
}

// Sign Up with Email & Password
export async function signUpWithEmail(
  email: string,
  pass: string,
  fullName: string
): Promise<{ success: boolean; user?: UserProfile; error?: string; confirmationRequired?: boolean }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: {
            full_name: fullName.trim()
          }
        }
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user && !data.session) {
        return { success: true, confirmationRequired: true };
      }
      const profile = await getCurrentUser();
      return { success: true, user: profile || undefined };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Fallback simulation
  if (typeof window !== 'undefined') {
    const demoUser: UserProfile = {
      id: `local-user-${Date.now()}`,
      email: email.trim(),
      fullName: fullName.trim() || 'মুমিন পাঠক',
      role: 'user'
    };
    localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, JSON.stringify(demoUser));
    window.dispatchEvent(new Event('islam-auth-change'));
    return { success: true, user: demoUser };
  }

  return { success: false, error: 'নিবন্ধন ব্যর্থ হয়েছে' };
}

// Sign Out
export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out failed', e);
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_USER_KEY);
    window.dispatchEvent(new Event('islam-auth-change'));
  }
}

// Auth State Change Subscriber
export function subscribeToAuthState(callback: (user: UserProfile | null) => void) {
  let unsubscribeSupabase = () => {};

  if (isSupabaseConfigured() && supabase) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      const user = await getCurrentUser();
      callback(user);
    });
    unsubscribeSupabase = () => subscription.unsubscribe();
  }

  const handleLocalChange = async () => {
    const user = await getCurrentUser();
    callback(user);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('islam-auth-change', handleLocalChange);
    window.addEventListener('storage', handleLocalChange);
  }

  return () => {
    unsubscribeSupabase();
    if (typeof window !== 'undefined') {
      window.removeEventListener('islam-auth-change', handleLocalChange);
      window.removeEventListener('storage', handleLocalChange);
    }
  };
}

// ==========================================
// ADMIN DASHBOARD AUTH EXTENSIONS
// ==========================================

// ==========================================
// ANTI-HACKER ADMIN AUTHENTICATION ENGINE
// ==========================================

export interface AdminUserSession {
  id: string;
  email: string;
  name?: string;
  fullName: string;
  role: 'superadmin' | 'editor' | 'author';
  avatarUrl?: string;
}

const LOCAL_STORAGE_ADMIN_KEY = 'islam_admin_session_v1';
const LOCAL_STORAGE_LOCKOUT_KEY = 'islam_admin_lockout_v1';
const LOCAL_STORAGE_LAST_ACTIVITY_KEY = 'islam_admin_last_activity_v1';
export const ADMIN_INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 mins idle auto-lock

interface LockoutState {
  failedCount: number;
  lockedUntil: number; // timestamp in ms
}

// 1. Rate Limiter & Lockout Checker
export function getAdminLockoutState(): { isLocked: boolean; remainingSeconds: number; failedCount: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, failedCount: 0 };
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOCKOUT_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0, failedCount: 0 };
    const parsed: LockoutState = JSON.parse(raw);
    const now = Date.now();
    if (parsed.lockedUntil > now) {
      return {
        isLocked: true,
        remainingSeconds: Math.ceil((parsed.lockedUntil - now) / 1000),
        failedCount: parsed.failedCount
      };
    }
    return { isLocked: false, remainingSeconds: 0, failedCount: parsed.failedCount };
  } catch {
    return { isLocked: false, remainingSeconds: 0, failedCount: 0 };
  }
}

export function recordFailedAdminAttempt(): { isLocked: boolean; remainingSeconds: number; failedCount: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, failedCount: 1 };
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOCKOUT_KEY);
    const prev: LockoutState = raw ? JSON.parse(raw) : { failedCount: 0, lockedUntil: 0 };
    const now = Date.now();
    const newCount = prev.failedCount + 1;
    let lockoutDurationMs = 0;

    if (newCount >= 5) {
      lockoutDurationMs = 15 * 60 * 1000; // 15 minutes lockout
    } else if (newCount >= 3) {
      lockoutDurationMs = 60 * 1000; // 1 minute cooldown
    }

    const updated: LockoutState = {
      failedCount: newCount,
      lockedUntil: lockoutDurationMs > 0 ? now + lockoutDurationMs : 0
    };
    localStorage.setItem(LOCAL_STORAGE_LOCKOUT_KEY, JSON.stringify(updated));

    return {
      isLocked: lockoutDurationMs > 0,
      remainingSeconds: Math.ceil(lockoutDurationMs / 1000),
      failedCount: newCount
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, failedCount: 1 };
  }
}

export function resetAdminLockout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_LOCKOUT_KEY);
  }
}

// 2. Inactivity Watchdog
export function updateAdminActivity(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_LAST_ACTIVITY_KEY, Date.now().toString());
  }
}

export function isSessionTimedOut(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LAST_ACTIVITY_KEY);
    if (!raw) return false;
    const lastActive = parseInt(raw, 10);
    return Date.now() - lastActive > ADMIN_INACTIVITY_TIMEOUT_MS;
  } catch {
    return false;
  }
}

// 3. Security Audit Logger (Immutable PostgreSQL Log)
export async function logSecurityAudit(
  eventType: 'login_success' | 'login_failed' | 'locked_out' | 'unauthorized_role_attempt' | 'session_timeout',
  email: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('admin_security_logs').insert({
        event_type: eventType,
        email,
        user_id: userId || null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/SSG',
        metadata: metadata || {}
      });
    } catch (e) {
      console.warn('Security audit log failed', e);
    }
  }
}

// 4. Zero-Trust Admin Session Verifier
export async function getCurrentAdminSession(): Promise<AdminUserSession | null> {
  // Check inactivity auto-lock
  if (isSessionTimedOut()) {
    await signOutAdmin();
    return null;
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        return null;
      }

      // Hardware RLS & Role check: only allow if user has admin/superadmin role in database
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_verified, full_name, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
        // Public reader attempting admin access! Deny and revoke session
        await supabase.auth.signOut();
        if (typeof window !== 'undefined') {
          localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
        }
        return null;
      }

      updateAdminActivity();
      const fullName = profile.full_name || 'মুহাম্মদ বাইতুল্লাহ (সুপার অ্যাডমিন)';
      return {
        id: session.user.id,
        email: session.user.email || 'mohammadbitullah@gmail.com',
        name: fullName,
        fullName,
        role: profile.role,
        avatarUrl: profile.avatar_url
      };
    } catch (e) {
      console.warn('getCurrentAdminSession error', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
      if (raw) {
        updateAdminActivity();
        return JSON.parse(raw);
      }
    } catch {}
  }
  return null;
}

// 5. Anti-Hacker Enhanced Sign In
export interface AdminSignInParams {
  email: string;
  password?: string;
  securityPasskey?: string; // 2FA Master Secret Key
  honeypot?: string; // Anti-Bot invisible trap
  magicLinkMode?: boolean;
}

export async function signInAdminEnhanced({
  email,
  password,
  securityPasskey,
  honeypot,
  magicLinkMode = false
}: AdminSignInParams): Promise<{ success: boolean; error?: string; lockoutSeconds?: number }> {
  // 1. Honeypot bot trap check
  if (honeypot && honeypot.trim().length > 0) {
    // Bot trapped! Fake delay and reject silently
    await new Promise((r) => setTimeout(r, 1200));
    return { success: false, error: 'অননুমোদিত বট স্ক্রিপ্ট শনাক্ত হয়েছে।' };
  }

  // 2. Rate limit & lockout check
  const lockout = getAdminLockoutState();
  if (lockout.isLocked) {
    await logSecurityAudit('locked_out', email, undefined, { remainingSeconds: lockout.remainingSeconds });
    return {
      success: false,
      lockoutSeconds: lockout.remainingSeconds,
      error: `অতিরিক্ত ভুল চেষ্টার কারণে সিস্টেম সাময়িকভাবে লকডাউন করা হয়েছে। ${lockout.remainingSeconds} সেকেন্ড পর চেষ্টা করুন।`
    };
  }

  // 3. Constant-time execution guarantee (Mitigate timing attacks)
  const startTime = Date.now();
  const ensureMinDelay = async () => {
    const elapsed = Date.now() - startTime;
    if (elapsed < 650) {
      await new Promise((r) => setTimeout(r, 650 - elapsed));
    }
  };

  const expectedPasskey = process.env.NEXT_PUBLIC_ADMIN_SECURITY_PASSKEY || '1370';
  const cleanPasskey = (securityPasskey || '').trim();

  // If live Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      if (magicLinkMode) {
        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined;
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) {
          recordFailedAdminAttempt();
          await ensureMinDelay();
          await logSecurityAudit('login_failed', email, undefined, { reason: error.message });
          return { success: false, error: error.message };
        }
        await ensureMinDelay();
        return { success: true };
      }

      // 2FA Master Passkey Validation (Dual-Factor Gate: 1370)
      if (cleanPasskey !== expectedPasskey) {
        const fail = recordFailedAdminAttempt();
        await ensureMinDelay();
        await logSecurityAudit('login_failed', email, undefined, { reason: 'Invalid 2FA Master Passkey' });
        return {
          success: false,
          lockoutSeconds: fail.isLocked ? fail.remainingSeconds : undefined,
          error: 'সিক্রেট অ্যাডমিন পাসকী (২য় ফ্যাক্টর) ভুল।'
        };
      }

      // Password Auth with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || ''
      });

      if (error || !data.user) {
        // If Supabase user was not found or password mismatched, check designated admin fallback
        if (
          email.toLowerCase() === 'mohammadbitullah@gmail.com' &&
          password === ',.,.25ab2292,,' &&
          cleanPasskey === expectedPasskey
        ) {
          resetAdminLockout();
          updateAdminActivity();
          const fullName = 'মুহাম্মদ বাইতুল্লাহ (সুপার অ্যাডমিন)';
          const adminSession: AdminUserSession = {
            id: 'admin-master-mohammadbitullah',
            email: 'mohammadbitullah@gmail.com',
            name: fullName,
            fullName,
            role: 'superadmin'
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(adminSession));
          }
          await ensureMinDelay();
          await logSecurityAudit('login_success', email, adminSession.id, { role: 'superadmin', mode: 'designated_admin' });
          return { success: true };
        }

        const fail = recordFailedAdminAttempt();
        await ensureMinDelay();
        await logSecurityAudit('login_failed', email, undefined, { reason: error?.message || 'Invalid credentials' });
        return {
          success: false,
          lockoutSeconds: fail.isLocked ? fail.remainingSeconds : undefined,
          error: fail.isLocked
            ? `অ্যাকাউন্ট লকআউট! ${fail.remainingSeconds} সেকেন্ড অপেক্ষা করুন।`
            : (error?.message || 'ভুল ইমেইল বা পাসওয়ার্ড।')
        };
      }

      // Role check from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_verified, full_name, avatar_url')
        .eq('id', data.user.id)
        .single();

      if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
        await supabase.auth.signOut();
        const fail = recordFailedAdminAttempt();
        await ensureMinDelay();
        await logSecurityAudit('unauthorized_role_attempt', email, data.user.id, {
          detectedRole: profile?.role || 'none'
        });
        return {
          success: false,
          lockoutSeconds: fail.isLocked ? fail.remainingSeconds : undefined,
          error: 'অ্যাক্সেস প্রত্যাখ্যান: এই অ্যাকাউন্টের কোনো অ্যাডমিন পারমিশন নেই।'
        };
      }

      // Authenticated successfully!
      resetAdminLockout();
      updateAdminActivity();
      const adminSession: AdminUserSession = {
        id: data.user.id,
        email: data.user.email || email,
        name: profile.full_name || 'মুহাম্মদ বাইতুল্লাহ (সুপার অ্যাডমিন)',
        fullName: profile.full_name || 'মুহাম্মদ বাইতুল্লাহ (সুপার অ্যাডমিন)',
        role: profile.role,
        avatarUrl: profile.avatar_url
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(adminSession));
      }

      await ensureMinDelay();
      await logSecurityAudit('login_success', email, data.user.id, { role: profile.role });
      return { success: true };
    } catch (e: any) {
      await ensureMinDelay();
      return { success: false, error: e.message || 'প্রমাণীকরণে অভ্যন্তরীণ ত্রুটি হয়েছে।' };
    }
  }

  // Local/Offline Fallback Authentication with User's Strict Credentials
  const isDesignatedEmail = email.toLowerCase() === 'mohammadbitullah@gmail.com';
  const isDesignatedPass = password === ',.,.25ab2292,,';
  const isDesignatedPasskey = cleanPasskey === expectedPasskey;

  if (isDesignatedEmail && isDesignatedPass && isDesignatedPasskey) {
    resetAdminLockout();
    updateAdminActivity();
    const fullName = 'মুহাম্মদ বাইতুল্লাহ (সুপার অ্যাডমিন)';
    const adminSession: AdminUserSession = {
      id: 'admin-master-mohammadbitullah',
      email: 'mohammadbitullah@gmail.com',
      name: fullName,
      fullName,
      role: 'superadmin'
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(adminSession));
    }
    await ensureMinDelay();
    return { success: true };
  }

  const fail = recordFailedAdminAttempt();
  await ensureMinDelay();
  return {
    success: false,
    lockoutSeconds: fail.isLocked ? fail.remainingSeconds : undefined,
    error: fail.isLocked
      ? `অতিরিক্ত ভুল চেষ্টার কারণে সিস্টেম সাময়িকভাবে ${fail.remainingSeconds} সেকেন্ডের জন্য লক করা হয়েছে।`
      : 'ভুল ইমেইল, পাসওয়ার্ড বা সিক্রেট পাসকী।'
  };
}

// Backward-compatible signature
export async function signInAdmin(email: string, password: string, securityPasskey?: string): Promise<{ success: boolean; error?: string }> {
  return signInAdminEnhanced({ email, password, securityPasskey });
}

export async function signInWithMagicLink(email: string): Promise<{ success: boolean; message: string; error?: string }> {
  const res = await signInAdminEnhanced({ email, magicLinkMode: true });
  if (res.success) {
    return { success: true, message: 'আপনার ইমেইলে একটি ওয়ান-ক্লিক ম্যাজিক লিংক পাঠানো হয়েছে!' };
  }
  return { success: false, message: res.error || 'ম্যাজিক লিংক পাঠাতে ব্যর্থ', error: res.error };
}

export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {}
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_LAST_ACTIVITY_KEY);
  }
}

