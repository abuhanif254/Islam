-- ===========================================================================
-- ইসলাম পোর্টাল (Islam Portal) — অথ, রিঅ্যাকশন ও কমেন্টস মাইগ্রেশন স্ক্রিপ্ট
-- এই স্ক্রিপ্টটি শুধুমাত্র নতুন টেবিল ও পলিসিগুলো সংযুক্ত করবে
-- ===========================================================================

-- 1. USER PROFILES TABLE (Supabase auth.users এর সাথে সংযুক্ত)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
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

-- 2. ARTICLE REACTIONS TABLE (লাইক ও ডিসলাইক)
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

-- 3. ARTICLE COMMENTS TABLE (প্রামাণ্য আলোচনা ও থ্রেডেড রিপ্লাই)
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

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
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

-- 5. UPDATED_AT TRIGGERS
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_comments_updated_at ON public.article_comments;
CREATE TRIGGER tr_comments_updated_at BEFORE UPDATE ON public.article_comments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
