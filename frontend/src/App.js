import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:4000/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");

    // Fetch tasks on load
    useEffect(() => {
        axios.get(API_URL).then((response) => setTasks(response.data));
    }, []);

    // Add task
    const addTask = async () => {
        if (!task.trim()) return;
        const response = await axios.post(API_URL, { task });
        setTasks([...tasks, { ...response.data, completed: false }]);
        setTask("");
    };

    // Delete task
    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    // Toggle task completion
    const toggleTask = (id) => {
        setTasks(
            tasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    return (
        <div className="container">
            <h1>To-Do List</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter task..."
                />
                <button onClick={addTask}>Add</button>
            </div>
            <ul>
                {tasks.map((t) => (
                    <li key={t.id} className={t.completed ? "completed" : ""}>
                        <span onClick={() => toggleTask(t.id)}>{t.task}</span>
                        <button className="delete-btn" onClick={() => deleteTask(t.id)}>
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;