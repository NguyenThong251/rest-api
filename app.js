const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Cấu hình MongoDB Atlas
const dbConfig = require("./config");

// Dữ liệu giả định (mock data)
const mockData = {
  users: [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  ],
};

// Schema và Model cho MongoDB
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("user", userSchema);

// Kết nối đến MongoDB Atlas
mongoose
  .connect(dbConfig.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Tạo endpoint trả về JSON
app.get("/api/data", async (req, res) => {
  try {
    // Kiểm tra kết nối đến MongoDB
    if (mongoose.connection.readyState === 1) {
      const users = await User.find();
      res.json(users);
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    console.log(error);
    // Trả về dữ liệu giả định nếu kết nối thất bại
    res.json(mockData.users);
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
