import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_BASE_URL || "https://my-node-backend.azurewebsites.net/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");

    // Fetch tasks on load
    const fetchTasks = () => {
        axios.get(API_URL)
            .then((response) => setTasks(response.data))
            .catch((error) => console.error("Error fetching tasks:", error));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add task
    const addTask = async () => {
        if (!task.trim()) return;
        
        try {
            const response = await axios.post(API_URL, { task });
            setTasks([...tasks, { ...response.data, completed: false }]);
            setTask("");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchTasks();  // Fetch latest tasks after deletion
        } catch (error) {
            console.error("Error deleting task:", error);
        }
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
            <h1>📝 To-Do Application</h1>
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