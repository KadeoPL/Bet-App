import { Link } from "react-router-dom"
import { MdOutlineArrowBackIos } from "react-icons/md";
import { useEffect, useState } from "react";
import { getMatches } from "../services/matchesService";

export default function PreviousMatches(){
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const fetchedMatch = await getMatches();
            setMatches(fetchedMatch);
        }
        fetchData();
    })

    return (
        <>
            <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-8 font-manrope'>
            <div>
            <Link to="/">
                <div
                className="flex flex-row items-center text-white cursor-pointer mb-10">
                <MdOutlineArrowBackIos />
                </div>
            </Link>   
            </div>
            <div>
                {matches && matches.map((match, index) => {
                    return (
                        <div key={index} className={`flex flex-col items-start text-white ${index % 2 ? 'bg-darkblue' : 'bg-blue'} bg-opacity-70 w-full py-4 mb-4 rounded-xl px-4`}>
                            <div className="flex flex-row items-center mb-2">
                                <div><img src={match.team_one.flag}  className="h-5 mr-3"/></div>
                                <div className="font-bold">{match.team_one.name}</div>
                            </div>
                            <div className="flex flex-row items-center">
                                <div><img src={match.team_two.flag} className="h-5 mr-3"/></div>
                                <div className="font-bold">{match.team_two.name}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            </div>
        </>
    )
}