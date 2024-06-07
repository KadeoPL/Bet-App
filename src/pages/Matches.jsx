import { useEffect, useState } from "react"
import { getMatches } from "../services/matchesService"

export default function Matches(){
    const [matches, setMatches] = useState([])
    
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const fetchedMatches = await getMatches();
                setMatches(fetchedMatches);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        fetchMatches();
    }, [])
    
    return(
        <>
            <div>
                {matches.map(match => (
                    <div key={match.id} className="flex flex-row">
                        <div className="mr-10">
                            {match.team_one}
                        </div>
                        <div className="mr-10">vs.</div>
                        <div>
                            {match.team_two}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}