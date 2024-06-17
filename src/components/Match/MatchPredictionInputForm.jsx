import PropTypes from 'prop-types';

export default function MatchPredictionInputForm({prediction, onChange}){
    return (
        <>
        <div className="flex flex-row justify-center gap-4 py-4">
                        <div className="flex flex-col text-center">
                            <div className="flex flex-row justify-center">
                                <input
                                    className="transition ease-in-out text-center text-5xl font-bold text-darkblue bg-white w-16 aspect-square rounded-md hover:scale-110"
                                    type="number"
                                    name="team_one_goals"
                                    value={prediction.team_one_goals}
                                    placeholder="+"
                                    onChange={onChange}
                                />
                                <div className="text-5xl px-7">:</div>
                                <input
                                    className="transition ease-in-out text-center text-5xl font-bold text-darkblue bg-white w-16 aspect-square rounded-md hover:scale-110"
                                    type="number"
                                    name="team_two_goals"
                                    value={prediction.team_two_goals}
                                    placeholder="+"
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                    </div>
        </>
    )
}

MatchPredictionInputForm.propTypes = {
    prediction: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}