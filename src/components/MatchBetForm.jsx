import { useState, useEffect } from "react"

export default function MatchBetForm({ matchData }) {
    const [match, setMatch] = useState({})

    useEffect(() => {
        setMatch(matchData)
    }, [matchData])

    function onSubmit(event) {
        event.preventDefault()
        console.log('Add result')
    }

    return (
        <>
            <div>
                <div>
                    Grupa {match.group}
                </div>
                <div>
                    {match.date} | {match.time}
                </div>
            </div>
            
            <div>
                <div>
                    <div>
                        {match.team_one}
                    </div>
                </div>
                <div>
                    <div>
                        {match.team_two}
                    </div>
                </div>
            </div>

            <div>
                <form onSubmit={onSubmit}>
                    <input type="number" />
                    <div>:</div>
                    <input type="number" />
                    <input type="submit" value="OK" />
                </form>
            </div>
        </>
    )
}
