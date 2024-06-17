
import LeaderBoard from "../components/LeaderBoard"
import MobileNav from "../components/MobileNav"

export default function Scoreboard(){

  return (
    <div> 
      <MobileNav />
      <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-4 font-manrope pb-28'>
        <LeaderBoard />
      </div>
    </div>
  )
}