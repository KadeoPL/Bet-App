import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Home() {
  const { user, logout } = useContext(UserContext);

  return (
    <div>
      <h1>Welcome, {user ? user.login : "Guest"}!</h1>
      {user && <button onClick={logout}>Logout</button>}

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/usersList">Użytkownicy</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
