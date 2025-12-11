import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { EyeIcon, EyeSlashIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { login, hrdLogin, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    const isHrdAttempt = email === 'hrd@test.com'; // Based on dummy backend data
    let success = false;

    if (isHrdAttempt) {
      success = await hrdLogin({ email, password });
    } else {
      if (!email.endsWith('@gmail.com')) {
          setEmailError('Email harus menggunakan domain @gmail.com');
          return;
      }
      success = await login({ email, password });
    }
    
    if (success) {
      navigate('/'); // Navigate to root, App.tsx will handle redirect to correct dashboard
    }
  };

  const inputClass = "shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-black leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Masuk Akun</h1>
            <p className="text-gray-500">Masuk untuk melanjutkan ke AI Recruit</p>
          </div>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Alamat Email
              </label>
              <input
                className={inputClass}
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('');
                }}
                required
              />
              {emailError && <p className="text-red-500 text-xs italic mt-2">{emailError}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className={inputClass}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeIcon className="h-6 w-6 text-gray-500" /> : <EyeSlashIcon className="h-6 w-6 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-blue-300"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;