import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { getMatches, getPrediction } from "../services/matchesService.jsx";
import MatchWithPredictions from "../components/MatchWithPredictions.jsx";
import MobileNav from "../components/MobileNav.jsx"


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
            <MobileNav />
            <div className="flex flex-col items-center bg-blue bg-bgmain bg-blend-multiply bg-top bg-no-repeat bg-cover bg-fixed gap-x-9 gap-y-5 pt-8 md:flex-row md:flex-wrap md:justify-center last:pb-20">
                {matches.map(match => {
                    const matchPrediction = predictions.find(prediction => prediction.match_id === match.id);
                    return (
                        <div key={match.id}>
                            <MatchWithPredictions matchData={match} predictionData={matchPrediction} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
