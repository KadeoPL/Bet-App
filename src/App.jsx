import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import Home from './components/Home';
import Login from './components/Login';
import UsersList from './components/UsersList';

function App() {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/usersList" element={<UsersList />} />
      </Routes>
    </Router>
  );
}

export default App;
