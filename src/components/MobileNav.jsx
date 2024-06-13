import { NavLink } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineScoreboard } from "react-icons/md";
import { LuTrophy } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";

function BottomMenu() {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow shadow-lg rounded-t-2xl">
      <div className="flex justify-around">
        <MenuItem to="/" icon={IoHomeOutline} />
        <MenuItem to="/matches" icon={MdOutlineScoreboard} />
        <MenuItem to="/scoreboard" icon={LuTrophy} />
        {user && (
          <LogoutMenuItem to="/" onLogout={logout} icon={IoLogOutOutline} />
        )}
      </div>
    </div>
  );
}

function MenuItem({ to, icon: Icon }) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      `w-full flex flex-col items-center ${isActive ? 'text-yellow' : 'text-blue'}`
    }>
      {({ isActive }) => (
        <div className={`relative flex items-center justify-center`}>
          <div className={`transition transform ${isActive ? 'translate-y-0 translate-y-full z-10' : 'translate-y-2'}`}>
            <Icon className="w-7 h-7" />
          </div>
          {isActive && (
            <div className="absolute bottom-0 w-12 h-12 bg-blue rounded-full" />
          )}
        </div>
      )}
    </NavLink>
  );
}

function LogoutMenuItem({to, onLogout, icon: Icon }) {
  return (
    <NavLink to={to}>
    <div
      onClick={onLogout}
      className="w-full flex flex-col items-center p-2 text-gray-500 cursor-pointer"
    >
      <div className="relative flex items-center justify-center">
        <div className="transition transform translate-y-2 hover:translate-y-0">
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
    </NavLink>
  );
}

export default BottomMenu;
