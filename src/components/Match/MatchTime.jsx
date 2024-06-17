import ClockIcon from "../../img/icons/clock.svg";
import PropTypes from 'prop-types';

export default function MatchTime({time}) {
    return (
        <div className="flex flex-row justify-center items-center mb-4">
        <img src={ClockIcon} alt="Ikona" className="inline-block mr-2" />
        {time}
        </div>
    )
}

MatchTime.propTypes = {
    time: PropTypes.string.isRequired,
};