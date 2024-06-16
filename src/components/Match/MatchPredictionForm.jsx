import PropTypes from 'prop-types';

export default function MatchPredicionForm({ matchId, result, team_one, team_two, onChange }) {
    return (
        <div className="text-center mb-4">
            <div className="mb-4 mt-6">Wytypuj zwycięzcę:</div>
            <div className="flex flex-row text-sm justify-center">
                <input
                    className="appearance-none"
                    type="radio"
                    name="result"
                    id={`${matchId}_team_one`}
                    value="1"
                    checked={result === 1}
                    onChange={onChange}
                />
                <label
                    className={`mr-4 border-2 rounded-lg p-2 hover:text-white hover:border-yellow ${result === 1 ? 'border-yellow bg-yellow text-black' : 'border-white'}`}
                    htmlFor={`${matchId}_team_one`}
                >
                    {team_one && team_one.name}
                </label>
                <input
                    className="appearance-none"
                    type="radio"
                    name="result"
                    id={`${matchId}_draw`}
                    value="0"
                    checked={result === 0}
                    onChange={onChange}
                />
                <label
                    className={`mr-4 border-2 rounded-lg p-2 hover:text-white hover:border-yellow ${result === 0 ? 'border-yellow bg-yellow text-black' : 'border-white'}`}
                    htmlFor={`${matchId}_draw`}
                >
                    Remis
                </label>
                <input
                    className="appearance-none"
                    type="radio"
                    name="result"
                    id={`${matchId}_team_two`}
                    value="2"
                    checked={result === 2}
                    onChange={onChange}
                />
                <label
                    className={`border-2 rounded-lg p-2 hover:text-white hover:border-yellow ${result === 2 ? 'border-yellow bg-yellow text-black' : 'border-white'}`}
                    htmlFor={`${matchId}_team_two`}
                >
                    {team_two && team_two.name}
                </label>
            </div>
        </div>
    );
}

MatchPredicionForm.propTypes = {
    matchId: PropTypes.number.isRequired,
    result: PropTypes.any.isRequired,
    team_one: PropTypes.object.isRequired,
    team_two: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}