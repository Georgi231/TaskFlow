const mongoose = require('mongoose');

// Aici definim "Regulile" pentru un Task
// Baza de date nu va accepta date care nu respectă aceste reguli
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // E obligatoriu să aibă un titlu
  },
  description: {
    type: String, // Descrierea e opțională
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'], // Doar aceste 3 statusuri sunt permise
    default: 'todo', // Orice task nou începe ca "To Do"
  },
  createdAt: {
    type: Date,
    default: Date.now, // Se pune automat data și ora curentă
  }
});

module.exports = mongoose.model('Task', TaskSchema);