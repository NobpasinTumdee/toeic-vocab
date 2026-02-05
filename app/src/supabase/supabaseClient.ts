import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_REACT_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_REACT_SUPABASE_KEY
// console.log(supabaseUrl, supabaseKey)
export const supabase = createClient(String(supabaseUrl), String(supabaseKey))
