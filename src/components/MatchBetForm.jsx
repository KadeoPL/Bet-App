/* eslint-disable react/prop-types */
import { useState, useEffect, useContext} from 'react';
import { UserContext } from "../context/UserContext";
import { addPrediction } from "../services/matchesService";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { setColorsByGroup } from '../utils/setColorsByGroup';
import { checkIfMatchStarted } from '../utils/checkIfMatchStarted';
import MatchTime from './Match/MatchTime';
import MatchHeader from './Match/MatchHeader';
import TeamInfo from './Match/TeamInfo';

export default function MatchBetForm({ matchData, predictionData }) {
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
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Wysyłanie...');
    const [isStartMatch, setIsStartMatch] = useState(false)
    
    const navigate = useNavigate();

    useEffect(() => {
        
        setMatch(matchData);
        setBgColor(setColorsByGroup(matchData.group).bgColor);
        setTextColor(setColorsByGroup(matchData.group).textColor);
        setIsStartMatch(checkIfMatchStarted(matchData));
        
        if (predictionData) {
            if(predictionData)
            setPrediction({
                match_id: matchData.id,
                user_id: user.id,
                team_one_goals: predictionData.team_one_goals,
                team_two_goals: predictionData.team_two_goals,
                result: predictionData.result,
            });
        } else {
            setPrediction(prev => ({
                ...prev,
                match_id: matchData.id,
                user_id: user.id,
            }));
        }
    }, [matchData, user, predictionData]);

    function onSubmit(event) {
        event.preventDefault();
        setDateError('');

        if (isStartMatch) {
            setDateError('Nie możesz obstawić tego meczu');
        } else {
            addPrediction(prediction);
            setIsLoading(true);
            setTimeout(() => {
                setLoadingText('Wysłano');
            }, 3000);
            
            setTimeout(() => {
                setIsLoading(false);
            }, 5000);
            setLoadingText('Wysyłanie...');
        }
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setPrediction({
            ...prediction,
            [name]: name === 'result' ? parseInt(value) : value
        });
    }

    const navigateToMatch = () => {
        navigate('/matchinfo', { state: { id: match.id, team_one: match.team_one, team_two: match.team_two, group: match.group} });
    }

    return (
        <div className='font-manrope flex flex-col bg-blue bg-opacity-50 w-72 rounded-xl overflow-hidden shadow-2xl text-white'>
            {(match.group && match.date) && <MatchHeader group={match.group} date={match.date} />}
            <div className="px-6 py-3">
                {match.time && <MatchTime time={match.time} />}
                {(match.team_one && match.team_two) && <TeamInfo team_one={match.team_one} team_two={match.team_two}/>}
                <form className='flex flex-col items-center' onSubmit={onSubmit}>
                    <fieldset disabled={isStartMatch ? 'disabled' : ''}>
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
                        <div className="mb-4 mt-6">Wytypuj zwycięzcę:</div>
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
                                className={`mr-4 border-2 rounded-lg p-2 hover:text-white hover:border-yellow ${prediction.result === 1 ? 'border-yellow bg-yellow text-black' : 'border-white'}`}
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
                                className={`mr-4 border-2 rounded-lg p-2 hover:text-white hover:border-yellow ${prediction.result === 0 ? 'border-yellow bg-yellow text-black' : 'border-white'}`}
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
                                className={`border-2 rounded-lg p-2 hover:text-white hover:border-yellow ${prediction.result === 2 ? 'border-yellow bg-yellow text-black' : 'border-white'}`}
                                htmlFor={`${match.id}_team_two`}
                            >
                                {match.team_two && match.team_two.name}
                            </label>
                        </div>
                    </div>
                    {!isStartMatch && 
                    <div className="text-center">
                        <input
                            className={`${bgcolor} ${textColor} transition ease-in-out px-4 py-2 rounded-lg hover:scale-110 `}
                            type="submit"
                            value={isLoading ? loadingText : "Obstaw"}
                        />
                        {dateError && <p className="text-red">{dateError}</p>}
                    </div>}
                    { isStartMatch &&
                        <div className='flex flex-row items-center text-sm justify-center mt-5 cursor-pointer text-yellow' onClick={navigateToMatch}>
                            <p className='mr-1'>Sprawdź jak typowali pozostali</p>
                            <FaArrowRight />
                        </div>
                    }
                    </fieldset>
                </form>
            </div>
        </div>
    );
}
