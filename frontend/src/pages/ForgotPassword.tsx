import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import PageTransition from '../components/PageTransition';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      // Redirect to ResetPassword page and pass email in state
      navigate('/reset-password', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12 md:pb-24 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest mb-3">Reset Access</p>
            <h1 className="font-display text-4xl text-m2n-ink font-bold">Forgot Password</h1>
          </div>
          
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            {error && (
              <div className="mb-6 p-4 rounded bg-m2n-rose/10 text-m2n-rose text-sm font-medium border border-m2n-rose/20">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-bold text-text-3 uppercase tracking-wider mb-2">Enter your email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sfield w-full" 
                  required 
                />
              </div>
              
              <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2 py-2.5">
                {loading ? 'Sending OTP...' : 'Send OTP to Email'}
              </button>
            </form>
          </div>
          
          <p className="mt-8 text-center text-sm text-text-2">
            Remembered your password? <Link to="/login" className="font-bold text-m2n-ink hover:text-m2n-saffron transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
