import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { addPrediction } from "../services/matchesService";
import ClockIcon from "../img/icons/clock.svg"

export default function MatchBetForm({ matchData }) {
    const { user } = useContext(UserContext);
    const [match, setMatch] = useState({});
    const [bgcolor, setBgColor] = useState('');
    const [textColor, setTextColor] = useState('');
    const [prediction, setPrediction] = useState({
        match_id: null,
        user_id: null,
        team_one_goals: '',
        team_two_goals: '',
        result: null,
    });
    const [dateError, setDateError] = useState('');

    function setColorFromGroup(group) {
        switch (group) {
            case 'Group A':
                setBgColor('bg-green');
                setTextColor('text-white');
                break;
            
            case 'Group B':
                setBgColor('bg-darkblue');
                setTextColor('text-white');
                break;

            case 'Group C':
                setBgColor('bg-red');
                setTextColor('text-white');
                break; 
                
            case 'Group D':
                setBgColor('bg-yellow');
                setTextColor('text-black');
                break;
            
            case 'Group E':
                setBgColor('bg-lightblue');
                setTextColor('text-black');
                break;
                
            case 'Group F':
                setBgColor('bg-black');
                setTextColor('text-white');
                break;
            
            default:
                setBgColor('bg-blue');
                setTextColor('text-white');
                break;
        }
    }

    const predictionData = {
        team_one_goals: 5,
        team_two_goals: 5,
        result: 1,
    }

    useEffect(() => {
        setMatch(matchData);
        setColorFromGroup(matchData.group);
        if(predictionData) {
            if(predictionData.team_one_goals){
                setPrediction(prev => ({
                    ...prev,
                    match_id: matchData.id,
                    user_id: user.id,
                    team_one_goals: predictionData.team_one_goals,
                }));    
            }
            if(predictionData.team_two_goals){
                setPrediction(prev => ({
                    ...prev,
                    match_id: matchData.id,
                    user_id: user.id,
                    team_two_goals: predictionData.team_two_goals,
                }));    
            }
            if(predictionData.result){
                setPrediction(prev => ({
                    ...prev,
                    match_id: matchData.id,
                    user_id: user.id,
                    result: predictionData.result,
                }));    
            }
        } else {
            setPrediction(prev => ({
                ...prev,
                match_id: matchData.id,
                user_id: user.id,
            }));
        }
    }, [matchData, user]);

    function onSubmit(event) {
        event.preventDefault();
        const today = new Date();
        const matchDate = new Date(match.date);
        setDateError('');

        if (today > matchDate) {
            setDateError('Nie możesz obstawić tego meczu');
        } else {
            addPrediction(prediction);
        }
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setPrediction({
            ...prediction,
            [name]: name === 'result' ? parseInt(value) : value
        });
    }

    return (
        <div className='font-manrope flex flex-col bg-blue bg-opacity-50 w-72 rounded-xl overflow-hidden shadow-2xl text-white'>
            <div className={`${bgcolor} flex flex-row justify-between ${textColor} py-2 px-4`}>
                <div className="font-teko text-2xl font-bold">{match.group}</div>
                <div className="flex flex-col justify-center text-xs font-medium">{match.date}</div>
            </div>
            <div className="px-6 py-3">
                <div className="flex flex-row justify-center items-center mb-4">
                    <img src={ClockIcon} alt="Ikona" className="inline-block mr-2" />
                    {match.time}
                </div>
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col items-center">
                        <div className={`${bgcolor} h-14 aspect-square rounded-full`}>
                            <img src="src/img/flags/Albania.png"></img>
                        </div>
                        <div className="mt-2">
                            <span className='font-light'>{match.team_one && match.team_one.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end text-xs px-7">
                        vs.
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`${bgcolor} h-14 aspect-square rounded-full`}>
                            <img src={match.team_two && match.team_two.flag}></img>
                        </div>
                        <div className="mt-2">
                            <span className='font-light'>{match.team_two && match.team_two.name}</span>
                        </div>
                    </div>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-row justify-center gap-4 py-4">
                        <div className="flex flex-col text-center">
                            <div className="flex flex-row justify-center">
                                <input
                                    className="transition ease-in-out text-center text-5xl font-bold text-darkblue bg-white w-16 aspect-square rounded-md hover:scale-110"
                                    type="number"
                                    name="team_one_goals"
                                    value={prediction.team_one_goals}
                                    placeholder="+"
                                    onChange={handleInputChange}
                                />
                                <div className="text-5xl px-7">:</div>
                                <input
                                    className="transition ease-in-out text-center text-5xl font-bold text-darkblue bg-white w-16 aspect-square rounded-md hover:scale-110"
                                    type="number"
                                    name="team_two_goals"
                                    value={prediction.team_two_goals}
                                    placeholder="+"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-center mb-4">
                        <div className="mb-4 mt-6">Wytypuj zwycięzce:</div>
                        <div className="flex flex-row text-sm justify-center">
                            <input
                                className="appearance-none"
                                type="radio"
                                name="result"
                                id={`${match.id}_team_one`}
                                value="1"
                                checked={prediction.result === 1}
                                onChange={handleInputChange}
                            />
                            <label
                                className={`mr-4 border-2 rounded-lg p-2 active:border-yellow hover:bg-yellow hover:text-black hover:border-yellow ${prediction.result === 1 ? 'border-yellow text-yellow' : 'border-white'}`}
                                htmlFor={`${match.id}_team_one`}
                            >
                                {match.team_one && match.team_one.name}
                            </label>
                            <input
                                className="appearance-none"
                                type="radio"
                                name="result"
                                id={`${match.id}_draw`}
                                value="0"
                                checked={prediction.result === 0}
                                onChange={handleInputChange}
                            />
                            <label
                                className={`mr-4 border-2 rounded-lg p-2 active:border-yellow hover:bg-yellow hover:text-black hover:border-yellow ${prediction.result === 0 ? 'border-yellow text-yellow' : 'border-white'}`}
                                htmlFor={`${match.id}_draw`}
                            >
                                Remis
                            </label>
                            <input
                                className="appearance-none"
                                type="radio"
                                name="result"
                                id={`${match.id}_team_two`}
                                value="2"
                                checked={prediction.result === 2}
                                onChange={handleInputChange}
                            />
                            <label
                                className={`border-2 rounded-lg p-2  active:border-yellow hover:bg-yellow hover:text-black hover:border-yellow ${prediction.result === 2 ? 'border-yellow text-yellow' : 'border-white'}`}
                                htmlFor={`${match.id}_team_two`}
                            >
                                {match.team_two && match.team_two.name}
                            </label>
                        </div>
                    </div>
                    <div className="text-center">
                        <input
                            className={`${bgcolor} ${textColor} transition ease-in-out px-4 py-2 rounded-lg hover:scale-110 `}
                            type="submit"
                            value="Zatwierdź"
                        />
                        {dateError && <p className="text-red">{dateError}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}
