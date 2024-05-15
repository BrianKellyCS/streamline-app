// login/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { fetchUsers } from '../api'; // Adjust the path as necessary
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const users = await fetchUsers();
      const user = users.find((u) => u.username === username);

      if (user && bcrypt.compareSync(password, user.password)) {
        // Set the user in the AuthContext
        login(user);
        // Redirect to homepage or dashboard
        router.push('/');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-bg">
      <form onSubmit={handleLogin} className="bg-black p-6 rounded shadow-md w-full max-w-md border border-dark-border">
        <h2 className="text-2xl mb-4 text-primary-orange">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1 text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded bg-dark-bg text-white border-dark-border"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded bg-dark-bg text-white border-dark-border"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-orange text-black py-2 px-4 rounded hover:bg-orange-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="flex justify-between items-center mt-4">
          <span className="text-white">Don't have an account?</span>
          <button
            onClick={() => router.push('/signup')}
            className="bg-transparent border border-primary-orange text-primary-orange py-2 px-4 rounded hover:bg-primary-orange hover:text-black"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
