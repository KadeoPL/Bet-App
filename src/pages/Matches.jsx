import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { getMatches, getPrediction } from "../services/matchesService.jsx";
import SidebarNav from "../components/Sidebar";
import MatchBetForm from "../components/MatchBetForm";

export default function Matches() {
    const { user } = useContext(UserContext);
    const [matches, setMatches] = useState([]);
    const [predictions, setPredictions] = useState([]);
    
    useEffect(() => {
        if (user && user.id) {
            const fetchMatchesAndPredictions = async () => {
                try {
                    const fetchedMatches = await getMatches();
                    setMatches(fetchedMatches);
                    const fetchedPredictions = await getPrediction(user.id);
                    setPredictions(fetchedPredictions);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchMatchesAndPredictions();
        }
    }, [user]);

    return (
        <>
            <SidebarNav />
            <div className="flex flex-col items-center bg-blue bg-bgmain bg-blend-multiply bg-top bg-no-repeat bg-cover bg-fixed gap-x-9 gap-y-5 pt-8 md:flex-row md:flex-wrap md:justify-center">
                {matches.map(match => {
                    const matchPrediction = predictions.find(prediction => prediction.match_id === match.id);
                    return (
                        <div key={match.id}>
                            <MatchBetForm matchData={match} predictionData={matchPrediction} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
