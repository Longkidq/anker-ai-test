import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vcgdnhfpvqaurflxzyzf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZ2RuaGZwdnFhdXJmbHh6eXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMDQ2OTIsImV4cCI6MjA3ODg4MDY5Mn0.Htk_XIO4-8xkQymlMReHutkYMG9AFV2FvJD5_OH79lg'

// 創建 Supabase 客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

