require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Conectare la Baza de Date
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ BAZA DE DATE ESTE CONECTATĂ!'))
  .catch(err => console.error('❌ Eroare conexiune:', err));

// Rute de bază
app.get('/', (req, res) => {
    res.send('Serverul funcționează!');
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task șters' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serverul merge pe portul ${PORT}`));