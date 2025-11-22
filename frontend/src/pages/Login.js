import axios from 'axios';
import { router } from '../utils/Router.js';

const API_URL = 'http://localhost:3000/api';

export function renderLogin() {
  return `
    <div class="login-container">
      <div class="login-box">
        <h1>Retail POS System</h1>
        <h2>Fraud Detection Login</h2>
        <form id="loginForm">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="btn-primary">Login</button>
          <div id="error-message" class="error-message"></div>
        </form>
      </div>
    </div>
  `;
}

export function initLogin() {
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        router.navigate('/admin');
      } else {
        router.navigate('/cashier');
      }
    } catch (error) {
      errorMessage.textContent = error.response?.data?.error || 'Login failed';
    }
  });
}
