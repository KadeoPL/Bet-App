import { UserContext } from '../context/UserContext';
import { useContext, useEffect, useState} from 'react';
import { getUserPoints } from '../services/userService';
import MobileNav from "../components/MobileNav"

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
      <div className='min-h-screen w-full bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed p-12 font-manrope '>
        <div className='md:flex md:flex-row md:justify-between'>
          <h1 className='text-white font-bold text-5xl'>Witaj, {user.login}!</h1>
          <div className='flex flex-row items-center'>
            <div className='text-white mr-3'>Twoja liczba punktów: </div>
            <div className='bg-white font-bold rounded-lg px-6 py-2 text-xl'>{userPoints}</div>
          </div>
        </div>
      </div>
    </>
  );
}
