import axios from 'axios';
import { logout, getAuthHeader } from '../utils/Auth.js';

const API_URL = 'http://localhost:3000/api';

export function renderCashierDashboard() {
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Cashier Dashboard - POS System</h1>
        <button id="logoutBtn" class="btn-logout">Logout</button>
      </div>
      <div class="dashboard-content">
        <h2>Create New Transaction</h2>
        <div id="products">Loading products...</div>
        <div id="cart" style="margin-top: 20px; background: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h3>Cart</h3>
          <div id="cartItems"></div>
          <div style="margin-top: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Discount (%)</label>
            <input type="number" id="discountInput" min="0" max="100" value="0" 
                   style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 3px; margin-bottom: 5px;">
            <small style="color: #666;">Note: Discounts above 15% will be flagged for review</small>
          </div>
          <div style="margin-top: 10px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Payment Method</label>
            <select id="paymentMethod" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 3px;">
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          <button id="checkoutBtn" class="btn-primary" style="margin-top: 15px;">Checkout</button>
        </div>
      </div>
    </div>
  `;
}

export function initCashierDashboard() {
  document.getElementById('logoutBtn').addEventListener('click', logout);
  loadProducts();
}

let cart = [];

async function loadProducts() {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: getAuthHeader()
    });

    const container = document.getElementById('products');
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
        ${response.data.map(p => `
          <div style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 5px;">
            <h4>${p.name}</h4>
            <p style="font-weight: bold; color: #667eea;">₹${p.price.toFixed(2)}</p>
            <p>Stock: ${p.stock}</p>
            <button onclick="window.addToCart(${p.id}, '${p.name}', ${p.price})" 
                    style="padding: 8px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer;">
              Add to Cart
            </button>
          </div>
        `).join('')}
      </div>
    `;

    window.addToCart = addToCart;
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('discountInput').addEventListener('input', updateCart);
  } catch (error) {
    document.getElementById('products').innerHTML = '<p style="color: red;">Error loading products</p>';
  }
}

function addToCart(id, name, price) {
  const existing = cart.find(item => item.product_id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ product_id: id, name, price, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  const container = document.getElementById('cartItems');
  if (cart.length === 0) {
    container.innerHTML = '<p>Cart is empty</p>';
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = parseFloat(document.getElementById('discountInput')?.value || 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  container.innerHTML = `
    ${cart.map((item, index) => `
      <div style="padding: 10px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${item.name}</strong><br>
          <small>₹${item.price.toFixed(2)} x ${item.quantity}</small>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</span>
          <button onclick="window.removeFromCart(${index})" 
                  style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">
            Remove
          </button>
        </div>
      </div>
    `).join('')}
    <div style="padding: 10px; border-top: 2px solid #667eea; margin-top: 10px;">
      <div style="display: flex; justify-content: space-between; margin: 5px 0;">
        <span>Subtotal:</span>
        <span>₹${subtotal.toFixed(2)}</span>
      </div>
      ${discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin: 5px 0; color: ${discount > 15 ? 'red' : 'green'};">
          <span>Discount (${discount}%):</span>
          <span>-₹${discountAmount.toFixed(2)}</span>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 18px; font-weight: bold;">
        <span>Total:</span>
        <span>₹${total.toFixed(2)}</span>
      </div>
    </div>
  `;
}

window.removeFromCart = (index) => {
  cart.splice(index, 1);
  updateCart();
};

async function checkout() {
  if (cart.length === 0) {
    alert('Cart is empty');
    return;
  }

  const discount = parseFloat(document.getElementById('discountInput').value || 0);
  const paymentMethod = document.getElementById('paymentMethod').value;

  if (discount < 0 || discount > 100) {
    alert('Invalid discount percentage');
    return;
  }

  try {
    const response = await axios.post(`${API_URL}/billing/transaction`, {
      items: cart,
      payment_method: paymentMethod,
      discount_percentage: discount
    }, {
      headers: getAuthHeader()
    });

    let message = `Transaction completed!\n\nSubtotal: ₹${response.data.subtotal.toFixed(2)}`;
    if (discount > 0) {
      message += `\nDiscount (${discount}%): -₹${response.data.discount_amount.toFixed(2)}`;
    }
    message += `\nTotal: ₹${response.data.total_amount.toFixed(2)}`;
    
    if (response.data.is_flagged) {
      message += `\n\n⚠️ WARNING: Transaction flagged for review!`;
      if (response.data.fraud_reasons && response.data.fraud_reasons.length > 0) {
        message += `\nReasons: ${response.data.fraud_reasons.join(', ')}`;
      }
    }

    alert(message);
    cart = [];
    document.getElementById('discountInput').value = 0;
    updateCart();
  } catch (error) {
    alert('Transaction failed: ' + (error.response?.data?.error || 'Unknown error'));
  }
}
