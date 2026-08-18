import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../lib/AuthContext';
import api from '../lib/api';
import PageTransition from '../components/PageTransition';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
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
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest mb-3">Welcome Back</p>
            <h1 className="font-display text-4xl text-m2n-ink font-bold">Login</h1>
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
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-text-3 uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" className="text-[11px] font-bold text-m2n-saffron hover:underline">Forgot?</Link>
                </div>
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
              
              <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center mt-2 py-2.5">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-[10px] font-bold text-text-3 uppercase tracking-widest">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login was unsuccessful')}
                theme="outline"
                shape="rectangular"
              />
            </div>
          </div>
          
          <p className="mt-8 text-center text-sm text-text-2">
            Don't have an account? <Link to="/register" className="font-bold text-m2n-ink hover:text-m2n-saffron transition-colors">Register</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
