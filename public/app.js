async function fetchNews() {
  const res = await fetch('/api/news');
  const data = await res.json();
  const list = document.getElementById('news-list');
  list.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p><small>${new Date(item.date).toLocaleString()}</small>`;
    list.appendChild(div);
  });
}

// Handle form submission
document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  await fetch('/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  });
  document.getElementById('form').reset();
  fetchNews();
});

// Initial fetch
fetchNews();
