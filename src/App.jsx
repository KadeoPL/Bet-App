import { useContext } from 'react';
import { UserContext } from './context/UserContext.jsx';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user ? <Home /> : <Login />}
    </>
  );
}

export default App;
