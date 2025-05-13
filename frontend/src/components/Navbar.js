import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
    const { user, authDispatcher } = useAuth();

    const handleClick = () => {
        localStorage.removeItem('user');
        authDispatcher({ type: 'LOGOUT' })
    }

    return (
        <nav className="navbar-section">
            <div className="container">
                <div className="navbar">
                    <div className="main-logo">
                        <Link to="/"><h2>ExpenseTracker</h2></Link>
                    </div>
                    { !user && 
                    <div className="nav-links">
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </div> }
                    { user && 
                    <div className='logout-btn'>
                        <span>Hello, {user.username}</span>
                        <button onClick={handleClick}>Logout</button>
                    </div> }
                </div>
            </div>
        </nav>
    )
}