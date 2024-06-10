import { NavLink } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function SidebarNav (){
    const { user, logout } = useContext(UserContext);

    return (
      <div>
        <div className='bg-blue text-white p-5'>
          <nav>
            <ul className='flex flex-row justify-end gap-4'>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? 'hover:text-darkblue text-yellow' : 'hover:text-darkblue'}
                >Home</NavLink>
              </li>
              <li>
                <NavLink
                  to="/matches"
                  className={({ isActive }) => isActive ? 'hover:text-darkblue text-yellow' : 'hover:text-darkblue'}
                >Mecze</NavLink>
              </li>
              <li>
                <NavLink
                  to="/usersList"
                  className={({ isActive }) => isActive ? 'hover:text-darkblue text-yellow' : 'hover:text-darkblue'}
                >Użytkownicy</NavLink>
              </li>
              <li>
                {user && (
                  <button 
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }} 
                    className='hover:text-darkblue'
                  >
                    Logout
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
}