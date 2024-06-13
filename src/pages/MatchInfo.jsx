import { useNavigate } from "react-router-dom"
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useLocation } from "react-router-dom";
import MatchDetails from "../components/MatchDetails";
import { useState, useEffect } from "react";
import { getOtherPrediction } from "../services/matchesService";

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

    return (
        <>
            <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-8 font-manrope '>
            <div>
                <div
                onClick={backNavigate}
                className="flex flex-row items-center text-white hover:scale-110">
                <MdOutlineArrowBackIos />Powrót</div>
            </div>
            <div className="mt-5 text-white uppercase text-sm tracking-wide">Informacje o meczu</div>
            <div className="mt-5">
                <MatchDetails
                group={matchData.group}
                team_one_name={matchData.team_one.name}
                team_one_flag={matchData.team_one.flag}
                team_two_name={matchData.team_two.name}
                team_two_flag={matchData.team_two.flag}
                />
            </div>
            <div className="mt-5 text-white uppercase text-sm tracking-wide">Typy pozostałych graczy</div>
            <div className="text-white">
            {othersPredictions.map((otherPrediction, index) => (
            <div key={index}>
                <div>{otherPrediction.result}</div>
            </div>
            ))}
          </div>
            </div>
       </>
    )
}
