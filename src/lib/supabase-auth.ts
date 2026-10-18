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

export interface AdminUserSession {
  id: string;
  email: string;
  name?: string;
  fullName: string;
  role: 'superadmin' | 'editor' | 'author';
  avatarUrl?: string;
}

const LOCAL_STORAGE_ADMIN_KEY = 'islam_admin_session_v1';

export async function getCurrentAdminSession(): Promise<AdminUserSession | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || 'মুহাক্কিক অ্যাডমিন';
        return {
          id: session.user.id,
          email: session.user.email || 'admin@islam.gov.bd',
          name: fullName,
          fullName,
          role: 'superadmin',
          avatarUrl: session.user.user_metadata?.avatar_url
        };
      }
    } catch (e) {
      console.warn('getCurrentAdminSession error', e);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
  }
  return null;
}

export async function signInAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      const fullName = data.user.user_metadata?.full_name || 'মুহাক্কিক অ্যাডমিন';
      const adminSession: AdminUserSession = {
        id: data.user.id,
        email: data.user.email || email,
        name: fullName,
        fullName,
        role: 'superadmin'
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(adminSession));
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'অ্যাডমিন লগইনে ব্যর্থ' };
    }
  }

  // Local fallback: authenticate demo credentials or any valid entry
  if (email === 'admin@islam.gov.bd' && password === 'islam@2026') {
    const fullName = 'প্রফেসর ড. আব্দুল্লাহ আল-মামুন (সুপার অ্যাডমিন)';
    const adminSession: AdminUserSession = {
      id: 'admin-local-master-1',
      email: 'admin@islam.gov.bd',
      name: fullName,
      fullName,
      role: 'superadmin'
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(adminSession));
    }
    return { success: true };
  }

  const defaultName = 'এডমিন ইউজার';
  const adminSession: AdminUserSession = {
    id: 'admin-local-master-1',
    email,
    name: defaultName,
    fullName: defaultName,
    role: 'superadmin'
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(adminSession));
  }
  return { success: true };
}

export async function signInWithMagicLink(email: string): Promise<{ success: boolean; message: string; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo }
      });
      if (error) return { success: false, message: error.message, error: error.message };
      return { success: true, message: 'আপনার ইমেইলে একটি ওয়ান-ক্লিক ম্যাজিক লিংক পাঠানো হয়েছে!' };
    } catch (e: any) {
      return { success: false, message: e.message, error: e.message };
    }
  }

  return { success: true, message: 'ম্যাজিক লিংক (ডেমো মোড) সফলভাবে প্রেরিত হয়েছে।' };
}

export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {}
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
  }
}
