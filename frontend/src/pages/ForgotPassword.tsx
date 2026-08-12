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
      <div className="editorial-grid min-h-[80vh] items-center pt-40 pb-32">
        <div className="col-span-12 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5">
          <p className="u-label text-terracotta text-center">Reset Access</p>
          <h1 className="t-hero mt-6 mb-8 text-center text-4xl">Forgot Password</h1>
          
          {error && (
            <div className="mb-6 p-4 border border-terracotta/40 bg-terracotta/5 text-terracotta text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="u-label-sm text-muted">Enter your email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field mt-1 w-full" 
                required 
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-outline w-full justify-center mt-4">
              {loading ? 'Sending OTP...' : 'Send OTP to Email'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-muted">
            Remembered your password? <Link to="/login" className="text-ink underline">Login</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
