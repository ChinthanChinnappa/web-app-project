import axios from 'axios';
import { logout, getAuthHeader } from '../utils/Auth.js';

const API_URL = 'http://localhost:3000/api';

export function renderAdminDashboard() {
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Admin Dashboard - Fraud Detection</h1>
        <button id="logoutBtn" class="btn-logout">Logout</button>
      </div>
      <div class="dashboard-content">
        <div style="margin-bottom: 30px;">
          <button id="showFlaggedBtn" class="tab-btn active">Flagged Transactions</button>
          <button id="showProductsBtn" class="tab-btn">Manage Products</button>
        </div>
        <div id="flaggedTransactions">Loading...</div>
        <div id="productManagement" style="display: none;"></div>
      </div>
    </div>
  `;
}

export function initAdminDashboard() {
  document.getElementById('logoutBtn').addEventListener('click', logout);
  
  document.getElementById('showFlaggedBtn').addEventListener('click', () => {
    document.getElementById('flaggedTransactions').style.display = 'block';
    document.getElementById('productManagement').style.display = 'none';
    document.getElementById('showFlaggedBtn').classList.add('active');
    document.getElementById('showProductsBtn').classList.remove('active');
  });
  
  document.getElementById('showProductsBtn').addEventListener('click', () => {
    document.getElementById('flaggedTransactions').style.display = 'none';
    document.getElementById('productManagement').style.display = 'block';
    document.getElementById('showFlaggedBtn').classList.remove('active');
    document.getElementById('showProductsBtn').classList.add('active');
    loadProducts();
  });
  
  loadFlaggedTransactions();
}

async function loadFlaggedTransactions() {
  try {
    const response = await axios.get(`${API_URL}/fraud/flagged`, {
      headers: getAuthHeader()
    });

    const container = document.getElementById('flaggedTransactions');
    if (response.data.length === 0) {
      container.innerHTML = '<p>No flagged transactions found.</p>';
      return;
    }

    container.innerHTML = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">ID</th>
            <th style="padding: 10px; text-align: left;">Cashier</th>
            <th style="padding: 10px; text-align: left;">Amount</th>
            <th style="padding: 10px; text-align: left;">Fraud Score</th>
            <th style="padding: 10px; text-align: left;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${response.data.map(t => `
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px;">${t.id}</td>
              <td style="padding: 10px;">${t.cashier_name}</td>
              <td style="padding: 10px;">₹${t.total_amount.toFixed(2)}</td>
              <td style="padding: 10px; color: ${t.fraud_score > 70 ? 'red' : 'orange'};">${t.fraud_score}${t.discount_percentage > 15 ? ` (${t.discount_percentage}% discount)` : ''}</td>
              <td style="padding: 10px;">${new Date(t.created_at).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    document.getElementById('flaggedTransactions').innerHTML = 
      '<p style="color: red;">Error loading transactions</p>';
  }
}


