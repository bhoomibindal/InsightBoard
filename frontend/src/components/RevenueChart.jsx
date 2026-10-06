import { useEffect, useState } from "react";
import { fetchRevenue } from "../api/dashboardApi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function RevenueChart({ dateRange,refreshKey}) {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date();

    const endDate = today.toISOString().split("T")[0];

    const start = new Date(today);

    if (dateRange === "7") {
      start.setDate(start.getDate() - 6);
    } else if (dateRange === "30") {
      start.setDate(start.getDate() - 29);
    } else if (dateRange === "90") {
      start.setDate(start.getDate() - 89);
    } else if (dateRange === "year") {
      start.setMonth(0, 1);
    }

    const startDate = start.toISOString().split("T")[0];

    setLoading(true);
    setError("");

    fetchRevenue(startDate, endDate)
      .then((data) => {
        setRevenueData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching revenue data:", error);
        setError("Unable to load revenue data");
        setLoading(false);
      });
  }, [dateRange,refreshKey]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
     <div className="mb-6 flex items-start justify-between gap-4">
  <div>
    <h3 className="text-lg font-semibold text-slate-900">
      Revenue Overview
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      Revenue performance for the selected period
    </p>
  </div>

  <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 sm:inline-block">
    Revenue
  </span>
</div>

      <div className="h-80">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Loading revenue data...
          </div>
        )}

        {error && !loading && (
          <div className="flex h-full items-center justify-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && revenueData.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No revenue data available for this period.
          </div>
        )}

        {!loading && !error && revenueData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis
                tickFormatter={(value) => `₹${value / 1000}k`}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0f766e"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default RevenueChart;