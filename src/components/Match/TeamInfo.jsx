import PropTypes from 'prop-types';

export default function TeamInfo({team_one, team_two}){
   
    return (
    <div className="flex flex-row justify-center">
        <div className="flex flex-col items-center">
            <div className={`h-14 aspect-square rounded-full`}>
                <img src={team_one.flag}></img>
            </div>
            <div className="mt-2">
                <span className='font-light'>{team_one.name}</span>
            </div>
        </div>
        <div className="flex flex-col justify-end text-xs px-7">
            vs.
        </div>
        <div className="flex flex-col items-center">
            <div className={`h-14 aspect-square rounded-full`}>
                <img src={team_two.flag}></img>
            </div>
            <div className="mt-2">
                <span className='font-light'>{team_two.name}</span>
            </div>
        </div>
    </div>
    )
} 

TeamInfo.propTypes = {
    team_one: PropTypes.object.isRequired,
    team_two: PropTypes.object.isRequired,
}