/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineScoreboard } from "react-icons/md";
import { LuTrophy } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";

export default function BottomMenu() {
  const {logout} = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 bg-yellow shadow-lg rounded-t-2xl py-2">
      <div className="flex justify-around">
        <MenuItem to="/" icon={IoHomeOutline} text={'Home'}/>
        <MenuItem to="/matches" icon={MdOutlineScoreboard} text={'Mecze'} />
        <MenuItem to="/scoreboard" icon={LuTrophy} text={'Tabela'}/>
        <LogoutButton onClick={handleLogout} icon={IoLogOutOutline} text={'Wyloguj'}/>
      </div>
    </div>
  );
}

function MenuItem({ to, icon: Icon, text, onClick }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <div onClick={onClick} className="relative flex flex-col items-center">
          <div className="icon-wrapper">
            <div className={`icon-container ${isActive ? 'active' : ''}`}>
              <Icon className='w-7 h-7'/>
            </div>
          </div>
          <p className={`menu-text ${isActive ? 'text-blue' : 'text-darkblue'}`}>{text}</p>
        </div>
      )}
    </NavLink>
  );
}

function LogoutButton({ onClick, icon: Icon, text }) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center focus:outline-none">
      <div className="icon-wrapper">
        <div className="icon-container">
          <Icon className='w-7 h-7'/>
        </div>
      </div>
      <p className="menu-text text-darkblue">{text}</p>
    </button>
  );
}