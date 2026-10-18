-- ===========================================================================
-- ইসলাম পোর্টাল — সুপার অ্যাডমিন নিরাপত্তা ও অ্যাকাউন্ট প্রভিশনিং স্ক্রিপ্ট
-- অ্যাডমিন ইমেইল: mohammadbitullah@gmail.com
-- ===========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ০. profiles_role_check কনস্ট্রেইন্টে 'superadmin' সাপোর্ট নিশ্চিত করা
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'moderator', 'admin', 'superadmin'));

-- ১. auth.users টেবিলে নিরাপদ অ্যাডমিন অ্যাকাউন্ট তৈরি / আপডেট
DO $$
DECLARE
  v_user_id UUID;
  v_encrypted_pw TEXT;
BEGIN
  -- পাসওয়ার্ড এনক্রিপশন (bcrypt)
  v_encrypted_pw := crypt(',.,.25ab2292,,', gen_salt('bf'));

  -- বিদ্যমান ইউজার অনুসন্ধান
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'mohammadbitullah@gmail.com';

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'mohammadbitullah@gmail.com',
      v_encrypted_pw,
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"মুহাম্মদ বাইতুল্লাহ","role":"superadmin"}'::jsonb,
      NOW(),
      NOW(),
      'authenticated',
      'authenticated',
      encode(gen_random_bytes(32), 'hex')
    );
  ELSE
    -- পাসওয়ার্ড ও মেটাডাটা আপডেট
    UPDATE auth.users
    SET
      encrypted_password = v_encrypted_pw,
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      raw_user_meta_data = '{"full_name":"মুহাম্মদ বাইতুল্লাহ","role":"superadmin"}'::jsonb,
      updated_at = NOW()
    WHERE id = v_user_id;
  END IF;

  -- ২. profiles টেবিলে সুপার অ্যাডমিন পারমিশন সেট
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    is_verified,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'মুহাম্মদ বাইতুল্লাহ (সুপার অ্যাডমিন)',
    'superadmin',
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'superadmin',
    is_verified = TRUE,
    full_name = 'মুহাম্মদ বাইতুল্লাহ (সুপার অ্যাডমিন)',
    updated_at = NOW();

  RAISE NOTICE 'Superadmin user mohammadbitullah@gmail.com successfully provisioned with ID %', v_user_id;
END $$;

-- ৩. RLS পলিসি হার্ডেনিং: শুধুমাত্র role IN ('admin', 'superadmin') ডেটাবেজে রাইট করতে পারবে
DROP POLICY IF EXISTS "Allow admin full access on sections" ON public.sections;
CREATE POLICY "Allow admin full access on sections" ON public.sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "Allow admin full access on categories" ON public.categories;
CREATE POLICY "Allow admin full access on categories" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "Allow admin full access on articles" ON public.articles;
CREATE POLICY "Allow admin full access on articles" ON public.articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- ৪. অপরিবর্তনীয় সিকিউরিটি অডিট লগ টেবিল
CREATE TABLE IF NOT EXISTS public.admin_security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  email VARCHAR(150),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON public.admin_security_logs(created_at DESC);

ALTER TABLE public.admin_security_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view security logs" ON public.admin_security_logs;
CREATE POLICY "Admins can view security logs" ON public.admin_security_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

DROP POLICY IF EXISTS "System can insert security logs" ON public.admin_security_logs;
CREATE POLICY "System can insert security logs" ON public.admin_security_logs
  FOR INSERT WITH CHECK (true);

-- ৫. ZERO-TRUST ADMIN ROLE VERIFICATION RPC
CREATE OR REPLACE FUNCTION public.verify_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
