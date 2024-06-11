import { useState, useEffect } from "react";
import { getUsers } from "../services/userService";

export default function Array() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchData();
  }, []);
  console.log(users);

  return (
    <div>
      <h1 className="text-white font-bold text-5xl font-manrope">Lista Użytkowników:</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-black">
          <thead className="text-white">
            <tr className="text-xl">
              <th className="px-4 py-2 bg-yellow">Pozycja</th>
              <th className="px-4 py-2 bg-green">Nick</th>
              <th className="px-4 py-2 bg-red">Punkty</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-blue" : "bg-darkblue"}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.login}</td>
                <td className="px-4 py-2">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
