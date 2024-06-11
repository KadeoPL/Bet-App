import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { getMatches, getPrediction } from "../services/matchesService.jsx";
import SidebarNav from "../components/Sidebar";
import MatchBetForm from "../components/MatchBetForm";

export default function Matches() {
    const { user } = useContext(UserContext);
    const [matches, setMatches] = useState([]);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        const fetchMatchesAndPredictions = async () => {
            try {
                const fetchedMatches = await getMatches();
                setMatches(fetchedMatches);
                
                if (user && user.id) {
                    const fetchedPrediction = await getPrediction(user.id);
                    setPrediction(fetchedPrediction);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchMatchesAndPredictions();
    }, [user]);

    return (
        <>
            <SidebarNav />
            <div className="flex flex-col items-center bg-blue bg-bgmain bg-blend-multiply bg-top bg-no-repeat bg-fixed gap-x-9 gap-y-5 pt-8 md:flex-row md:flex-wrap md:justify-center">
                {matches.map(match => (
                    <div key={match.id}>
                        <MatchBetForm matchData={match} predictionData={prediction} />
                    </div>
                ))}
            </div>
        </>
    );
}
