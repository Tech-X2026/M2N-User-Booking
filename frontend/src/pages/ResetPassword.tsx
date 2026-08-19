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
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12 md:pb-24 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest mb-3">Secure Account</p>
            <h1 className="font-display text-4xl text-m2n-ink font-bold">Reset Password</h1>
          </div>
          
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 rounded bg-m2n-rose/10 text-m2n-rose text-sm font-medium border border-m2n-rose/20">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sfield w-full" 
                  required 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">6-Digit OTP</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="sfield w-full tracking-widest text-center text-xl font-bold font-display" 
                  maxLength={6}
                  required 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="sfield w-full" 
                  required 
                />
              </div>
              
              <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2 py-2.5">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
          
          <p className="mt-8 text-center text-sm text-text-2">
            Didn't receive the OTP? <Link to="/forgot-password" className="font-bold text-m2n-ink hover:text-m2n-saffron transition-colors">Resend OTP</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
