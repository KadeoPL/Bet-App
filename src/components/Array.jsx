import { useState, useEffect } from "react"
import { getUsers } from "../services/userService"

export default function Array(){
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
        </>

    )
}