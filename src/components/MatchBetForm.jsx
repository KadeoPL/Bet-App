import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { addPrediction } from "../services/matchesService";

export default function MatchBetForm({ matchData }) {
    const { user } = useContext(UserContext);
    const [match, setMatch] = useState({});
    const [prediction, setPrediction] = useState({
        match_id: null,
        user_id: null,
        team_one_goals: '',
        team_two_goals: '',
        result: null,
    });

    useEffect(() => {
        setMatch(matchData);
        setPrediction(prev => ({
            ...prev,
            match_id: matchData.id,
            user_id: user.id,
        }));
    }, [matchData, user]);

    function onSubmit(event) {
        event.preventDefault();
        addPrediction(prediction);
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setPrediction({
            ...prediction,
            [name]: value
        });
    }

    return (
        <div className='flex flex-row px-4 py-8 mb-8 w-96'>
            <form onSubmit={onSubmit}>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <div className="h-24 aspect-square bg-blue rounded-full"></div>
                        <div>
                            <span className="font-bold">{match.team_one && match.team_one.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4">
                            <div>
                                {match.date}
                            </div>
                            <div>
                                {match.time}
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-row">
                                <input
                                    className="text-center text-2xl text-white bg-blue w-12 aspect-square"
                                    type="number"
                                    name="team_one_goals"
                                    value={prediction.team_one_goals}
                                    placeholder="+"
                                    onChange={handleInputChange}
                                />
                                <div className="text-2xl px-4">:</div>
                                <input
                                    className="text-center text-2xl text-white bg-blue w-12 aspect-square"
                                    type="number"
                                    name="team_two_goals"
                                    value={prediction.team_two_goals}
                                    placeholder="+"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-24 aspect-square bg-blue rounded-full"></div>
                        <div>
                            <span className="font-bold">{match.team_two && match.team_two.name}</span>
                        </div>
                    </div>
                </div>
                <div className="text-center mb-4">
                    <div className="mb-2 mt-4">Wytypuj zwycięzcę:</div>
                    <input 
                        type="radio" 
                        name="result" 
                        id="team_one" 
                        value="1"
                        checked={prediction.result === '1'}
                        onChange={handleInputChange}
                    />
                    <label className="mr-4" htmlFor="team_one"> {match.team_one && match.team_one.name}</label>
                    <input 
                        type="radio" 
                        name="result" 
                        id="draw" 
                        value="0"
                        checked={prediction.result === '0'}
                        onChange={handleInputChange}
                    />
                    <label className="mr-4" htmlFor="draw"> Remis</label>
                    <input 
                        type="radio" 
                        name="result" 
                        id="team_two" 
                        value="2"
                        checked={prediction.result === '2'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="team_two"> {match.team_two && match.team_two.name}</label>
                </div>
                <div className="text-center">
                    <input 
                        className="bg-blue text-white px-4 py-2"
                        type="submit"
                        value="Zatwierdź"
                    />
                </div>
            </form>
        </div>
    );
}