async function loadProducts() {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: getAuthHeader()
    });

    const container = document.getElementById('productManagement');
    container.innerHTML = `
      <div style="margin-bottom: 20px;">
        <button id="addProductBtn" class="btn-primary" style="width: auto; padding: 10px 20px;">Add New Product</button>
      </div>
      <div id="addProductForm" style="display: none; background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3>Add New Product</h3>
        <input type="text" id="newProductName" placeholder="Product Name" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">
        <input type="number" id="newProductPrice" placeholder="Price (₹)" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">
        <input type="number" id="newProductStock" placeholder="Stock" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">
        <input type="text" id="newProductCategory" placeholder="Category" style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 3px;">
        <button id="saveNewProductBtn" class="btn-primary" style="width: auto; padding: 10px 20px; margin-right: 10px;">Save</button>
        <button id="cancelNewProductBtn" style="width: auto; padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">ID</th>
            <th style="padding: 10px; text-align: left;">Name</th>
            <th style="padding: 10px; text-align: left;">Price (₹)</th>
            <th style="padding: 10px; text-align: left;">Stock</th>
            <th style="padding: 10px; text-align: left;">Category</th>
            <th style="padding: 10px; text-align: left;">Actions</th>
          </tr>
        </thead>
        <tbody id="productsTableBody">
          ${response.data.map(p => `
            <tr style="border-bottom: 1px solid #e0e0e0;" data-id="${p.id}">
              <td style="padding: 10px;">${p.id}</td>
              <td style="padding: 10px;">
                <span class="view-mode">${p.name}</span>
                <input type="text" class="edit-mode" value="${p.name}" style="display: none; width: 100%; padding: 5px;">
              </td>
              <td style="padding: 10px;">
                <span class="view-mode">₹${p.price.toFixed(2)}</span>
                <input type="number" class="edit-mode" value="${p.price}" style="display: none; width: 100%; padding: 5px;">
              </td>
              <td style="padding: 10px;">
                <span class="view-mode">${p.stock}</span>
                <input type="number" class="edit-mode" value="${p.stock}" style="display: none; width: 100%; padding: 5px;">
              </td>
              <td style="padding: 10px;">
                <span class="view-mode">${p.category}</span>
                <input type="text" class="edit-mode" value="${p.category}" style="display: none; width: 100%; padding: 5px;">
              </td>
              <td style="padding: 10px;">
                <button class="edit-btn" style="padding: 5px 10px; background: #667eea; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">Edit</button>
                <button class="save-btn" style="display: none; padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">Save</button>
                <button class="cancel-btn" style="display: none; padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;">Cancel</button>
                <button class="delete-btn" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', () => {
      document.getElementById('addProductForm').style.display = 'block';
    });

    document.getElementById('cancelNewProductBtn').addEventListener('click', () => {
      document.getElementById('addProductForm').style.display = 'none';
    });

    document.getElementById('saveNewProductBtn').addEventListener('click', async () => {
      const name = document.getElementById('newProductName').value;
      const price = document.getElementById('newProductPrice').value;
      const stock = document.getElementById('newProductStock').value;
      const category = document.getElementById('newProductCategory').value;

      if (!name || !price || !stock || !category) {
        alert('All fields are required');
        return;
      }

      try {
        await axios.post(`${API_URL}/products`, {
          name, price: parseFloat(price), stock: parseInt(stock), category
        }, { headers: getAuthHeader() });
        
        alert('Product added successfully');
        loadProducts();
      } catch (error) {
        alert('Failed to add product');
      }
    });

    // Edit/Save/Cancel/Delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        row.querySelectorAll('.view-mode').forEach(el => el.style.display = 'none');
        row.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'block');
        row.querySelector('.edit-btn').style.display = 'none';
        row.querySelector('.save-btn').style.display = 'inline-block';
        row.querySelector('.cancel-btn').style.display = 'inline-block';
      });
    });

    document.querySelectorAll('.cancel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        row.querySelectorAll('.view-mode').forEach(el => el.style.display = 'inline');
        row.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'none');
        row.querySelector('.edit-btn').style.display = 'inline-block';
        row.querySelector('.save-btn').style.display = 'none';
        row.querySelector('.cancel-btn').style.display = 'none';
      });
    });

    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        const id = row.dataset.id;
        const inputs = row.querySelectorAll('.edit-mode');
        
        try {
          await axios.put(`${API_URL}/products/${id}`, {
            name: inputs[0].value,
            price: parseFloat(inputs[1].value),
            stock: parseInt(inputs[2].value),
            category: inputs[3].value
          }, { headers: getAuthHeader() });
          
          alert('Product updated successfully');
          loadProducts();
        } catch (error) {
          alert('Failed to update product');
        }
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        const row = e.target.closest('tr');
        const id = row.dataset.id;
        
        try {
          await axios.delete(`${API_URL}/products/${id}`, {
            headers: getAuthHeader()
          });
          
          alert('Product deleted successfully');
          loadProducts();
        } catch (error) {
          alert('Failed to delete product');
        }
      });
    });

  } catch (error) {
    document.getElementById('productManagement').innerHTML = 
      '<p style="color: red;">Error loading products</p>';
  }
}
