require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?ssl=true&retryWrites=false&directConnection=true`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection;

// Connect to MongoDB and get the collection
async function connectDB() {
    try {
        await client.connect();
        const db = client.db(process.env.MONGO_DB_NAME);
        collection = db.collection(process.env.MONGO_COLLECTION_NAME);
        console.log("✅ Connected to Cosmos DB (MongoDB API)");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
}
connectDB();

// 📌 Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await collection.find().toArray();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Add a new task
app.post("/tasks", async (req, res) => {
    try {
        const { task } = req.body;
        const newTask = { id: Date.now().toString(), task, completed: false };
        await collection.insertOne(newTask);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Delete a task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await collection.deleteOne({ id });
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Toggle task completion
app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { task, completed } = req.body;
        const updatedTask = { id, task, completed };
        await collection.updateOne({ id }, { $set: updatedTask });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));