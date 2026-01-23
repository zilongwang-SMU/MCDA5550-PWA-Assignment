import "./App.css";
import { useState } from "react";

type Task = {
  id: string;
  text: string;
  date: string; // "YYYY-MM-DD"
};

function App() {
  const [taskText, setTaskText] = useState<string>("");
  const [taskDate, setTaskDate] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Buy groceries", date: "2026-06-05" },
    { id: "2", text: "Schedule a meeting", date: "2026-01-22" },
    { id: "3", text: "Submit assignment", date: "2026-05-20" },
  ]);

  const addTask = () => {
    // basic validation
    if (!taskText.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(), // modern unique id
      text: taskText.trim(),
      date: taskDate, // can be empty if user didn't pick
    };

    setTasks((prev) => [newTask, ...prev]); // add to top
    setTaskText("");
    setTaskDate("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const formatDate = (date: string) => {
    if (!date) return "No due date";
    return date; // keep simple; you can beautify later
  };

  // OPTIONAL: simple color based on due date
  const getTaskColorClass = (date: string) => {
    if (!date) return "yellow";
    const today = new Date();
    const due = new Date(date + "T00:00:00");

    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= 0) return "red";
    if (diffDays <= 3) return "orange";
    return "yellow";
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
                {task.text} (Due: {formatDate(task.date)})
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
