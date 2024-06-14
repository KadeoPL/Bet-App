import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { getUsersToScoreboard } from "../services/userService";

export default function Array() {
  const [othersUsers, setOthersUsers] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUsers = await getUsersToScoreboard();
        setOthersUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-white font-bold text-4xl font-manrope mb-8">Tabela wyników</h1>
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
            {othersUsers.map((otherUser, index) => (
              <tr key={index} className={`text-white text-sm md:text-xl font-manrope font-medium text-center bg-opacity-50 ${index % 2 === 0 ? "bg-blue" : "bg-darkblue"}`}>
                <td className={`px-4 py-2 w-1/4 ${user.login === otherUser.login ? 'font-bold text-yellow' : 'font-medium'}`}>{index + 1}</td>
                <td className={`px-4 py-2 w-1/2 ${user.login === otherUser.login ? 'font-bold text-yellow' : 'font-medium'}`}>{otherUser.login}</td>
                <td className={`px-4 py-2 w-1/4 ${user.login === otherUser.login ? 'font-bold text-yellow' : 'font-medium'}`}>{otherUser.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
