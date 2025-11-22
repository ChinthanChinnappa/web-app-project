import { renderLogin, initLogin } from '../pages/Login.js';
import { renderAdminDashboard, initAdminDashboard } from '../pages/AdminDashboard.js';
import { renderCashierDashboard, initCashierDashboard } from '../pages/CashierDashboard.js';
import { isAuthenticated } from './Auth.js';

class Router {
  constructor() {
    this.routes = {
      '/login': { render: renderLogin, init: initLogin },
      '/admin': { render: renderAdminDashboard, init: initAdminDashboard },
      '/cashier': { render: renderCashierDashboard, init: initCashierDashboard }
    };
  }

  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    this.handleRoute();
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes['/login'];

    if (path !== '/login' && !isAuthenticated()) {
      this.navigate('/login');
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = route.render();
    
    if (route.init) {
      route.init();
    }
  }
}

export const router = new Router();
