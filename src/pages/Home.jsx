import { UserContext } from '../context/UserContext';
import { useContext, useEffect, useState} from 'react';
import { getUserPoints } from '../services/userService';
import MobileNav from "../components/MobileNav"
import logoHorizontal from "../img/icons/eurobet24_logo_horizontal.svg"
import userAvatar from "../img/avatars/avatar_1.png"
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useContext(UserContext);
  const [userPoints, setUserPoints] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedPoints = await getUserPoints(user.id);
        setUserPoints(fetchedPoints);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    }
    fetchData();
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* <SidebarNav /> */}
      <MobileNav />
      <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-8 font-manrope '>
        <div className='w-full flex flex-row justify-between items-center mb-10'>
          <div className='w-28'>
            <img src={logoHorizontal} alt="logo" />
          </div>
          <div>
            <img className='w-14' src={userAvatar} alt="user avatar" />
          </div>
        </div>
        <div className='md:flex md:flex-row md:justify-between'>
          <h1 className='text-white font-bold text-4xl'>Witaj, {user.login}!</h1>
          <div className='flex flex-row items-center mt-4'>
            <div className='text-white mr-3'>Twoja liczba punktów: </div>
            <div className='bg-white font-bold rounded-lg px-4 py-2 text-xl'>{userPoints}</div>
          </div>
        </div>
        <div className='mt-5'>
          <h1 className='font-bold text-xl text-white'>Menu</h1>
          <Link to="">
          <div className='flex flex-row items-center justify-between border-2 border-white text-white px-4 py-3 mt-5 rounded-xl font-bold hover:bg-yellow hover:text-blue hover:border-yellow'>
            <p>Dzisiejsze mecze</p>
            <FaArrowRight />
          </div>
          </Link>
          <Link to="/PreviousMatches">
          <div className='flex flex-row items-center justify-between border-2 border-white text-white px-4 py-3 mt-5 rounded-xl font-bold hover:bg-yellow hover:text-blue hover:border-yellow'>
            <p>Poprzednie mecze</p>
            <FaArrowRight />
          </div>
          </Link>
        </div>
      </div>
    </>
  );
}
