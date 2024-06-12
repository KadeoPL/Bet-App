import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { getUsers } from '../services/userService';
import LogoVertical from '../img/icons/eurobet24_logo_vertical.svg'

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

  function onButtonClick(event) {
    event.preventDefault();

    setLoginError('');
    setPasswordError('');

    if (loginInput === '') {
      setLoginError('Pole nie może być puste!');
    } else if (passwordInput === ''){
      setPasswordError('Pole nie może być puste!');
    } else {
      
      const user = users.find(user => user.login === loginInput);

      if (user) {
        if (user.password === passwordInput) {
          login(user);
        } else {
          setPasswordError('Niepoprawne hasło, spróbuj ponownie!');
        }
      } else {
        setLoginError('Niepoprawny login, spróbuj ponownie!');
      }
    }
  }

  return (
     <div className='h-screen w-screen bg-blue bg-bgmain bg-cover bg-blend-multiply bg-top bg-no-repeat bg-fixed flex justify-center items-center font-manrope'>
     <div className='w-64'>
      <div className='flex justify-center mb-7'>
        <img 
          className='w-32'
          src={LogoVertical}
          alt="logo"
          />
      </div>
      <form className='flex flex-col gap-4'>
          <input
                className='rounded-lg text-manrope bg-transparent border-2 border-white text-white py-3 px-4'
                type="text"
                value={loginInput}
                placeholder="Wpisz login"
                onChange={(ev) => setLoginInput(ev.target.value)}
              />
              {loginError && <p className='text-red'>{loginError}</p>}
          <input
                className='rounded-lg text-manrope bg-transparent border-2 border-white text-white py-3 px-4'
                type="password"
                value={passwordInput}
                placeholder="Wpisz hasło"
                onChange={(ev) => setPasswordInput(ev.target.value)}
              />
              {passwordError && <p className='text-red'>{passwordError}</p>}

          <input
                className='transition ease-in-out bg-yellow py-3 px-4 rounded-lg hover:scale-110 '
                type="submit"
                onClick={onButtonClick}
                value="Zaloguj"
            />
      </form>    
    </div>
    </div>
  );
}
