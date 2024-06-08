import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import SidebarNav from '../components/Sidebar';

export default function Home() {
  const { user } = useContext(UserContext);
  return (
    <>
      <SidebarNav/>
      <div>
        <h1>Welcome, {user.login}! Your points: {user.points ? user.points : '0'}</h1>
      </div>
    </>
  );
}

