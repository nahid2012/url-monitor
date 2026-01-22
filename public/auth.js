function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

function requireAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
  }
}

function logout() {
  localStorage.clear();
  window.location.href = '/login.html';
}

function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}
