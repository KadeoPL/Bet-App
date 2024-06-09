import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function SidebarNav (){
    const { user, logout } = useContext(UserContext);

    return (
      <div>
        <div className='h-screen bg-indigo-950 text-white p-10'>
          <nav>
            <ul className='space-y-6 '>
              <li>
                <Link
                to="/"
                className='hover:text-indigo-400'
                >Home</Link>
              </li>
              <li>
                <Link
                to="/matches"
                className='hover:text-indigo-400'
                >Mecze</Link>
              </li>
              <li>
                <Link
                to="/usersList"
                className='hover:text-indigo-400'
                >Użytkownicy</Link>
              </li>
              <li>
                <Link
                to="/"
                className='hover:text-indigo-400'
                >{user && <button onClick={logout}>Logout</button>}</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    )
}