import { useEffect, useState } from "react";
import { getMatches } from "../services/matchesService.jsx";
import SidebarNav from "../components/Sidebar";
import MatchBetForm from "../components/MatchBetForm";

export default function Matches(){
    const [matches, setMatches] = useState([]);
    
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
    }, []);
    
    return (
        <>
            <SidebarNav />
            <div className="flex flex-col items-center bg-blue bg-bgmain bg-blend-multiply bg-top bg-no-repeat bg-fixed gap-x-9 gap-y-5 pt-8 md:flex-row md:flex-wrap md:justify-center">
                {matches.map(match => (
                    <div key={match.id}>
                        <MatchBetForm matchData={match} />
                    </div>
                ))}
            </div>
        </>
    );
}
