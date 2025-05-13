import { useState } from 'react';
import './PasswordResetOtpConfirmation.css';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function PasswordResetOtpConfirmation() {
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const URI = `${process.env.REACT_APP_API_BASE_URL}/api/users/reset-password-confirmation`;
            const data = {otp, password};
            const token = JSON.parse(localStorage.getItem('passwordResetToken'));
            const res = await fetch(URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if(!res.ok) {
                throw new Error(json.msg);
            }
            setError(null);
            navigation('/login', {state: {
                message: 'Your password has been reset. Login to continue...'
            }});
        } catch (err) {
            setError(err.message);
        }
    }

    const handleEyeClick = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className="password-reset-otp-confirmation section">
            <div className="container">
                <form className='password-reset-otp-confirmation-form' onSubmit={handleSubmit}>
                    <h3>Enter OTP & Password</h3>
                    <div className="reset-password-otp">
                        <input
                            type="text"
                            maxLength={10}
                            placeholder='Enter Your OTP'
                            autoComplete='off'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <div className="reset-password-password">
                        <input
                            type={showPassword ? "text" : "password"}
                            maxLength={30}
                            placeholder='Enter Your New Password'
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
                    <div className="submit-login">
                        <button>Submit</button>
                    </div>
                    {error &&<div className="error">
                        <p>{error}</p>
                    </div>}
                </form>
            </div>
        </div>
    )
}