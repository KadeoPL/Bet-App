import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vfojnnjjjcsynbvvxkbu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmb2pubmpqamNzeW5idnZ4a2J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzcwNTU5NCwiZXhwIjoyMDMzMjgxNTk0fQ.Jr6pkYY5wM4QT_T03SHm4AYL8Z6jSg75z_BMAjfvrzA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)