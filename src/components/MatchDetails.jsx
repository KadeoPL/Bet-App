/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function MatchDetails(props) {
    const [colorData, setColorData] = useState({});
    const [bgColor, setBgColor] = useState('')
    const [textColor, setTextColor] = useState('')
    const { group, team_one_name, team_one_flag, team_two_name, team_two_flag } = props;

    useEffect(() => {
        switch (group) {
            case 'Grupa A':
                setBgColor('bg-green');
                setTextColor('text-white');
                break;
            case 'Grupa B':
                setBgColor('bg-darkblue');
                setTextColor('text-white');
                break;
            case 'Grupa C':
                setBgColor('bg-red');
                setTextColor('text-white');
                break;
            case 'Grupa D':
                setBgColor('bg-yellow');
                setTextColor('text-black');
                break;
            case 'Grupa E':
                setBgColor('bg-lightblue');
                setTextColor('text-black');
                break;
            case 'Grupa F':
                setBgColor('bg-black');
                setTextColor('text-white');
                break;
            default:
                setBgColor('bg-blue');
                setTextColor('text-white');
                break;
        }
    
        setColorData({
            bgColor: bgColor,
            textColor: textColor,
        })
    }, [group, bgColor, textColor])

    return (
        <div className='font-manrope flex flex-col bg-blue bg-opacity-50 w-72 rounded-xl overflow-hidden shadow-2xl text-white'>
            <div className={`${colorData.bgColor} flex flex-row justify-center ${colorData.textColor} py-2 px-4`}>
                <div className="font-teko text-2xl font-bold">{group}</div>
            </div>
            <div className="px-6 py-3">
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col items-center">
                        <div className={`${colorData.bgColor} h-14 aspect-square rounded-full`}>
                            <img src={team_one_flag} alt="Flaga drużyny 1" />
                        </div>
                        <div className="mt-2">
                            <span className='font-light'>{team_one_name}</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end text-xs px-7">
                        vs.
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`${colorData.bgColor} h-14 aspect-square rounded-full`}>
                            <img src={team_two_flag} alt="Flaga drużyny 2" />
                        </div>
                        <div className="mt-2">
                            <span className='font-light'>{team_two_name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
