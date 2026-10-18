-- ===========================================================================
-- ইসলাম পোর্টাল — অ্যান্টি-হ্যাকার অ্যাডমিন সিকিউরিটি ও অডিট লগ মাইগ্রেশন
-- ===========================================================================

-- ১. IMMUTABLE SECURITY AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL, -- 'login_success', 'login_failed', 'locked_out', 'unauthorized_role_attempt'
  email VARCHAR(150),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.admin_security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_event ON public.admin_security_logs(event_type);

ALTER TABLE public.admin_security_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view security logs" ON public.admin_security_logs;
CREATE POLICY "Admins can view security logs" ON public.admin_security_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "System can insert security logs" ON public.admin_security_logs;
CREATE POLICY "System can insert security logs" ON public.admin_security_logs
  FOR INSERT WITH CHECK (true);

-- ২. ZERO-TRUST ADMIN ROLE VERIFICATION RPC (হার্ডওয়্যার লেভেলে রোল যাচাই)
CREATE OR REPLACE FUNCTION public.verify_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
