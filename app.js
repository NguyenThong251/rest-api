const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
// Cấu hình MongoDB Atlas
const dbConfig = require("./config");

// Middleware để xử lý JSON
app.use(express.json());
app.use(cors());

const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Thumbnail = require("./models/Thumbnail");
const Table = require("./models/Table");
const Order = require("./models/Order");
const Cart = require("./models/Cart");
const OrderChef = require("./models/OrderChef");
const Voucher = require("./models/Voucher");
const Bill = require("./models/Bill");
mongoose
  .connect(dbConfig.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
// BILL
app.post("/bill", async (req, res) => {
  try {
    const data = ({ user_id, products, total, table_id, date } = req.body);
    console.log(data);
    // Kiểm tra dữ liệu đầu vào
    if (!table_id || !total || !products || !user_id || !date) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Tạo một đối tượng Category mới
    const newBill = new Bill({
      user_id,
      products,
      total,
      table_id,
      date,
    });

    await newBill.save();

    res.status(201).json(newBill);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Bill", error });
  }
});

// VOUCHER
// GET
app.get("/vouchers", async (req, res) => {
  try {
    const voucher = await Voucher.find();

    res.json(voucher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Table", error });
  }
});
// GET ID
app.get("/vouchers/:id", async (req, res) => {
  try {
    const VoucherId = req.params.id;
    const voucher = await Voucher.findById(VoucherId);
    res.json(voucher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Voucher", error });
  }
});
// POST
app.post("/vouchers", async (req, res) => {
  try {
    const { users, discount, point, status } = req.body;
    // console.log(users, discount, point, status);
    if (!discount || !point) {
      return res.status(400).json({ message: "không thành công" });
    }

    const newVoucher = new Voucher({
      users,
      discount,
      point,
      status,
    });

    await newVoucher.save();

    res.status(201).json(newVoucher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Voucher", error });
  }
});
// PUT
app.put("/vouchers/:id", async (req, res) => {
  const { id } = req.params;
  const { users, discount, point, status } = req.body;
  console.log(users, discount, point, status);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }
  if (!discount || !point) {
    return res.status(400).json({ message: "lỗi" });
  }

  try {
    const updatedVoucher = await Voucher.findOneAndUpdate(
      { _id: id },
      { users, discount, point, status },
      { new: true }
    );

    if (updatedVoucher) {
      res.json(updatedVoucher);
    } else {
      res.status(404).json({ message: "Table not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update voucher", error });
  }
});
// ORDER CHEF
// POST
app.post("/orderchef", async (req, res) => {
  try {
    const { table_id, products, date, status } = req.body;
    // Kiểm tra dữ liệu đầu vào
    // console.log(table_id, products, date, status);
    if (!table_id || !products || !date) {
      return res.status(400).json({ message: "lỗi" });
    }
    // Kiểm tra xem status có giá trị hợp lệ hay không
    const allowedStatuses = ["pending", "completed", "canceled"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    // Tạo một đối tượng Category mới
    const newOrderchef = new OrderChef({
      table_id,
      products,
      date,
      status,
    });

    await newOrderchef.save();

    res.status(201).json(newOrderchef);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Order", error });
  }
});

// CART
// DELETE
app.delete("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Cart.findOneAndDelete({ user_id: userId });

    if (result) {
      res.json({ message: "Table deleted successfully", table: result });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete Order", error });
  }
});
// GET ID
app.get("/cart/:userId", async (req, res) => {
  try {
    const cartId = req.params.userId;
    const cart = await Cart.findOne({ user_id: cartId });
    console.log(cart);
    res.json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Cart", error });
  }
});
app.post("/cart", async (req, res) => {
  try {
    const { products, user_id } = req.body;
    if (!products || !user_id) {
      return res.status(400).json({ message: "không thành công" });
    }

    const newCart = new Cart({
      products,
      user_id,
    });

    await newCart.save();

    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Order", error });
  }
});
//  PUT
app.put("/cart/:id", async (req, res) => {
  const { id } = req.params;
  const { products, user_id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }
  if (!products || !user_id) {
    return res.status(400).json({ message: "lỗi" });
  }

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user_id: id },
      { products, user_id },
      { new: true }
    );

    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: "Table not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update category", error });
  }
});
// ORDER

