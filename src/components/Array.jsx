import { useState, useEffect } from "react";
import { getUsersToScoreboard } from "../services/userService";

export default function Array() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUsers = await getUsersToScoreboard();
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
      <h1 className="text-white font-bold text-5xl font-manrope mb-8">Tabela wyników</h1>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse">
          <thead className="text-white">
            <tr className="text-xs md:text-xl">
              <th className="px-4 py-2 bg-yellow">Nr.</th>
              <th className="px-4 py-2 bg-green">Nick</th>
              <th className="px-4 py-2 bg-red">Punkty</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className={`text-white text-sm md:text-xl font-manrope text-center bg-opacity-50 ${index % 2 === 0 ? "bg-blue" : "bg-darkblue"}`}>
                <td className="px-4 py-2 w-1/4">{index + 1}</td>
                <td className="px-4 py-2 w-1/2">{user.login}</td>
                <td className="px-4 py-2 w-1/4">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
