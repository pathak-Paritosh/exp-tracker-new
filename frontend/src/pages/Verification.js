import './Verification.css';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function Verification() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const { authDispatcher } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const token = JSON.parse(localStorage.getItem('verification')).token;
            if(!token) {
                throw new Error('Some Error Occurred');
            }
            const URI = `${process.env.REACT_APP_API_BASE_URL}/api/users/verify`;
            const res = await fetch(URI, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                 },
                body: JSON.stringify({otp})
            })
            const json = await res.json();
            if(!res.ok) {
                throw new Error('Some Error Occurred');
            }
            localStorage.setItem('user', JSON.stringify(json.data));
            authDispatcher({ type: 'LOGIN', payload: json.data });
            setOtp('');
        } catch (err) {
            setError(err.message);
            setOtp('');
        }
    }

    return (
        <div className="verification-section section">
            <div className="container">
                <form className="verification-form" onSubmit={handleSubmit}>
                    <h3>Enter OTP</h3>
                    <div>
                        <input
                            type="text"
                            maxLength={10}
                            placeholder='Enter OTP'
                            autoComplete='off'
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <div>
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