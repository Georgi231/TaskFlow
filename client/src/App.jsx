import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  // 1. ADUCEM DATELE (READ)
  const fetchTasks = () => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Eroare la fetch:", err))
  }

  // Se apelează automat când intrăm pe site
  useEffect(() => {
    fetchTasks()
  }, [])

  // 2. ADĂUGĂM UN TASK NOU (CREATE)
  const addTask = async () => {
    if (!title) return;
    try {
      await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, status: 'todo' })
      })
      setTitle('') // Golim căsuța
      fetchTasks() // Reîmprospătăm lista
    } catch (error) {
      console.error("Eroare la adăugare:", error)
    }
  }

  // 3. ȘTERGEM UN TASK (DELETE)
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE'
      })
      fetchTasks()
    } catch (error) {
      console.error("Eroare la ștergere:", error)
    }
  }

  // 4. MUTĂM UN TASK (UPDATE)
  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchTasks()
    } catch (error) {
      console.error("Eroare la actualizare:", error)
    }
  }

  // --- COMPONENTA VIZUALĂ PENTRU UN CARD ---
  const TaskCard = ({ task }) => (
    <div key={task._id} style={{ 
      background: 'white', 
      padding: '15px', 
      borderRadius: '8px', 
      marginBottom: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
        {task.title}
      </div>
      
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between' }}>
        {/* Butoane de navigare Stânga/Dreapta */}
        <div>
          {task.status !== 'todo' && 
            <button onClick={() => updateStatus(task._id, 'todo')} style={btnStyle}>⬅ To Do</button>}
          
          {task.status === 'todo' && 
            <button onClick={() => updateStatus(task._id, 'in-progress')} style={btnStyle}>Start ➡</button>}
          
          {task.status === 'in-progress' && 
            <button onClick={() => updateStatus(task._id, 'done')} style={btnStyle}>Gata ➡</button>}
          
           {task.status === 'done' && 
            <button onClick={() => updateStatus(task._id, 'in-progress')} style={btnStyle}>⬅ Înapoi</button>}
        </div>

        {/* Buton Ștergere */}
        <button 
          onClick={() => deleteTask(task._id)} 
          style={{ ...btnStyle, background: '#ff4d4f', color: 'white' }}
        >
          X
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif', background: '#222', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>TaskFlow 🚀</h1>

      {/* INPUTUL DE SUS */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <input 
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ce ai de făcut azi?"
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: 'none', marginRight: '10px' }}
        />
        <button onClick={addTask} style={{ padding: '12px 25px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Adaugă Task
        </button>
      </div>

      {/* --- BOARD-UL CU 3 COLOANE --- */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        
        {/* Coloana 1 */}
        <div style={columnStyle}>
          <h3 style={{ borderBottom: '2px solid #ffa940', paddingBottom: '10px' }}>📌 DE FĂCUT</h3>
          {tasks.filter(t => t.status === 'todo').map(task => <TaskCard task={task} />)}
        </div>

        {/* Coloana 2 */}
        <div style={columnStyle}>
          <h3 style={{ borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>🚧 ÎN LUCRU</h3>
          {tasks.filter(t => t.status === 'in-progress').map(task => <TaskCard task={task} />)}
        </div>

        {/* Coloana 3 */}
        <div style={columnStyle}>
          <h3 style={{ borderBottom: '2px solid #52c41a', paddingBottom: '10px' }}>✅ FINALIZAT</h3>
          {tasks.filter(t => t.status === 'done').map(task => <TaskCard task={task} />)}
        </div>

      </div>
    </div>
  )
}

// Stiluri simple ținute la final ca să nu încarce codul
const columnStyle = {
  background: '#333', 
  padding: '15px', 
  borderRadius: '10px', 
  width: '300px', 
  minHeight: '300px'
}

const btnStyle = {
  padding: '5px 10px', 
  fontSize: '12px', 
  cursor: 'pointer', 
  marginRight: '5px',
  borderRadius: '4px',
  border: 'none',
  background: '#ddd'
}

export default App