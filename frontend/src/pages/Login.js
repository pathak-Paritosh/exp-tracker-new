import './Login.css';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [popup, setPopup] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { authDispatcher } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setPopup(location.state.message);

            const timer = setTimeout(() => {
                setPopup(null);
            }, 3000);
            window.history.replaceState({}, document.title);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const URI = `${process.env.REACT_APP_API_BASE_URL}/api/users/login`;
        const data = { email, password };
        try {
            setError(null);
            const res = await fetch(URI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if(!res.ok) {
                throw new Error(json.msg);
            }
            localStorage.setItem('user', JSON.stringify(json.data));
            authDispatcher({ type: 'LOGIN', payload: json.data });
            setEmail('');
            setPassword('');
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    }

    const handleEyeClick = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className="login-section section">
            <div className="container">
                <form className='login-form' onSubmit={handleSubmit}>
                    <h3>Login</h3>
                    <div className="login-email">
                        <input
                            type="text"
                            maxLength={50}
                            placeholder='Enter Your Email'
                            autoComplete='off'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-password">
                        <input
                            type={showPassword ? "text" : "password"}
                            maxLength={30}
                            placeholder='Enter Your Password'
                            autoComplete='off'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FaEye
                            className={showPassword ? 'eye-show-password d-none' : 'eye-show-password'}
                            onClick={handleEyeClick}
                        />
                        <FaEyeSlash
                            className={!showPassword ? 'eye-show-password d-none' : 'eye-show-password'}
                            onClick={handleEyeClick}
                        />
                    </div>

                    <div className="forgot-login-password">
                        <p><Link to="/resetpassword">Forgot Password ?</Link></p>
                        <p><Link to="/signup">Signup</Link></p>
                    </div>

                    <div className="submit-login">
                        <button>Submit</button>
                    </div>

                    {error &&<div className="error">
                        <p>{error}</p>
                    </div>}
                    
                </form>
                {popup && <div className='pop-up'>{popup}</div>}
            </div>
        </div>
    )
}