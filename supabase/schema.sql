-- ═══════════════════════════════════════════════════════════
-- MICo Platform — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  title TEXT,
  skills TEXT[] DEFAULT '{}',
  industry_alignment JSONB DEFAULT '[]',
  open_to_relocate BOOLEAN DEFAULT true,
  open_to_hybrid BOOLEAN DEFAULT true,
  available_for_referrals BOOLEAN DEFAULT false,
  resume_url TEXT,
  resume_parsed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  location_type TEXT CHECK (location_type IN ('detroit-metro', 'ann-arbor', 'grand-rapids', 'upper-peninsula', 'virtual')),
  event_type TEXT CHECK (event_type IN ('hackathon', 'networking', 'workshop', 'panel')),
  event_date TIMESTAMPTZ,
  ai_summary JSONB DEFAULT '{}',
  source TEXT CHECK (source IN ('ibm_rpa', 'user_submitted', 'api')) DEFAULT 'user_submitted',
  match_score INTEGER,
  rsvp_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RSVPs
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- 4. Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  location TEXT,
  location_filter TEXT CHECK (location_filter IN ('detroit-metro', 'ann-arbor', 'grand-rapids', 'remote-mi')),
  salary_range TEXT,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  match_score INTEGER DEFAULT 0,
  match_reasons TEXT[] DEFAULT '{}',
  skill_gaps TEXT[] DEFAULT '{}',
  referral_available BOOLEAN DEFAULT false,
  referral_contact_name TEXT,
  referral_contact_id UUID,
  source_url TEXT,
  posted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bookmarked Jobs
CREATE TABLE IF NOT EXISTS bookmarked_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- 6. Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES profiles(id),
  requester_name TEXT,
  requester_title TEXT,
  requester_skills TEXT[] DEFAULT '{}',
  insider_id UUID NOT NULL REFERENCES profiles(id),
  insider_name TEXT,
  insider_title TEXT,
  job_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT CHECK (status IN ('analyzing', 'drafting', 'pending_approval', 'approved', 'declined', 'referred_to_hr')) DEFAULT 'analyzing',
  match_score INTEGER DEFAULT 0,
  ai_pitch TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Resume Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Profiles: public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles: own update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Events: public read, authenticated insert
CREATE POLICY "Events: public read" ON events FOR SELECT USING (true);
CREATE POLICY "Events: auth insert" ON events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RSVPs: own read/write
CREATE POLICY "RSVPs: own read" ON rsvps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "RSVPs: own insert" ON rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "RSVPs: own delete" ON rsvps FOR DELETE USING (auth.uid() = user_id);

-- Jobs: public read
CREATE POLICY "Jobs: public read" ON jobs FOR SELECT USING (true);

-- Bookmarks: own read/write
CREATE POLICY "Bookmarks: own read" ON bookmarked_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Bookmarks: own insert" ON bookmarked_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Bookmarks: own delete" ON bookmarked_jobs FOR DELETE USING (auth.uid() = user_id);

-- Referrals: involved parties can read, requester can insert, insider can update status
CREATE POLICY "Referrals: involved read" ON referrals FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = insider_id);
CREATE POLICY "Referrals: requester insert" ON referrals FOR INSERT
  WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Referrals: insider update" ON referrals FOR UPDATE
  USING (auth.uid() = insider_id OR auth.uid() = requester_id);

-- Resume bucket policy
CREATE POLICY "Resumes: own upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Resumes: own read" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
