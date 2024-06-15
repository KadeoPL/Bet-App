import { useState, useEffect } from "react";
import { setColorsByGroup} from "../../utils/setColorsByGroup";
import { getDayOfWeek } from '../../utils/getDayOfWeek';
import PropTypes from 'prop-types';

export default function MatchHeader({group, date}) {
    const [bgColor, setBgColor] = useState('')
    const [textColor, setTextColor] = useState('')
    const [matchDay, setMatchDay] = useState('');

    useEffect(() => {
        const colors = setColorsByGroup(group);
        setBgColor(colors.bgColor);
        setTextColor(colors.textColor);
    }, [group]);

    useEffect(() => {
        const dayOfWeek = getDayOfWeek(date);
        setMatchDay(dayOfWeek);
    }, [date]);
    return (
        <div className={`${bgColor} flex flex-row justify-between ${textColor} py-2 px-4`}>
        <div className="font-teko text-2xl font-bold">{group}</div>
        <div className="flex flex-col justify-center text-sm font-medium">{matchDay}, {date}</div>
    </div>
    )
}

MatchHeader.propTypes = {
    group: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
};

