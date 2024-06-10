import { useState, useEffect } from "react";

export default function MatchBetForm({ matchData }) {
    const [match, setMatch] = useState({});
    const [predicition, setPredicition] = useState({
        match_id: null,
        user_id: null,
        team_one_predicition_goals: null,
        team_two_predicition_goals: null,
        winner: null,
    })

    useEffect(() => {
        setMatch(matchData);
    }, [matchData]);

    function onSubmit(event) {
        event.preventDefault();
        console.log('Add result');
    }

    return (
        <div className='flex flex-col'>
            <div>
                <div>
                    Data: {match.date} | Godzina: {match.time}
                </div>
                <div>
                    <form>
                        <input
                            type="number"
                            // value={team_one_predicition_goals}
                            placeholder="+"
                            >
                        </input>
                        <input
                            type="number"
                            // value={team_two_predicition_goals}
                            placeholder="+"
                            >
                        </input>
                    </form>
                </div>
            </div>
            
            <div>
                <div>
                    <div className="h-24 aspect-square bg-blue rounded-full"></div>
                    <div>
                        {match.team_one && <span>{match.team_one.name}</span>}
                    </div>
                </div>
                <div>
                    <div className="h-24 aspect-square bg-blue rounded-full"></div>
                    <div>
                        {match.team_two && <span>{match.team_two.name}</span>}
                    </div>
                </div>
            </div>

            <div>
                <form className="flex justify-center items-center" onSubmit={onSubmit}>
                    <div>
                        <input
                            className="h-16 w-16"
                            type="number"
                            max={2}
                        />
                    </div>
                    
                    <div>:</div>
                    <input type="number" />
                    <input type="submit" value="OK" />
                </form>
            </div>
        </div>
    );
}
