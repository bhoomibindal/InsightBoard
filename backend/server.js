require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Order = require("./models/Order");
const app = express();
const PORT = 5000;
connectDB();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "InsightBoard API is running",
  });
});

// Dashboard statistics
app.get("/api/stats", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(filter);

    const totalRevenue = orders.reduce(
      (total, order) => total + order.amount,
      0
    );

    const totalOrders = orders.length;

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const uniqueCustomers = new Set(
      orders.map((order) => order.customer)
    );

    res.json({
      revenue: totalRevenue,
      orders: totalOrders,
      customers: uniqueCustomers.size,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
    });
  } catch (error) {
    console.error("Error calculating dashboard stats:", error.message);

    res.status(500).json({
      message: "Failed to calculate dashboard statistics",
    });
  }
});

// Monthly revenue
app.get("/api/revenue", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const revenueData = await Order.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedRevenue = revenueData.map((item) => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue,
    }));

    res.json(formattedRevenue);
  } catch (error) {
    console.error("Error calculating revenue data:", error.message);

    res.status(500).json({
      message: "Failed to calculate revenue data",
    });
  }
});

// Sales by category
app.get("/api/categories", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const categoryData = await Order.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: "$category",
          totalSales: {
            $sum: "$amount",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalSales",
          },
          categories: {
            $push: {
              name: "$_id",
              sales: "$totalSales",
            },
          },
        },
      },
      {
        $unwind: "$categories",
      },
      {
        $project: {
          _id: 0,
          name: "$categories.name",
          value: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$categories.sales",
                      "$totalSales",
                    ],
                  },
                  100,
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $sort: {
          value: -1,
        },
      },
    ]);

    res.json(categoryData);
  } catch (error) {
    console.error("Error calculating category data:", error.message);

    res.status(500).json({
      message: "Failed to calculate category data",
    });
  }
});

// Recent orders
app.get("/api/orders", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedOrders = orders.map((order) => ({
      id: order.orderId,
      customer: order.customer,
      product: order.product,
      amount: order.amount,
      status: order.status,
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`InsightBoard API running on http://localhost:${PORT}`);
});