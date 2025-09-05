import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nnaljnsdzxvfcxsqvas.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uYWxqbnNkenF2ZmN4c3F2YXMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNTUyOTczMSwiZXhwIjoyMDQxMTA1NzMxfQ.VKsafOPT7JZqL_-IuT4iH9BfDaJgH14BHnw2ZRT3ZY"

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured')
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
