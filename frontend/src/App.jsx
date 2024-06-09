import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import UsersList from './pages/UsersList';
import Matches from './pages/Matches';

function App() {
  const { user } = useContext(UserContext);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/usersList" element={<UsersList />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Matches" element={<Matches />} />
      </Routes>
    </Router>
  );
}

export default App;
