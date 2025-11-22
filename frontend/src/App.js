import { router } from './utils/Router.js';
import { isAuthenticated } from './utils/Auth.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
  }

  init() {
    // Check authentication on load
    if (isAuthenticated()) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'admin') {
        router.navigate('/admin');
      } else {
        router.navigate('/cashier');
      }
    } else {
      router.navigate('/login');
    }
  }

  render(content) {
    this.appElement.innerHTML = content;
  }
}

export default App;
