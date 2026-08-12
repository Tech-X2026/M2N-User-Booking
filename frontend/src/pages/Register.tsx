import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../lib/AuthContext';
import api from '../lib/api';
import PageTransition from '../components/PageTransition';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const response = await api.post('/auth/register', { name, email, phone, password });
      
      if (response.data.requiresOTP) {
        setShowOtpField(true);
      } else {
        // Fallback if no OTP required
        login(response.data.user, response.data.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-registration-otp', { email, otp });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/google', { credential: credentialResponse.credential });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="editorial-grid min-h-[80vh] items-center pt-40 pb-32">
        <div className="col-span-12 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5">
          <p className="u-label text-terracotta text-center">Join Us</p>
          <h1 className="t-hero mt-6 mb-8 text-center text-4xl">Register</h1>
          
          {error && (
            <div className="mb-6 p-4 border border-terracotta/40 bg-terracotta/5 text-terracotta text-sm">
              {error}
            </div>
          )}
          
          {!showOtpField ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="u-label-sm text-muted">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field mt-1 w-full" 
                  required 
                />
              </div>
              <div>
                <label className="u-label-sm text-muted">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field mt-1 w-full" 
                  required 
                />
              </div>
              <div>
                <label className="u-label-sm text-muted">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field mt-1 w-full" 
                  required 
                />
              </div>
              <div>
                <label className="u-label-sm text-muted">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field mt-1 w-full pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="u-label-sm text-muted">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="field mt-1 w-full pr-10" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
              
              <button type="submit" disabled={loading} className="btn-outline w-full justify-center mt-4">
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
              <div className="text-center text-sm text-muted mb-2">
                We've sent a 6-digit OTP to your email. Please enter it below to verify your account.
              </div>
              <div>
                <label className="u-label-sm text-muted">Enter OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="field mt-1 w-full tracking-widest text-center text-xl" 
                  maxLength={6}
                  required 
                />
              </div>
              
              <button type="submit" disabled={loading} className="btn-outline w-full justify-center mt-4">
                {loading ? 'Verifying...' : 'Verify OTP & Register'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setShowOtpField(false)} 
                className="text-xs text-muted underline mt-2"
              >
                Back to registration
              </button>
            </form>
          )}

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google registration was unsuccessful')}
            />
          </div>
          
          <p className="mt-8 text-center text-sm text-muted">
            Already have an account? <Link to="/login" className="text-ink underline">Login</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
