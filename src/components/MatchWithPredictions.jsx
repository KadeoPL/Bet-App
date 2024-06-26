/* eslint-disable react/prop-types */
import { useState, useEffect, useContext} from 'react';
import { UserContext } from "../context/UserContext";
import { addPrediction } from "../services/matchesService";
import { useNavigate } from 'react-router-dom';
import { checkIfMatchStarted } from '../utils/checkIfMatchStarted';
import MatchTime from './Match/MatchTime';
import MatchHeader from './Match/MatchHeader';
import TeamInfo from './Match/TeamInfo';
import MatchSubmitButton from './Match/MatchSubmitButton';
import MatchPredicionRadioForm from './Match/MatchPredictionRadioForm';
import MatchPredictionInputForm from './Match/MatchPredictionInputForm';

export default function MatchWithPredictions({ matchData, predictionData }) {
    const { user } = useContext(UserContext);
    
    const [prediction, setPrediction] = useState({
        match_id: null,
        user_id: null,
        team_one_goals: '',
        team_two_goals: '',
        result: null,
    });
    const [match, setMatch] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Wysyłanie...');
    const [isStartMatch, setIsStartMatch] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();

    useEffect(() => {
        setMatch(matchData);
        setIsStartMatch(checkIfMatchStarted(matchData));
    
        if (predictionData) {
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

        // if (!prediction.team_one_goals || !prediction.team_two_goals || prediction.result === null) {
        //     setErrorMessage('Wszystkie pola muszą być wypełnione.');
        //     return;
        // }
        
        if (!isStartMatch) {
            setLoadingText('Wysyłanie...');
            setIsLoading(true);
    
            addPrediction(prediction)
                .then(() => {
                    setLoadingText('Wysłano');
                    setErrorMessage('');
                })
                .catch((error) => {
                    console.error('Błąd podczas dodawania predykcji:', error);
                    setErrorMessage(`${error}`);
                })
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    }
    
    function handleInputChange(event) {
        const { name, value } = event.target;
        setPrediction(prev => ({
            ...prev,
            [name]: name === 'result' ? parseInt(value) : value
        }));
    }
    
    const navigateToMatch = () => {
        navigate('/matchinfo', { state: { id: match.id, team_one: match.team_one, team_two: match.team_two, group: match.group, time:match.time, date: match.date} });
    }

    return (
        <>
        <div className='font-manrope flex flex-col bg-blue bg-opacity-50 w-72 rounded-xl overflow-hidden shadow-2xl text-white'>
            {(match.group && match.date) &&
                <MatchHeader
                    group={match.group}
                    date={match.date} />}
            <div className="px-6 py-3">
                {match.time &&
                    <MatchTime
                        time={match.time} />}
                {(match.team_one && match.team_two) &&
                    <TeamInfo
                        team_one={match.team_one}
                        team_two={match.team_two}/>}
                <form className='flex flex-col items-center' onSubmit={onSubmit}>
                    <fieldset disabled={isStartMatch ? 'disabled' : ''}>
                        {prediction &&
                            <MatchPredictionInputForm
                                prediction={prediction}
                                onChange={handleInputChange}/>}
                    {(match.id && ((prediction.result === null) || !(prediction.result === undefined))) && 
                        <MatchPredicionRadioForm
                            matchId={match.id}
                            result={prediction.result}
                            team_one={match.team_one}
                            team_two={match.team_two}
                            onChange={handleInputChange} />}
                    {errorMessage && <div className=" bg-red bg-opacity-50 text-white text-center text-xs mb-4 rounded py-2 px-2">{errorMessage}</div>}
                    {match.group && 
                        <MatchSubmitButton
                            group={match.group}
                            isStartMatch={isStartMatch}
                            isLoading={isLoading}
                            loadingText={loadingText}
                            onClick={navigateToMatch}/>}
                    </fieldset>
                </form>
            </div>
        </div>
        </>
    );
}
