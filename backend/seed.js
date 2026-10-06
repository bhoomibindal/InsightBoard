require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Order = require("./models/Order");

const daysAgo = (days) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
};

const orders = [
  {
    orderId: "#ORD-1024",
    customer: "Aarav Sharma",
    product: "Wireless Headphones",
    category: "Electronics",
    amount: 2499,
    status: "Completed",
    createdAt: daysAgo(3),
  },
  {
    orderId: "#ORD-1023",
    customer: "Meera Kapoor",
    product: "Running Shoes",
    category: "Sports",
    amount: 3299,
    status: "Processing",
    createdAt: daysAgo(8),
  },
  {
    orderId: "#ORD-1022",
    customer: "Rohan Verma",
    product: "Smart Watch",
    category: "Electronics",
    amount: 4999,
    status: "Completed",
    createdAt: daysAgo(15),
  },
  {
    orderId: "#ORD-1021",
    customer: "Ananya Singh",
    product: "Skin Care Kit",
    category: "Beauty",
    amount: 1799,
    status: "Pending",
    createdAt: daysAgo(22),
  },
  {
    orderId: "#ORD-1020",
    customer: "Kabir Mehta",
    product: "Bluetooth Speaker",
    category: "Electronics",
    amount: 2199,
    status: "Completed",
    createdAt: daysAgo(29),
  },

  {
    orderId: "#ORD-1019",
    customer: "Ishita Gupta",
    product: "Laptop Backpack",
    category: "Clothing",
    amount: 1499,
    status: "Completed",
    createdAt: daysAgo(38),
  },
  {
    orderId: "#ORD-1018",
    customer: "Aditya Malhotra",
    product: "Coffee Maker",
    category: "Home & Kitchen",
    amount: 3599,
    status: "Processing",
    createdAt: daysAgo(47),
  },
  {
    orderId: "#ORD-1017",
    customer: "Sneha Agarwal",
    product: "Yoga Mat",
    category: "Sports",
    amount: 899,
    status: "Completed",
    createdAt: daysAgo(56),
  },
  {
    orderId: "#ORD-1016",
    customer: "Rahul Bansal",
    product: "Bluetooth Earbuds",
    category: "Electronics",
    amount: 1999,
    status: "Completed",
    createdAt: daysAgo(64),
  },
  {
    orderId: "#ORD-1015",
    customer: "Priya Nair",
    product: "Face Serum",
    category: "Beauty",
    amount: 1299,
    status: "Pending",
    createdAt: daysAgo(73),
  },

  {
    orderId: "#ORD-1014",
    customer: "Vikram Joshi",
    product: "Desk Lamp",
    category: "Home & Kitchen",
    amount: 1199,
    status: "Completed",
    createdAt: daysAgo(82),
  },
  {
    orderId: "#ORD-1013",
    customer: "Neha Sethi",
    product: "Smartphone Case",
    category: "Electronics",
    amount: 799,
    status: "Completed",
    createdAt: daysAgo(91),
  },
  {
    orderId: "#ORD-1012",
    customer: "Kunal Arora",
    product: "Hoodie",
    category: "Clothing",
    amount: 1899,
    status: "Processing",
    createdAt: daysAgo(105),
  },
  {
    orderId: "#ORD-1011",
    customer: "Simran Kaur",
    product: "Air Fryer",
    category: "Home & Kitchen",
    amount: 4299,
    status: "Completed",
    createdAt: daysAgo(120),
  },
  {
    orderId: "#ORD-1010",
    customer: "Yash Tiwari",
    product: "Sports T-Shirt",
    category: "Sports",
    amount: 999,
    status: "Completed",
    createdAt: daysAgo(135),
  },

  {
    orderId: "#ORD-1009",
    customer: "Pooja Sharma",
    product: "Wireless Mouse",
    category: "Electronics",
    amount: 899,
    status: "Pending",
    createdAt: daysAgo(155),
  },
  {
    orderId: "#ORD-1008",
    customer: "Arjun Mehta",
    product: "Kitchen Organizer",
    category: "Home & Kitchen",
    amount: 1599,
    status: "Completed",
    createdAt: daysAgo(175),
  },
  {
    orderId: "#ORD-1007",
    customer: "Riya Kapoor",
    product: "Winter Jacket",
    category: "Clothing",
    amount: 3999,
    status: "Completed",
    createdAt: daysAgo(195),
  },
  {
    orderId: "#ORD-1006",
    customer: "Dev Sharma",
    product: "Fitness Band",
    category: "Sports",
    amount: 2799,
    status: "Processing",
    createdAt: daysAgo(215),
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Order.deleteMany();

    await Order.insertMany(orders);

    console.log(`${orders.length} orders seeded successfully`);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();