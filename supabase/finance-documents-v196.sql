-- Apply only in Supabase SQL Editor when authenticated finance sync is desired.
CREATE TABLE IF NOT EXISTS public.finance_documents (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 payload jsonb NOT NULL DEFAULT '{}'::jsonb,
 revision integer NOT NULL DEFAULT 1 CHECK(revision>0),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT finance_document_size CHECK(octet_length(payload::text)<=2000000)
);
ALTER TABLE public.finance_documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.finance_documents FROM anon;
GRANT SELECT,INSERT,UPDATE ON public.finance_documents TO authenticated;
DROP POLICY IF EXISTS finance_select_own ON public.finance_documents;
DROP POLICY IF EXISTS finance_insert_own ON public.finance_documents;
DROP POLICY IF EXISTS finance_update_own ON public.finance_documents;
CREATE POLICY finance_select_own ON public.finance_documents FOR SELECT TO authenticated USING(user_id=(select auth.uid()));
CREATE POLICY finance_insert_own ON public.finance_documents FOR INSERT TO authenticated WITH CHECK(user_id=(select auth.uid()));
CREATE POLICY finance_update_own ON public.finance_documents FOR UPDATE TO authenticated USING(user_id=(select auth.uid())) WITH CHECK(user_id=(select auth.uid()));
-- No DELETE grant; remote financial records are protected from accidental deletion.
