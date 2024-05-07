// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        username,
        password
      });
      const { token } = response.data;
      localStorage.setItem('token', token);

      // JWT에서 관리자 여부를 파싱
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isAdmin = payload.isAdmin;

      if (isAdmin) {
        history.push('/admin');
      } else {
        history.push('/game');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => history.push('/signup')}>Go to Signup</button>
    </div>
  );
};

export default LoginPage;
