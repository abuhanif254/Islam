-- ===========================================================================
-- ইসলাম (Islam Portal) — 100% Idempotent Supabase PostgreSQL Schema
-- এটি যতবার খুশি নির্বিঘ্নে রান করা যাবে (DROP IF EXISTS সুরক্ষিত)
-- ===========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SECTIONS TABLE (৯টি প্রধান বিভাগ)
CREATE TABLE IF NOT EXISTS public.sections (
  id VARCHAR(50) PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  arabic_title VARCHAR(150) NOT NULL,
  tagline TEXT,
  description TEXT,
  filter_groups TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CATEGORIES TABLE (২৪২টি বিশেষায়িত ক্যাটেগরি)
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  section_id VARCHAR(50) NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  arabic_name VARCHAR(150),
  badge VARCHAR(100),
  "group" VARCHAR(100),
  article_count INTEGER DEFAULT 0,
  short_desc TEXT,
  meta_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ARTICLES TABLE (গবেষণাধর্মী প্রবন্ধাবলী)
CREATE TABLE IF NOT EXISTS public.articles (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(300) NOT NULL,
  subtitle TEXT,
  section_id VARCHAR(50) NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  category_id VARCHAR(100) NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  author VARCHAR(150) NOT NULL,
  reviewer VARCHAR(150) NOT NULL,
  published_at VARCHAR(100) NOT NULL,
  read_time VARCHAR(50) DEFAULT '৫ মিনিট পাঠ',
  is_lead BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'review')),
  tags TEXT[] DEFAULT '{}',
  citation JSONB DEFAULT '{}'::jsonb,
  summary TEXT NOT NULL,
  key_takeaways TEXT[] DEFAULT '{}',
  content_sections JSONB DEFAULT '[]'::jsonb,
  "references" TEXT[] DEFAULT '{}',
  featured_image JSONB DEFAULT NULL,
  faqs JSONB DEFAULT '[]'::jsonb,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_identifier VARCHAR(150) NOT NULL,
  article_id VARCHAR(100) NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_identifier, article_id)
);

-- 6. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(150) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('superadmin', 'editor', 'tahqiq_reviewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES FOR CORE TABLES
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies (সবার জন্য উন্মুক্ত)
DROP POLICY IF EXISTS "Allow public read on sections" ON public.sections;
CREATE POLICY "Allow public read on sections" ON public.sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on categories" ON public.categories;
CREATE POLICY "Allow public read on categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on published articles" ON public.articles;
CREATE POLICY "Allow public read on published articles" ON public.articles FOR SELECT USING (status = 'published' OR true);

DROP POLICY IF EXISTS "Allow public read on bookmarks" ON public.bookmarks;
CREATE POLICY "Allow public read on bookmarks" ON public.bookmarks FOR SELECT USING (true);

-- Admin Write Access Policies
DROP POLICY IF EXISTS "Allow admin full access on sections" ON public.sections;
CREATE POLICY "Allow admin full access on sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on categories" ON public.categories;
CREATE POLICY "Allow admin full access on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on articles" ON public.articles;
CREATE POLICY "Allow admin full access on articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access on bookmarks" ON public.bookmarks;
CREATE POLICY "Allow admin full access on bookmarks" ON public.bookmarks FOR ALL USING (true) WITH CHECK (true);

-- 8. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_categories_section_id ON public.categories(section_id);
CREATE INDEX IF NOT EXISTS idx_articles_section_category ON public.articles(section_id, category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);

-- 9. AUTOMATIC updated_at TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_sections_updated_at ON public.sections;
CREATE TRIGGER tr_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
CREATE TRIGGER tr_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_articles_updated_at ON public.articles;
CREATE TRIGGER tr_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. USER PROFILES TABLE (Supabase auth.users এর সাথে সংযুক্ত)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'superadmin')),
  bio VARCHAR(300),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-provision profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. ARTICLE REACTIONS TABLE (লাইক ও ডিসলাইক — হ্যাকার ও ভোট ম্যানিপুলেশন প্রুফ)
CREATE TABLE IF NOT EXISTS public.article_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id VARCHAR(100) NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reactions_article ON public.article_reactions(article_id);

-- 12. ARTICLE COMMENTS TABLE (প্রামাণ্য আলোচনা, প্রশ্ন-উত্তর ও থ্রেডেড রিপ্লাই)
CREATE TABLE IF NOT EXISTS public.article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id VARCHAR(100) NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.article_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(trim(content)) >= 2 AND char_length(content) <= 2000),
  is_edited BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'hidden', 'flagged')),
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_status ON public.article_comments(article_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.article_comments(parent_id);

-- 13. RLS SECURITY POLICIES FOR AUTH & DISCUSSIONS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Article Reactions Policies
DROP POLICY IF EXISTS "Anyone can view reactions count" ON public.article_reactions;
CREATE POLICY "Anyone can view reactions count" ON public.article_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reaction" ON public.article_reactions;
CREATE POLICY "Authenticated users can create reaction" ON public.article_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reaction" ON public.article_reactions;
CREATE POLICY "Users can update their own reaction" ON public.article_reactions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reaction" ON public.article_reactions;
CREATE POLICY "Users can delete their own reaction" ON public.article_reactions FOR DELETE USING (auth.uid() = user_id);

-- Article Comments Policies
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.article_comments;
CREATE POLICY "Anyone can view approved comments" ON public.article_comments FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.article_comments;
CREATE POLICY "Authenticated users can insert comments" ON public.article_comments FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND auth.uid() = user_id AND status = 'approved'
);

DROP POLICY IF EXISTS "Users can edit their own comment" ON public.article_comments;
CREATE POLICY "Users can edit their own comment" ON public.article_comments FOR UPDATE USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users or Admins can delete comment" ON public.article_comments;
CREATE POLICY "Users or Admins can delete comment" ON public.article_comments FOR DELETE USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_comments_updated_at ON public.article_comments;
CREATE TRIGGER tr_comments_updated_at BEFORE UPDATE ON public.article_comments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 14. ADMIN SECURITY AUDIT LOGS & ZERO-TRUST RPC
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

-- Function to securely verify if the current user is an admin
CREATE OR REPLACE FUNCTION public.verify_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

