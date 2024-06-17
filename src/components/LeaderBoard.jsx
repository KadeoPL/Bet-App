import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { getUsersToScoreboard } from "../services/userService";
import { BsFillTrophyFill } from "react-icons/bs";



export default function LeaderBoard() {
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

  const userFirstPlace = othersUsers[0];
  const userSecondPlace = othersUsers[1];
  const userThirdPlace = othersUsers[2];
  const remainingUsers = othersUsers.slice(3);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white font-bold text-4xl font-manrope mb-8 mt-4">Tabela wyników</h1>
      <div className="grid grid-cols-3 gap-2 text-white w-full max-w-4xl">
        <div className="flex flex-col items-center">
        {userSecondPlace && 
          <>
            <div>IMAGE</div>
            <div className="font-black">{userSecondPlace.login}</div>
            <div className="font-bold text-sm text-lightgray">{userSecondPlace.points} <span>pkt.</span></div>
            <div className="text-center flex flex-row items-center text-lightgray"><BsFillTrophyFill className="text-xs mr-1"/>1</div>
          </> 
        }
        </div>
        <div className="flex flex-col items-center">
        {userFirstPlace && 
          <>
            <div>IMAGE</div>
            <div className="font-black">{userFirstPlace.login}</div>
            <div className="font-bold text-sm text-yellow">{userFirstPlace.points} <span>pkt.</span></div>
            <div className="text-center flex flex-row items-center text-yellow"><BsFillTrophyFill className="text-xs mr-1"/>1</div>
          </> 
        }
        </div>
        <div className="flex flex-col items-center">
        {userThirdPlace && 
          <>
            <div>IMAGE</div>
            <div className="font-black">{userThirdPlace.login}</div>
            <div className="font-bold text-sm text-brown">{userThirdPlace.points} <span>pkt.</span></div>
            <div className="text-center flex flex-row items-center text-brown"><BsFillTrophyFill className="text-xs mr-1"/>1</div>
          </> 
        }
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}
