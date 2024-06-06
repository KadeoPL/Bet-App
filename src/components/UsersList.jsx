import { useState, useEffect } from "react"
import { getUsers } from "../services/userService"

export default function UsersList(){
    const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getUsers()
        setUsers(users)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <button>Dodaj użytkownika</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.login} {user.password} {user.isAdmin ? 'Admin' : 'Nie admin'} {(user.points === null) ? 'Nie podano wartości' : user.points}
          </li>
        ))}
      </ul>
    </div>
  )
}