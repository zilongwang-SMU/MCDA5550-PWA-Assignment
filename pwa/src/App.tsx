import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./db";
import type { Task as DBTask } from "./db";

type Task = {
  id: number; // numeric from IndexedDB
  text: string;
  date: string;
};

type Quote = {
  text: string;
  author: string;
};

const quotes: Quote[] = [
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "It always seems impossible until it’s done.",
    author: "Nelson Mandela",
  },
  {
    text: "Small steps every day add up to big results.",
    author: "Unknown",
  },
];

function App() {
  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  //  random quote state
  const [quote, setQuote] = useState<Quote>(quotes[0]);

  //  pick a random quote once when app loads
  useEffect(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[idx]);
  }, []);

  // online/offline state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // listen for online/offline changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // LOAD from IndexedDB (runs once)
  useEffect(() => {
    const load = async () => {
      const all = await db.tasks.toArray();

      const normalized: Task[] = all
        .filter((t) => typeof t.id === "number")
        .map((t) => ({ id: t.id as number, text: t.text, date: t.date }));

      normalized.sort((a, b) => b.id - a.id);
      setTasks(normalized);
    };

    load();
  }, []);

  const addTask = async () => {
    if (!taskText.trim()) return;

    const newTask: DBTask = {
      text: taskText.trim(),
      date: taskDate,
    };

    const id = await db.tasks.add(newTask);

    setTasks((prev) => [
      { id, text: newTask.text, date: newTask.date },
      ...prev,
    ]);

    setTaskText("");
    setTaskDate("");
  };

  const deleteTask = async (id: number) => {
    await db.tasks.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const formatDue = (date: string) => (date ? date : "No date");

  const getTaskColorClass = (date: string) => {
    if (!date) return "green";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date + "T00:00:00");

    const diffDays = Math.floor((due.getTime() - today.getTime()) / 86400000);

    if (diffDays < 0) return "red";
    if (diffDays < 3) return "orange";
    if (diffDays <= 7) return "yellow";
    return "green";
  };

  return (
    <div className="app-container">
      {/* Quote Section */}
      <section className="quote-box">
        <p className="quote-text">“{quote.text}”</p>
        <p className="quote-author">— {quote.author}</p>
      </section>

      {/* Add Task Section */}
      <section className="add-task">
        <h2>Add New Task</h2>
        <div className="task-form">
          <input
            type="text"
            placeholder="Task description"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      </section>

      {/* To-Do List */}
      <section className="todo-list">
        <h2>To-Do List</h2>

        {tasks.length === 0 ? (
          <p className="empty-text">No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${getTaskColorClass(task.date)}`}
            >
              <span>
                {task.text} (Due: {formatDue(task.date)})
              </span>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          ))
        )}
      </section>

      {/* show only ONE status based on connectivity */}
      <footer className="status-bar">
        {isOnline ? (
          <span className="online">🟢 Online</span>
        ) : (
          <span className="offline">⚠️ Offline </span>
        )}
      </footer>
    </div>
  );
}

export default App;
