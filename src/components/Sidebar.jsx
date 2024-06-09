import { NavLink } from 'react-router-dom';
import { useContext} from "react";
import { UserContext } from "../context/UserContext";

export default function SidebarNav (){
    const { user, logout } = useContext(UserContext);

    return (
      <div>
        <div className='h-screen bg-indigo-950 text-white p-10'>
          <nav>
            <ul className='space-y-6 '>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? 'hover:text-indigo-400 text-indigo-400' : 'hover:text-indigo-400'}
                >Home</NavLink>
              </li>
              <li>
                <NavLink
                  to="/matches"
                  className={({ isActive }) => isActive ? 'hover:text-indigo-400 text-indigo-400' : 'hover:text-indigo-400'}
                >Mecze</NavLink>
              </li>
              <li>
                <NavLink
                  to="/usersList"
                  className={({ isActive }) => isActive ? 'hover:text-indigo-400 text-indigo-400' : 'hover:text-indigo-400'}
                >Użytkownicy</NavLink>
              </li>
              <li>
                {user && (
                  <button 
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }} 
                    className='hover:text-indigo-400'
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
