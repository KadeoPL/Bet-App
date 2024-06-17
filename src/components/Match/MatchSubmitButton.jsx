import { useState, useEffect } from "react";
import { setColorsByGroup } from "../../utils/setColorsByGroup";
import { FaArrowRight } from "react-icons/fa6";
import PropTypes from 'prop-types';

export default function MatchSubmitButton({group, isStartMatch, isLoading, loadingText, onClick}) {
    const [bgColor, setBgColor] = useState('')
    const [textColor, setTextColor] = useState('')

    useEffect(() => {
        const colors = setColorsByGroup(group);
        setBgColor(colors.bgColor);
        setTextColor(colors.textColor);
    }, [group, isStartMatch]);
    
    return (
        <>
            {!isStartMatch && (
            <div className="text-center">
                <input
                    className={`${bgColor} ${textColor} transition ease-in-out px-4 py-2 rounded-lg hover:scale-110 `}
                    type="submit"
                    value={isLoading ? loadingText : "Obstaw"}
                />
            </div> )}
            { isStartMatch &&
                        <div className='flex flex-row items-center text-sm justify-center mt-5 cursor-pointer text-yellow' onClick={onClick}>
                            <p className='mr-1'>Sprawdź jak typowali pozostali</p>
                            <FaArrowRight />
                        </div>}
        </>
    )
}

MatchSubmitButton.propTypes = {
    group: PropTypes.string.isRequired,
    isStartMatch: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadingText: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};
