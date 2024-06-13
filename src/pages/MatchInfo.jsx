import { useNavigate } from "react-router-dom"
import { MdOutlineArrowBackIos } from "react-icons/md";
import Flag from "../../public/img/flags/Szwajcaria.png"

export default function MatchInfo(matchId) {
    const navigate = useNavigate();

    const backNavigate = () => {
        navigate('/matches')
    }

    return (
        <>
            <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-8 font-manrope '>
            <div>
                <div
                onClick={backNavigate}
                className="flex flex-row items-center text-white hover:scale-110">
                <MdOutlineArrowBackIos /> Powrót</div>
            </div>
            <div className="mt-5 text-white uppercase text-sm tracking-wide">Informacje o meczu</div>
            <div className="flex flex-col items-center">
                        <div className={`h-14 aspect-square rounded-full`}>
                            <img src={Flag}></img>
                        </div>
                        <div className="mt-2">
                            <span className='font-light'>Szwajcaria</span>
                        </div>
                    </div>
            </div>
        </>
    )
}