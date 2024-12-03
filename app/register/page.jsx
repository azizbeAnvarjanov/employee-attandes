"use client"
// pages/auth/register.js

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import Link from 'next/link';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/login'); // Ro'yxatdan o'tgandan so'ng Login sahifasiga o'tadi
    } catch (err) {
      setError('Ro‘yxatdan o‘tishda xatolik yuz berdi');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ro'yxatdan o'tish</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
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
        <button type="submit">Ro'yxatdan o'tish</button><br />
        <Link href="/login">Tizimga kirish</Link>
      </form>
    </div>
  );
};

export default Register;
