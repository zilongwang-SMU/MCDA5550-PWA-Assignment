import "./App.css";
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD or ""
};

function App() {
  //  Load tasks safely from localStorage (prevents refresh wipe)
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? (JSON.parse(stored) as Task[]) : [];
  });

  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState("");

  //  Compute nextId from existing tasks
  const nextId = useMemo(() => {
    if (tasks.length === 0) return 1;
    const maxId = Math.max(...tasks.map((t) => Number(t.id) || 0));
    return maxId + 1;
  }, [tasks]);

  //  Persist tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: String(nextId),
      text: taskText.trim(),
      date: taskDate,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskText("");
    setTaskDate("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const formatDue = (date: string) => (date ? date : "No date");

  //  FINAL deadline color logic
  const getTaskColorClass = (date: string) => {
    if (!date) return "green"; // no deadline = safe

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(date + "T00:00:00");
    const diffDays = Math.floor((due.getTime() - today.getTime()) / 86400000);

    if (diffDays < 0) return "red"; //  passed
    if (diffDays < 3) return "orange"; //  < 3 days
    if (diffDays <= 7) return "yellow"; //  within a week
    return "green"; //  more than a week
  };

  return (
    <div className="app-container">
      {/* Quote Section */}
      <section className="quote-box">
        <p className="quote-text">
          “Believe you can and you're halfway there.”
        </p>
        <p className="quote-author">— Theodore Roosevelt</p>
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

      {/* Offline Indicator (static for now) */}
      <footer className="status-bar">
        <span className="online">🟢 Online</span>
        <span className="offline">⚠️ Offline Mode</span>
      </footer>
    </div>
  );
}

export default App;
