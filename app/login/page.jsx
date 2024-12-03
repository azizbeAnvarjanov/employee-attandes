"use client"
// pages/auth/login.js
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard'); // Muvaffaqiyatli kirishdan so'ng Dashboard sahifasiga o'tadi
    } catch (err) {
      setError('Login yoki parol xato');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tizimga kirish</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kirish</button> <br />
        <Link href="/register">Ro'hatdan o'tish</Link>
      </form>
    </div>
  );
};

export default Login;
