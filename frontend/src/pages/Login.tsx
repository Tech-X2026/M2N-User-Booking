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
      <div className="editorial-grid min-h-[80vh] items-center pt-40 pb-32">
        <div className="col-span-12 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5">
          <p className="u-label text-terracotta text-center">Welcome Back</p>
          <h1 className="t-hero mt-6 mb-8 text-center text-4xl">Login</h1>
          
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
              <div className="flex justify-between items-center mt-1 mb-1">
                <label className="u-label-sm text-muted">Password</label>
                <Link to="/forgot-password" className="text-xs text-ink underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field w-full pr-10" 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-outline w-full justify-center mt-4">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login was unsuccessful')}
            />
          </div>
          
          <p className="mt-8 text-center text-sm text-muted">
            Don't have an account? <Link to="/register" className="text-ink underline">Register</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
