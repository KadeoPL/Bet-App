import { NavLink } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineScoreboard } from "react-icons/md";
import { LuTrophy } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";

export default function SidebarNav (){
    const { user, logout } = useContext(UserContext);

    return (
      <div className='fixed bottom-0 w-screen'>
        <div className='bg-darkblue text-white p-5'>
          <nav>
            <ul className='flex flex-row justify-center gap-4'>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? 'hover:text-darkblue text-yellow' : 'hover:fill-lightblue'}>
                  <IoHomeOutline className='h-10 w-10' /></NavLink>
              </li>
              <li>
                <NavLink
                  to="/matches"
                  className={({ isActive }) => isActive ? 'hover:text-darkblue text-yellow' : 'hover:text-lightblue'}
                ><MdOutlineScoreboard className='h-10 w-10'/></NavLink>
              </li>
              <li>
                <NavLink
                  to="/scoreboard"
                  className={({ isActive }) => isActive ? 'hover:text-darkblue text-yellow' : 'hover:text-lightblue'}
                ><LuTrophy className='h-10 w-10' /></NavLink>
              </li>
              <li>
                {user && (
                  <button 
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }} 
                    className='hover:text-lightblue'
                  >
                    <IoLogOutOutline className='h-10 w-10' />
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
}