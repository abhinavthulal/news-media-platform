let editingId = null;

async function fetchNews() {
  const res = await fetch('/api/news');
  const data = await res.json();
  const list = document.getElementById('news-list');
  list.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.content}</p>
      <small>${new Date(item.date).toLocaleString()}</small>
      <div class="actions">
        <button class="edit-btn" data-id="${item._id}">Edit</button>
        <button class="delete-btn" data-id="${item._id}">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

// Form submit for create/update
const form = document.getElementById('form');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const url = editingId ? `/api/news/${editingId}` : '/api/news';
  const method = editingId ? 'PUT' : 'POST';
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
  // reset
  editingId = null;
  document.getElementById('submit-btn').textContent = 'Publish';
  form.reset();
  fetchNews();
});

// Delegate edit & delete
document.getElementById('news-list').addEventListener('click', async e => {
  const id = e.target.dataset.id;
  if (e.target.matches('.delete-btn')) {
    if (!confirm('Delete this article?')) return;
    await fetch(`/api/news/${id}`, { method: 'DELETE' });
    fetchNews();
  }
  if (e.target.matches('.edit-btn')) {
    // fetch single item or reuse list
    const res = await fetch('/api/news');
    const items = await res.json();
    const item = items.find(n => n._id === id);
    document.getElementById('title').value = item.title;
    document.getElementById('content').value = item.content;
    document.getElementById('submit-btn').textContent = 'Update';
    editingId = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// initial load
fetchNews();