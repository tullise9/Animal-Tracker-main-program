// src/services/weightService.js

const API_BASE_URL = 'http://localhost:5001'; // Weight microservice URL
const MOCK_USER_ID = 'user_12345';
let authToken = null;

// --- Step 1: Authenticate with the microservice ---
export async function loginAndGetToken() {
  const response = await fetch(`${API_BASE_URL}/auth/login-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: MOCK_USER_ID }),
  });
  if (!response.ok) throw new Error('Demo login failed');
  const data = await response.json();
  authToken = data.token; // Store the JWT
  return authToken;
}

// --- Step 2: Generic API Fetch function ---
async function apiFetch(url, options = {}) {
  if (!authToken) throw new Error('Auth token missing. Call loginAndGetToken first.');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
}

// --- Step 3: Microservice-specific functions ---
export async function getPet(petId) {
  return apiFetch(`${API_BASE_URL}/pets/${petId}`);
}

export async function addWeight(petId, weight, date) {
  return apiFetch(`${API_BASE_URL}/pets/${petId}/weights`, {
    method: 'POST',
    body: JSON.stringify({ weight, date }),
  });
}

export async function deleteWeight(petId, weightId) {
  return apiFetch(`${API_BASE_URL}/pets/${petId}/weights/${weightId}`, {
    method: 'DELETE',
  });
}
