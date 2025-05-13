import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verification from './pages/Verification';
import Home from './pages/Home';
import { useAuth } from './hooks/useAuth';
import PasswordReset from './pages/PasswordReset';
import PasswordResetOtpConfirmation from './pages/PasswordResetOtpConfirmation';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path='/' element={ user ? <Home /> : <Navigate to="/login" /> } />
          <Route path='/login' element={ !user ? <Login /> : <Navigate to="/" /> } />
          <Route path='/signup' element={ !user ? <Signup /> : <Navigate to="/" /> } />
          <Route path='/verify' element={ !user ? <Verification /> : <Navigate to="/" /> } />
          <Route path="/resetpassword" element={ !user ? <PasswordReset /> : <Navigate to="/" /> } />
          <Route path='/password-reset-otp-confirmation' element={ !user ? <PasswordResetOtpConfirmation /> : <Navigate to="/" /> } />
          <Route path="*" element={ user ? <Navigate to="/" /> : <Navigate to="/login" /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
