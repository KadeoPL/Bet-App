import { useEffect } from "react";
import SidebarNav from "../components/Sidebar"
import Array from "../components/Array"

export default function Scoreboard(){

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <> 
      <SidebarNav />
      <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-12 font-manrope '>
        <Array />
      </div>
    </>
  )
}