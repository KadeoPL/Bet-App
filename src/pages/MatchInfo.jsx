import { useNavigate } from "react-router-dom"
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOtherPrediction } from "../services/matchesService";
import MatchWithoutPredictions from "../components/MatchWithoutPredictions";

export default function MatchInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const matchData = location.state
    const [othersPredictions, setOthersPredictions] = useState([])

    const backNavigate = () => {
        navigate('/matches')
    }

    useEffect(() => {
        async function fetchData() {
          try {
            const fetchedPredictions = await getOtherPrediction(matchData.id);
            setOthersPredictions(fetchedPredictions);
          } catch (error) {
            console.error("Error fetching users:", error);
          }
        }
        fetchData();
      }, [matchData.id]);

    const getResultDetails = (result) => {
      switch (result) {
        case 0:
          return { bgColor: 'bg-black', text: 'Remis' };
        case 1:
          return { bgColor: 'bg-green', text: matchData.team_one.name };
        case 2:
          return { bgColor: 'bg-green', text: matchData.team_two.name };
        default:
          return { bgColor: '', text: '' };
      }
    };

    return (
        <>
            <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-8 font-manrope'>
            <div>
                <div
                onClick={backNavigate}
                className="flex flex-row items-center text-white cursor-pointer">
                <MdOutlineArrowBackIos /></div>
            </div>
            
            <div className=" flex flex-col items-center">
            <div className="flex flex-row items-start w-full">
            <div className="mt-5 text-white uppercase text-sm tracking-wide">Informacje o meczu</div>
            </div>
            <div className="mt-5">
                <MatchWithoutPredictions match={matchData} />
            </div>
            <div className="flex flex-row items-start w-full">
            <div className="mt-8 text-white uppercase text-sm tracking-wide mb-5">Typy pozostałych graczy</div>
            </div>
            <div className="text-white">
            {othersPredictions.map((otherPrediction, index) => {
              const { bgColor, text } = getResultDetails(otherPrediction.result);
              return (
                <div className='w-72' key={index}>
                  <div className="flex flex-row justify-between items-center py-3 px-3 bg-blue bg-opacity-50 rounded-xl mb-3">
                    <div className="font-bold text-xs">{otherPrediction.user_id.login}</div>
                    <div className="flex flex-row text-sm">
                      <div className="bg-white text-black px-2 py-1 font-bold rounded-lg mr-2">
                        {otherPrediction.team_one_goals}:{otherPrediction.team_two_goals}
                      </div>
                      <div className={`${bgColor} text-white px-3 py-1 rounded-lg`}>{text}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
          </div>
       </>
    )
}
