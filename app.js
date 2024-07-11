const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Cấu hình MongoDB Atlas
const dbConfig = require("./config");

// Middleware để xử lý JSON
app.use(express.json()); // Thêm middleware này để parse JSON

// Dữ liệu giả định (mock data)
const mockData = {
  users: [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  ],
};

// Schema và Model cho MongoDB
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  { versionKey: false }
);
const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
  },
  { versionKey: false }
);
const User = mongoose.model("user", userSchema);
const Product = mongoose.model("product", productSchema);

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

// Tạo get endpoint product  trả về JSON
app.get("/products", async (req, res) => {
  try {
    // Kiểm tra kết nối đến MongoDB
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find();
      res.json(products);
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    console.log(error);
    // Trả về dữ liệu giả định nếu kết nối thất bại
    res.json(mockData.products);
  }
});
// endpoint post product
app.post("/products", async (req, res) => {
  const { name, price } = req.body;
  try {
    const newProduct = new Product({ name, price });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create product", error });
  }
});
// Tạo endpoint DELETE để xóa product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      const result = await Product.findByIdAndDelete(id);
      if (result) {
        res.json({ message: "Product deleted successfully", product: result });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete product", error });
  }
});
// Tạo endpoint PUT để cập nhật product theo id
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, price },
        { new: true } // Trả về document đã được cập nhật
      );
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update product", error });
  }
});
// Tạo get endpoint user  trả về JSON
app.get("/users", async (req, res) => {
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
// Tạo endpoint DELETE để xóa user theo id
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      const result = await User.findByIdAndDelete(id);
      if (result) {
        res.json({ message: "User deleted successfully", user: result });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user", error });
  }
});
// Tạo endpoint PUT để cập nhật user theo id
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true } // Trả về document đã được cập nhật
      );
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user", error });
  }
});
// Tạo endpoint POST để thêm user mới
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = new User({ name, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user", error });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
