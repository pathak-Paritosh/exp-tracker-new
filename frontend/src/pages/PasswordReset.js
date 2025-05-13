import { useState } from 'react';
import './PasswordReset.css';
import { useNavigate } from 'react-router-dom';

export default function PasswordReset() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const URI = `${process.env.REACT_APP_API_BASE_URL}/api/users/reset`;
            const data = { email };
            const res = await fetch(URI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            if(!res.ok) {
                throw new Error(json.msg);
            }
            localStorage.setItem('passwordResetToken', JSON.stringify(json.data.token));
            setError(null);
            navigation('/password-reset-otp-confirmation');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="reser-password-section section">
            <div className="container">
                <form className="reset-password-form" onSubmit={handleSubmit}>
                    <h3>Reset Your Password</h3>
                    <div className="reset-password-email">
                        <input
                            type="text"
                            placeholder='Enter Your Email'
                            value={email}
                            autoComplete='off'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="reset-password-submit-div">
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