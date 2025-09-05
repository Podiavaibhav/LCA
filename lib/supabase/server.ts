import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nnaljnsdzxvfcxsqvas.supabase.co"
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uYWxqbnNkenF2ZmN4c3F2YXMiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzI1NTI5NzMxLCJleHAiOjIwNDExMDU3MzF9.dL52oIe58CyTp7IalL3vBCoHryY8AA8hfg_f4jKprjg"

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase environment variables are not configured')
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}
