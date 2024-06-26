// signup/page.jsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { addUser } from '../api'; // Adjust the path as necessary
import { useAuth } from '../../context/AuthContext'; // Import the AuthContext

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login } = useAuth(); // Destructure the login function from useAuth

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/; // Allow only alphanumeric characters and underscores
    return usernameRegex.test(username);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username) {
      setError('Username is required.');
      return;
    }

    if (!validateUsername(username)) {
      setError('Username can only contain letters, numbers, and underscores.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username,
        password: hashedPassword,
        email,
        date_of_sign_up: new Date().toISOString(),
      };

      const addedUser = await addUser(newUser);

      if (addedUser.error) {
        setError(addedUser.error);
        setLoading(false);
        return;
      }

      setSuccess('User registered successfully!');
      // Log the user in
      login(addedUser);
      // Redirect to homepage or dashboard
      router.push('/');
    } catch (err) {
      console.error('Error signing up:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-dark-bg">
      <form
        onSubmit={handleSignUp}
        className="bg-black p-6 rounded shadow-md w-full max-w-md border border-dark-border"
      >
        <h2 className="text-2xl mb-4 text-primary-orange">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <div className="mb-4">
          <label className="block mb-1 text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded bg-dark-bg text-white border-dark-border"
            autoComplete="username" // Ensure username autocomplete
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="new-password" // Ensure new password autocomplete
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-white">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded bg-dark-bg text-white border-dark-border"
            autoComplete="new-password" // Ensure confirm password autocomplete
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-orange text-black py-2 px-4 rounded hover:bg-orange-700"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
