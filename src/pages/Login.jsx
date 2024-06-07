import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getUsers } from '../services/userService';

export default function Login() {
  const { login } = useContext(UserContext);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchData();
  }, []);

  function onButtonClick() {
    setLoginError('');
    setPasswordError('');

    if (loginInput === '') {
      setLoginError('Please enter your login');
      return;
    }

    if (passwordInput === '') {
      setPasswordError('Please enter your password');
      return;
    }

    const user = users.find(user => user.login === loginInput);

    if (user) {
      if (user.password === passwordInput) {
        login(user);
      } else {
        setPasswordError('Incorrect password, try again!');
      }
    } else {
      setLoginError('Incorrect login, try again!');
    }
  }

  return (
    <>
      <div>
        <input
          type="text"
          value={loginInput}
          placeholder="Enter your login"
          onChange={(ev) => setLoginInput(ev.target.value)}
        />
        {loginError && <p>{loginError}</p>}
      </div>
      <div>
        <input
          type="password"
          value={passwordInput}
          placeholder="Enter your password"
          onChange={(ev) => setPasswordInput(ev.target.value)}
        />
        {passwordError && <p>{passwordError}</p>}
      </div>
      <div>
        <input
          type="button"
          onClick={onButtonClick}
          value="Log in"
        />
      </div>
    </>
  );
}
