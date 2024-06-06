import { supabase } from '../utils/supabaseClient'

export async function addUser() {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: 1, login: 'johndoe', password: 'abc123', isAdmin: true, points: 0}])
  
    if (error) {
      console.error('Error adding user:', error)
    } else {
      console.log('User added:', data)
    }
  }

  export async function getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
  
    if (error) {
      throw error
    }
    return data
  }

  export async function deleteUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)
  
    if (error) {
      throw error
    }
    return data
  }