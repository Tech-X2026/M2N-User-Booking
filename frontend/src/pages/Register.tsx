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
      <div className="min-h-screen flex items-center justify-center pt-24 pb-24 px-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest mb-3">Join Us</p>
            <h1 className="font-display text-4xl text-m2n-ink font-bold">Register</h1>
          </div>
          
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 rounded bg-m2n-rose/10 text-m2n-rose text-sm font-medium border border-m2n-rose/20">
                {error}
              </div>
            )}
            
            {!showOtpField ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="sfield w-full" 
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="sfield w-full" 
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="sfield w-full" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="sfield w-full pr-10" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-m2n-ink"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="sfield w-full pr-10" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-m2n-ink"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-m2n-rose text-[10px] font-bold uppercase tracking-wider mt-2">Passwords do not match</p>
                  )}
                </div>
                
                <div className="md:col-span-2 mt-2">
                  <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-2.5">
                    {loading ? 'Registering...' : 'Register Account'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div className="text-center text-sm text-text-2 mb-2">
                  We've sent a 6-digit OTP to your email. Please enter it below to verify your account.
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2 text-center">Enter OTP</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="sfield w-full tracking-widest text-center text-xl font-bold font-display" 
                    maxLength={6}
                    required 
                  />
                </div>
                
                <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-2.5">
                  {loading ? 'Verifying...' : 'Verify OTP & Register'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setShowOtpField(false)} 
                  className="text-xs font-bold text-m2n-saffron hover:underline mt-2 text-center"
                >
                  Back to registration
                </button>
              </form>
            )}

            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-[10px] font-bold text-text-3 uppercase tracking-widest">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google registration was unsuccessful')}
                theme="outline"
                shape="rectangular"
              />
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-text-2">
            Already have an account? <Link to="/login" className="font-bold text-m2n-ink hover:text-m2n-saffron transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
