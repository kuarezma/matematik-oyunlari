import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pdxntkpanuwucawqexio.supabase.co'
const supabaseAnonKey = 'sb_publishable_qbyj9oLcPgL-yiYLiihoIA_lhN6Klfo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)