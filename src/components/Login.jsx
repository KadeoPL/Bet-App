import { useState, useEffect } from "react"
import { getUsers } from "../services/userService"

export default function Login(){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        async function fetchData() {
          try {
            const users = await getUsers()
            setUsers(users)
          } catch (error) {
            console.error('Error fetching users:', error)
          }
        }
    
        fetchData()
      }, [])
    
    function onButtonClick(){
        setLoginError('');
        setPasswordError('');

        if(login === ''){
            setLoginError('Please enter your login')
        }

        if(password === ''){
            setPasswordError('Please enter your password')
        }

        users.forEach(user => {
            if (user.login === login) {
              if (user.password === password) {
                 console.log('Logged');
              } else {
                setPasswordError('Incorret password, try again!');
              }
            } else {
                setLoginError('Incorret login, try again!')
            }
          });
    }

    return (
        <>
            <div>
                <input
                    value={login}
                    placeholder="Enter your login"
                    onChange={(ev) => setLogin(ev.target.value)}
                />
                {loginError && <p>{loginError}</p>}
            </div>
            <div>
                <input
                    value={password}
                    placeholder="Enter your password"
                    onChange={(ev) => setPassword(ev.target.value)}
                />
                {passwordError && <p>{passwordError}</p>}
            </div>
            <div>
                <input
                    type="button"
                    onClick={onButtonClick}
                    value={'Log in'} />
            </div>
        </>
    )
}