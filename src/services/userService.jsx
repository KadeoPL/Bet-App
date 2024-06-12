import { supabase } from '../utils/supabaseClient'
import axios from 'axios'

export async function addUser(id, login, password, isAdmin) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id: id, login: login, password: password, isAdmin: isAdmin, points: 0}])
  
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

  export async function getUsersToScoreboard() {
    try {
        const response = await axios.get(`https://bet-app-livid.vercel.app/api/users`);
        const users = response.data;
        return users.data
    } catch (error) {
      console.log(error)
    }
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