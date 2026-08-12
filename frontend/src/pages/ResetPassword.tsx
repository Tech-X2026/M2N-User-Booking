import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';
import PageTransition from '../components/PageTransition';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Auto-fill email if passed from ForgotPassword page
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successful! You can now login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="editorial-grid min-h-[80vh] items-center pt-40 pb-32">
        <div className="col-span-12 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5">
          <p className="u-label text-terracotta text-center">Secure Account</p>
          <h1 className="t-hero mt-6 mb-8 text-center text-4xl">Reset Password</h1>
          
          {error && (
            <div className="mb-6 p-4 border border-terracotta/40 bg-terracotta/5 text-terracotta text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              <label className="u-label-sm text-muted">6-Digit OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="field mt-1 w-full tracking-widest text-center text-xl" 
                maxLength={6}
                required 
              />
            </div>
            <div>
              <label className="u-label-sm text-muted">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="field mt-1 w-full" 
                required 
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-outline w-full justify-center mt-4">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-muted">
            Didn't receive the OTP? <Link to="/forgot-password" className="text-ink underline">Resend OTP</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
