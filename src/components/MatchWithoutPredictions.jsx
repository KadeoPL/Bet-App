import MatchTime from './Match/MatchTime';
import MatchHeader from './Match/MatchHeader';
import TeamInfo from './Match/TeamInfo';
import PropTypes from 'prop-types';

export default function MatchWithoutPredictions({match}) {
    console.log(match)
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
            </div>
        </div>
        </>
    );
}

MatchWithoutPredictions.propTypes = {
    match: PropTypes.object.isRequired,
}
