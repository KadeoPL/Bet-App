import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { loginUser } from '../services/userService';
import LogoVertical from '../img/icons/eurobet24_logo_vertical.svg';

export default function Login() {
  const { login } = useContext(UserContext);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    login: '',
    password: '',
  });

  useEffect(() => {
    if (loginData.login && loginData.password) {
      const performLogin = async () => {
        setIsLoading(true);
        try {
          const response = await loginUser(loginData);
          setIsLoading(false);
          login(response);
        } catch (error) {
          setIsLoading(false);
          setApiError(error);
        }
      };

      performLogin();
    }
  }, [loginData, login]);

  function onButtonClick(event) {
    event.preventDefault();

    setLoginError('');
    setPasswordError('');
    setApiError('');

    if (loginInput === '') {
      setLoginError('Pole nie może być puste!');
    } else if (passwordInput === '') {
      setPasswordError('Pole nie może być puste!');
    } else {
      setLoginData({
        login: loginInput,
        password: passwordInput,
      });
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
          {apiError && <p className='text-red'>{apiError}</p>}

          <input
            className='transition ease-in-out bg-yellow py-3 px-4 rounded-lg hover:scale-110 '
            type="submit"
            onClick={onButtonClick}
            value={isLoading ? "Ładowanie..." : "Zaloguj"}
            disabled={isLoading}
          />
        </form>    
      </div>
    </div>
  );
}
