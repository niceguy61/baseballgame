// frontend/src/pages/SignupPage.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const history = useHistory();

  const handleSignup = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/signup', {
        username,
        password,
        isAdmin
      });
      localStorage.setItem('token', response.data.token);

      // JWT에서 관리자 여부를 파싱
      const payload = JSON.parse(atob(response.data.token.split('.')[1]));
      const isAdminUser = payload.isAdmin;

      // 관리자는 관리자 페이지로, 일반 사용자는 게임 페이지로 리디렉션
      if (isAdminUser) {
        history.push('/admin');
      } else {
        history.push('/game');
      }
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
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
      <label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        Admin Access
      </label>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default SignupPage;
