import { supabase } from '../utils/supabaseClient'

  export async function getMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
  
    if (error) {
      throw error
    }
    return data
  }