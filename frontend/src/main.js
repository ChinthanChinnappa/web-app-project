import App from './App.js';
import { router } from './utils/Router.js';

// Initialize the app
const app = new App();
app.init();

// Start the router
router.init();
