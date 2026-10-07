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

    if (startDate && endDate) {
      const currentStart = new Date(startDate);
      const currentEnd = new Date(endDate);
      currentEnd.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: currentStart,
        $lte: currentEnd,
      };

      const periodLength =
        currentEnd.getTime() - currentStart.getTime() + 1;

      const previousEnd = new Date(currentStart.getTime() - 1);
      const previousStart = new Date(
        previousEnd.getTime() - periodLength + 1
      );

      const [currentOrders, previousOrders] = await Promise.all([
        Order.find(filter),
        Order.find({
          createdAt: {
            $gte: previousStart,
            $lte: previousEnd,
          },
        }),
      ]);

      const calculateStats = (orders) => {
        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.amount,
          0
        );

        const totalOrders = orders.length;

        const uniqueCustomers = new Set(
          orders.map((order) => order.customer)
        );

        const totalCustomers = uniqueCustomers.size;

        const averageOrderValue =
          totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
          revenue: totalRevenue,
          orders: totalOrders,
          customers: totalCustomers,
          averageOrderValue,
        };
      };

      const currentStats = calculateStats(currentOrders);
      const previousStats = calculateStats(previousOrders);

      const calculateChange = (current, previous) => {
        if (previous === 0) {
          return current === 0 ? 0 : 100;
        }

        return ((current - previous) / previous) * 100;
      };

      return res.json({
        ...currentStats,
        changes: {
          revenue: calculateChange(
            currentStats.revenue,
            previousStats.revenue
          ),
          orders: calculateChange(
            currentStats.orders,
            previousStats.orders
          ),
          customers: calculateChange(
            currentStats.customers,
            previousStats.customers
          ),
          averageOrderValue: calculateChange(
            currentStats.averageOrderValue,
            previousStats.averageOrderValue
          ),
        },
        previousPeriod: previousStats,
      });
    }

    const orders = await Order.find();

    const stats = {
      revenue: orders.reduce((sum, order) => sum + order.amount, 0),
      orders: orders.length,
      customers: new Set(orders.map((order) => order.customer)).size,
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.amount, 0) /
            orders.length
          : 0,
    };

    res.json({
      ...stats,
      changes: {
        revenue: 0,
        orders: 0,
        customers: 0,
        averageOrderValue: 0,
      },
      previousPeriod: {
        revenue: 0,
        orders: 0,
        customers: 0,
        averageOrderValue: 0,
      },
    });
  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ message: "Failed to fetch stats" });
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