import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Scoreboard from './pages/Scoreboard';
import Matches from './pages/Matches';
import MatchInfo from './pages/MatchInfo';

function App() {
  const { user } = useContext(UserContext);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/Scoreboard" element={<Scoreboard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Matches" element={<Matches />} />
        <Route path="/MatchInfo" element={<MatchInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
