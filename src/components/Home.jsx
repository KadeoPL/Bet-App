import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function Home() {
  const { user, logout } = useContext(UserContext);

  return (
    <div>
      <h1>Welcome, {user ? user.login : "Guest"}!</h1>
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}
