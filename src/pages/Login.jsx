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
     <div className='flex items-center justify-center w-screen'>
      <div className='flex flex-col gap-5'>
        <div >
          <input
            className='rounded-lg'
            type="text"
            value={loginInput}
            placeholder="Enter your login"
            onChange={(ev) => setLoginInput(ev.target.value)}
          />
          {loginError && <p className='text-red-400'>{loginError}</p>}
        </div>
        <div>
          <input
            className='rounded-lg'
            type="password"
            value={passwordInput}
            placeholder="Enter your password"
            onChange={(ev) => setPasswordInput(ev.target.value)}
          />
          {passwordError && <p className='text-red-400'>{passwordError}</p>}
        </div>
        <div className='bg-indigo-950 text-white text-center p-4 rounded-lg hover:bg-indigo-800'>
          <input
            type="submit"
            onClick={onButtonClick}
            value="Log in"
          />
        </div>
      </div>
    </div> 
  );
}
