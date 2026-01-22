// const api = "/links";
// const list = document.getElementById("urlList");
// const form = document.getElementById("addForm");
// const input = document.getElementById("urlInput");
// const logoutBtn = document.getElementById("logoutBtn");

// const token = localStorage.getItem('token');
// if (!token) window.location.href = '/login.html';

// const headers = {
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${token}`
// };

// // Fetch all links
// async function loadLinks() {
//   try {
//     const res = await fetch(api, { headers });
//     const data = await res.json();
//     const links = data.links || [];
//     list.innerHTML = '';

//     links.forEach(l => {
//       const tr = document.createElement('tr');
//       tr.innerHTML = `
//         <td>${l.url}</td>
//         <td class="${l.status === 'up' ? 'status-up' : 'status-down'}">
//           ${l.status || '-'}
//         </td>
//         <td>${l.lastChecked || '-'}</td>
//         <td><button onclick="deleteLink('${l.id}')">❌ Delete</button></td>
//       `;
//       list.appendChild(tr);
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// // Add new link
// form.addEventListener('submit', async e => {
//   e.preventDefault();
//   const url = input.value.trim();
//   if (!url) return;

//   try {
//     await fetch(api, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({ url })
//     });
//     input.value = '';
//     loadLinks();
//   } catch (err) {
//     console.error(err);
//   }
// });

// // Delete link
// async function deleteLink(id) {
//   try {
//     await fetch(`${api}/${id}`, { method: 'DELETE', headers });
//     loadLinks();
//   } catch (err) {
//     console.error(err);
//   }
// }

// // Logout
// logoutBtn.addEventListener('click', () => {
//   localStorage.removeItem('token');
//   window.location.href = '/login.html';
// });

// // Initial load & refresh every 10 seconds
// loadLinks();
// setInterval(loadLinks, 10000);



requireAuth();

const list = document.getElementById("urlList");
const form = document.getElementById("addForm");
const input = document.getElementById("urlInput");

async function loadLinks() {
  const res = await fetch('/links', { headers: authHeaders() });
  if (res.status === 401) logout();

  const data = await res.json();
  list.innerHTML = '';

  data.links.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.url}</td>
      <td class="${l.status === 'up' ? 'status-up' : 'status-down'}">${l.status}</td>
      <td>${l.lastChecked || '-'}</td>
      <td><button onclick="deleteLink('${l.id}')">Delete</button></td>
    `;
    list.appendChild(tr);
  });
}

form.onsubmit = async e => {
  e.preventDefault();
  await fetch('/links', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ url: input.value })
  });
  input.value = '';
  loadLinks();
};

async function deleteLink(id) {
  await fetch(`/links/${id}`, { method: 'DELETE', headers: authHeaders() });
  loadLinks();
}

document.getElementById('logoutBtn').onclick = logout;

loadLinks();
setInterval(loadLinks, 10000);
