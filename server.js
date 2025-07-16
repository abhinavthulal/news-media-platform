const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// News Schema & Model
const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now }
});
const News = mongoose.model('News', newsSchema);

// Routes
app.get('/api/news', async (req, res) => {
  const news = await News.find().sort({ date: -1 });
  res.json(news);
});

app.post('/api/news', async (req, res) => {
  const { title, content } = req.body;
  const newItem = new News({ title, content });
  await newItem.save();
  res.json(newItem);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// DELETE /api/news/:id
app.delete('/api/news/:id', async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Article not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/news/:id
app.put('/api/news/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Article not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
