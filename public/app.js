// let token = null;

// // Elements
// const authDiv = document.getElementById('auth');
// const dashboard = document.getElementById('dashboard');
// const authMsg = document.getElementById('authMsg');
// const linksList = document.getElementById('linksList');

// document.getElementById('loginBtn').onclick = login;
// document.getElementById('registerBtn').onclick = register;
// document.getElementById('addUrlBtn').onclick = addUrl;
// document.getElementById('logoutBtn').onclick = logout;

// async function login() {
//   const phone = document.getElementById('phone').value;
//   const password = document.getElementById('password').value;

//   const res = await fetch('/auth/login', {
//     method: 'POST',
//     headers: {'Content-Type':'application/json'},
//     body: JSON.stringify({ phone, password })
//   });
//   const data = await res.json();
//   if (res.ok) {
//     token = data.token;
//     showDashboard();
//     loadLinks();
//   } else {
//     authMsg.innerText = data.error;
//   }
// }

// async function register() {
//   const phone = document.getElementById('phone').value;
//   const password = document.getElementById('password').value;
//   const firstName = prompt('First Name:');
//   const lastName = prompt('Last Name:');

//   const res = await fetch('/users', {
//     method: 'POST',
//     headers: {'Content-Type':'application/json'},
//     body: JSON.stringify({ firstName, lastName, phone, password, tosAgreement: true })
//   });
//   const data = await res.json();
//   authMsg.innerText = data.message || data.error;
// }

// function showDashboard() {
//   authDiv.style.display = 'none';
//   dashboard.style.display = 'block';
// }

// async function loadLinks() {
//   const res = await fetch('/links', {
//     headers: { 'token': token }
//   });
//   const data = await res.json();
//   linksList.innerHTML = '';
//   data.links.forEach(l => {
//     const li = document.createElement('li');
//     li.innerHTML = `${l.url} - <span class="${l.status}">${l.status}</span> (Last Checked: ${l.lastChecked || '-'}) <button onclick="deleteLink('${l.id}')">Delete</button>`;
//     linksList.appendChild(li);
//   });
// }

// async function addUrl() {
//   const url = document.getElementById('newUrl').value;
//   if (!url) return;
//   await fetch('/links', {
//     method: 'POST',
//     headers: { 'Content-Type':'application/json', 'token': token },
//     body: JSON.stringify({ url })
//   });
//   document.getElementById('newUrl').value = '';
//   loadLinks();
// }

// async function deleteLink(id) {
//   await fetch(`/links/${id}`, {
//     method: 'DELETE',
//     headers: { token }
//   });
//   loadLinks();
// }

// function logout() {
//   token = null;
//   dashboard.style.display = 'none';
//   authDiv.style.display = 'block';
// }






const api = "/links";
const list = document.getElementById("urlList");
const form = document.getElementById("addForm");
const input = document.getElementById("urlInput");
const logoutBtn = document.getElementById("logoutBtn");

const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Fetch all links
async function loadLinks() {
  try {
    const res = await fetch(api, { headers });
    const data = await res.json();
    const links = data.links || [];
    list.innerHTML = '';

    links.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${l.url}</td>
        <td class="${l.status === 'up' ? 'status-up' : 'status-down'}">
          ${l.status || '-'}
        </td>
        <td>${l.lastChecked || '-'}</td>
        <td><button onclick="deleteLink('${l.id}')">❌ Delete</button></td>
      `;
      list.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
  }
}

// Add new link
form.addEventListener('submit', async e => {
  e.preventDefault();
  const url = input.value.trim();
  if (!url) return;

  try {
    await fetch(api, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url })
    });
    input.value = '';
    loadLinks();
  } catch (err) {
    console.error(err);
  }
});

// Delete link
async function deleteLink(id) {
  try {
    await fetch(`${api}/${id}`, { method: 'DELETE', headers });
    loadLinks();
  } catch (err) {
    console.error(err);
  }
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});

// Initial load & refresh every 10 seconds
loadLinks();
setInterval(loadLinks, 10000);