// GET ID
app.get("/order/:id", async (req, res) => {
  try {
    const OrderId = req.params.id;
    const order = await Order.findById(OrderId);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Order", error });
  }
});
app.get("/order", async (req, res) => {
  try {
    const table = await Order.find();
    res.json(table);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Table", error });
  }
});
//  PUT
app.put("/order/:id", async (req, res) => {
  const { id } = req.params;
  const { table_id, sub_total, products, user_id } = req.body;

  try {
    if (!table_id || !sub_total || !products) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { table_id, sub_total, products, user_id },
      { new: true } // Trả về document đã được cập nhật
    );

    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Table not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update category", error });
  }
});
// POST
app.post("/order", async (req, res) => {
  try {
    const { table_id, sub_total, products, user_id } = req.body;
    console.log(user_id);
    // Kiểm tra dữ liệu đầu vào
    if (!table_id || !sub_total || !products) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Tạo một đối tượng Category mới
    const newOrder = new Order({
      table_id,
      sub_total,
      products,
      user_id,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Order", error });
  }
});
// DELETE
app.delete("/order/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Order.findByIdAndDelete(id);

    if (result) {
      res.json({ message: "Table deleted successfully", table: result });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete Order", error });
  }
});
// TABLE
app.get("/table", async (req, res) => {
  try {
    const table = await Table.find();
    res.json(table);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Table", error });
  }
});
// POST category
app.post("/table", async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Tạo một đối tượng Category mới
    const newTable = new Table({
      name,
    });

    // Lưu đối tượng Category vào MongoDB
    await newTable.save();

    // Trả về thông tin của Category vừa được tạo
    res.status(201).json(newTable);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create Table", error });
  }
});
// PUT category
app.put("/table/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { name },
      { new: true } // Trả về document đã được cập nhật
    );

    if (updatedTable) {
      res.json(updatedTable);
    } else {
      res.status(404).json({ message: "Table not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update category", error });
  }
});
// DELETE tbale
app.delete("/table/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Table.findByIdAndDelete(id);

    if (result) {
      res.json({ message: "Table deleted successfully", table: result });
    } else {
      res.status(404).json({ message: "Table not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete Table", error });
  }
});
// GET ID
app.get("/table/:id", async (req, res) => {
  try {
    const tbaleId = req.params.id;
    const table = await Table.findById(tbaleId);
    res.json(table);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get Table", error });
  }
});
//Tạo endpoint GET để lấy danh sách products kèm theo categories và thumbnails
app.get("/products", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "thumbnails",
            localField: "_id",
            foreignField: "product_id",
            as: "thumbnails",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            description: 1,
            seller: 1,
            quantity: 1,
            category: {
              _id: "$category._id",
              name: "$category.name",
              image: "$category.image",
            },
            thumbnails: {
              $map: {
                input: "$thumbnails",
                as: "thumb",
                in: "$$thumb.image",
              },
            },
          },
        },
      ]);
      console.log("Products:", products);
      res.json(products);
    } else {
      throw new Error("MongoDB not connected");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get products", error });
  }
});
// Get product by ID with category and thumbnails
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const results = await Product.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(productId) },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "thumbnails",
          localField: "_id",
          foreignField: "product_id",
          as: "thumbnails",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          seller: 1,
          quantity: 1,
          category: {
            _id: "$category._id",
            name: "$category.name",
            image: "$category.image",
          },
          thumbnails: {
            $map: {
              input: "$thumbnails",
              as: "thumb",
              in: "$$thumb.image",
            },
          },
        },
      },
    ]);
    res.json(results);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to get product", error });
  }
});

// GET CATEGORY
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get categories", error });
  }
});
// POST category
app.post("/categories", async (req, res) => {
  try {
    const { name, image } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Tạo một đối tượng Category mới
    const newCategory = new Category({
      name,
      image,
    });

    // Lưu đối tượng Category vào MongoDB
    await newCategory.save();

    // Trả về thông tin của Category vừa được tạo
    res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create category", error });
  }
});
// PUT category
app.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name, image } = req.body;

  try {
    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image },
      { new: true } // Trả về document đã được cập nhật
    );

    if (updatedCategory) {
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update category", error });
  }
});
// DELETE category
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Category.findByIdAndDelete(id);

    if (result) {
      res.json({ message: "Category deleted successfully", category: result });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete category", error });
  }
});
// // GET thumbnails
app.get("/thumbnails", async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find();
    res.json(thumbnails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get thumbnails", error });
  }
});
// POST thumbnail
app.post("/thumbnails", async (req, res) => {
  try {
    const { image, product_id } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!image || !product_id) {
      return res
        .status(400)
        .json({ message: "Image and product_id are required" });
    }

    // Tạo một đối tượng Thumbnail mới
    const newThumbnail = new Thumbnail({
      image,
      product_id: new mongoose.Types.ObjectId(product_id),
    });

    // Lưu đối tượng Thumbnail vào MongoDB
    await newThumbnail.save();

    // Trả về thông tin của Thumbnail vừa được tạo
    res.status(201).json(newThumbnail);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create thumbnail", error });
  }
});
// PUT THUMBNAIL
app.put("/thumbnails/:id", async (req, res) => {
  const { id } = req.params;
  const { image, product_id } = req.body;

  try {
    if (!image || !product_id) {
      return res
        .status(400)
        .json({ message: "Image and product_id are required" });
    }

    const updatedThumbnail = await Thumbnail.findByIdAndUpdate(
      id,
      { image, product_id: new mongoose.Types.ObjectId(product_id) },
      { new: true } // Trả về document đã được cập nhật
    );

    if (updatedThumbnail) {
      res.json(updatedThumbnail);
    } else {
      res.status(404).json({ message: "Thumbnail not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update thumbnail", error });
  }
});
// DELETE THUMBNAIL

app.delete("/thumbnails/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Thumbnail.findByIdAndDelete(id);

    if (result) {
      res.json({
        message: "Thumbnail deleted successfully",
        thumbnail: result,
      });
    } else {
      res.status(404).json({ message: "Thumbnail not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete thumbnail", error });
  }
});
// endpoint post product
app.post("/products", async (req, res) => {
  const { name, price, description, seller, quantity, category_id } = req.body;
  try {
    const newProduct = new Product({
      name,
      price,
      description,
      seller,
      quantity,
      category_id,
    });
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
      /// orm mông
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
// get user id
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get User", error });
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
  const { username, phone, isAdmin, email, password, point } = req.body;
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, phone, isAdmin, email, password, point },
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
  const { username, phone, isAdmin, email, password, point } = req.body;
  try {
    const newUser = new User({
      username,
      phone,
      isAdmin,
      email,
      password,
      point,
    });
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
