import { useState } from "react"

export default function Login(){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    function onButtonClick(){
        setLoginError('');
        setPasswordError('');

        if(login === ''){
            setLoginError('Please enter your login')
        }

        if(password === ''){
            setPasswordError('Please enter your password')
        }
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