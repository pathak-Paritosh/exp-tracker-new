import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const URI = `${process.env.REACT_APP_API_BASE_URL}/api/users/signup`;
        const data = { username, email, password };
        try {
            setError(null);
            const res = await fetch(URI, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            const json = await res.json();
            if(!res.ok) {
                throw new Error(json.msg);
            }
            localStorage.setItem('verification', JSON.stringify(json.data));
            setUsername('');
            setEmail('');
            setPassword('');
            setError(null);
            navigation('/verify');
        } catch (err) {
            setError(err.message);
        }
    }

    const handleEyeClick = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className="signup-section section">
            <div className="container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h3>Signup</h3>
                    <div className='signup-username'>
                        <input
                            type="text"
                            maxLength={50}
                            placeholder='Enter Your Username'
                            autoComplete='off'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="signup-email">
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

                    <div className="signup-password">
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

                    <div className="login-redirect">
                        <p>Already have an account ? <Link to="/login">Login</Link></p>
                    </div>

                    <div className="submit-signup">
                        <button>Submit</button>
                    </div>

                    {error && <div className="error">
                        <p>{error}</p>
                    </div>}
                </form>
            </div>
        </div>
    )
}