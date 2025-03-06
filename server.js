import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// **Connect to MongoDB**
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/student_notes"; // Change DB name if needed
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// **Define Schema & Model**
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  subject: String,
  semester: String,
  course: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);

// **API Routes**
app.get("/", (req, res) => {
  res.send("📚 Student Notes API is running...");
});

// ✅ **Route to Fetch All Notes**
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ **Route to Add a New Note**
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content, subject, semester, course } = req.body;
    const newNote = new Note({ title, content, subject, semester, course });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("❌ Error adding note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ **Route to Delete a Note**
app.delete("/api/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Note deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
