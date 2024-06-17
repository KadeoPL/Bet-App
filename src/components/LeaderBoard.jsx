import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { getUsersToScoreboard } from "../services/userService";
import { BsFillTrophyFill } from "react-icons/bs";
import GoldBadge from "../img/icons/badge_gold.png"
import SilverBadge from "../img/icons/badge_silver.png"
import BrownBadge from "../img/icons/badge_brown.png"


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
        <div className="flex flex-col items-center translate-y-8">
        {userSecondPlace && 
          <>
            <div className="mb-4"><img src={SilverBadge} alt=""/></div>
            <div className="font-black">{userSecondPlace.login}</div>
            <div className="font-bold text-sm text-lightgray">{userSecondPlace.points} <span>pkt.</span></div>
            <div className="text-center flex flex-row items-center text-lightgray"><BsFillTrophyFill className="text-xs mr-1"/>{userSecondPlace.correct_exact_result}</div>
          </> 
        }
        </div>
        <div className="flex flex-col items-center">
        {userFirstPlace && 
          <>
            <div className="mb-4"><img src={GoldBadge} alt=""/></div>
            <div className="font-black">{userFirstPlace.login}</div>
            <div className="font-bold text-sm text-yellow">{userFirstPlace.points} <span>pkt.</span></div>
            <div className="text-center flex flex-row items-center text-yellow"><BsFillTrophyFill className="text-xs mr-1"/>{userFirstPlace.correct_exact_result}</div>
          </> 
        }
        </div>
        <div className="flex flex-col items-center translate-y-8">
        {userThirdPlace && 
          <>
            <div className="mb-4"><img src={BrownBadge} alt=""/></div>
            <div className="font-black">{userThirdPlace.login}</div>
            <div className="font-bold text-sm text-brown">{userThirdPlace.points} <span>pkt.</span></div>
            <div className="text-center flex flex-row items-center text-brown"><BsFillTrophyFill className="text-xs mr-1"/>{userThirdPlace.correct_exact_result}</div>
          </> 
        }
        </div>
      </div>
      <div className="flex flex-col flex-grow justify-center items-center w-full mt-12">
        {remainingUsers.map((userInArray, index) => {
          return (
            <div key={index} className={`grid grid-cols-6 text-white ${index % 2 ? 'bg-darkblue' : 'bg-blue'} bg-opacity-70 w-full py-4 mb-4 rounded-xl px-4` } >
              <div className={`${user && (userInArray.login === user.login) ? 'text-yellow' : 'text-white '}`}>{index + 4}.</div>
              <div className={`${user && (userInArray.login === user.login) ? 'text-yellow' : 'text-white'} font-bold col-span-3`}>{userInArray.login}</div>
              <div className={`${user && (userInArray.login === user.login) ? 'text-yellow' : 'text-lightgray'} flex flex-row items-center`}><BsFillTrophyFill className="text-xs mr-1"/>{userInArray.correct_exact_result}</div>
              <div className={`${user && (userInArray.login === user.login) ? 'text-yellow' : 'text-white'} font-bold`}>{userInArray.points} pkt.</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
