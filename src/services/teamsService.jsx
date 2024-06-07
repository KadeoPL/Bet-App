import { supabase } from '../utils/supabaseClient'

  export async function getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
  
    if (error) {
      throw error
    }
    return data
  }