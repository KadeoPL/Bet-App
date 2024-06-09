import { useState, useEffect } from "react"
import { getUsers } from "../services/userService"
import { addUser } from "../services/userService"
import { Button } from "flowbite-react";
import SidebarNav from "../components/Sidebar";

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
    <> 
      <SidebarNav />
      <h2 className="text-3xl font-bold underline">Users</h2>
      <Button pill gradientDuoTone="pinkToOrange" onClick={addUser}>Add user</Button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.login} {user.password} {user.isAdmin ? 'Admin' : 'Nie admin'} {(user.points === null) ? 'Nie podano wartości' : user.points}
          </li>
        ))}
      </ul>
    </>
  )
}