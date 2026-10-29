CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  code text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT 'Untitled course',
  department text NOT NULL DEFAULT '',
  semester text NOT NULL DEFAULT '',
  credits text NOT NULL DEFAULT '',
  regulation text NOT NULL DEFAULT '',
  preamble text NOT NULL DEFAULT '',
  prerequisites jsonb NOT NULL DEFAULT '[]'::jsonb,
  outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  units jsonb NOT NULL DEFAULT '[]'::jsonb,
  textbooks jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_filename text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.courses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.courses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.courses FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.courses FOR DELETE TO authenticated USING (auth.uid() = user_id);