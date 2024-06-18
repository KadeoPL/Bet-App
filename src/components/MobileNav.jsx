/* eslint-disable react/prop-types */
import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { IoHomeOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlineScoreboard } from "react-icons/md";
import { LuTrophy } from "react-icons/lu";

export default function BottomMenu() {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 bg-yellow shadow-lg rounded-t-2xl py-4">
      <div className="flex justify-around">
        <MenuItem to="/" icon={IoHomeOutline} text={'Home'} />
        <MenuItem to="/matches" icon={MdOutlineScoreboard} text={'Mecze'} />
        <MenuItem to="/scoreboard" icon={LuTrophy} text={'Tabela'} />
        <LogoutButton onClick={handleLogout} icon={IoLogOutOutline} text={'Wyloguj'} />
      </div>
    </div>
  );
}

function MenuItem({ to, icon: Icon, text, onClick }) {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <motion.div
          onClick={onClick}
          className="relative flex flex-col items-center"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="relative flex justify-center items-center h-7.5"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`absolute w-10 h-10 flex justify-center items-center ${isActive ? 'bg-blue text-yellow rounded-full p-1.5 transform translate-y-[-15px] shadow-md' : 'text-darkblue'} transition duration-300`}>
              <Icon className="w-7 h-7 relative z-10" />
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-blue rounded-full z-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
            </div>
          </motion.div>
          <p className={`mt-4 text-xs ${isActive ? 'text-blue' : 'text-darkblue'} transition duration-300`}>{text}</p>
        </motion.div>
      )}
    </NavLink>
  );
}

function LogoutButton({ onClick, icon: Icon, text }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center focus:outline-none"
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="relative flex justify-center items-center h-7.5"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute w-10 h-10 flex justify-center items-center transition duration-300">
          <Icon className="w-7 h-7 relative z-10" />
        </div>
      </motion.div>
      <p className="mt-4 text-xs text-blue transition duration-300">{text}</p>
    </motion.button>
  );
}
