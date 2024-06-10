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
            <div className="flex flex-col md:flex-row md:flex-wrap">
                {matches.map(match => (
                    <div key={match.id}>
                        <MatchBetForm matchData={match} />
                    </div>
                ))}
            </div>
        </>
    );
}
