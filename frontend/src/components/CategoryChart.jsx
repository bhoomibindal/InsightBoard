import { useEffect, useState } from "react";
import { fetchCategories } from "../api/dashboardApi";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0f766e",
  "#2563eb",
  "#7c3aed",
  "#ea580c",
  "#ca8a04",
];

function CategoryChart({ dateRange,refreshKey}) {
  const [categoryData, setCategoryData] = useState([]);
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

    fetchCategories(startDate, endDate)
      .then((data) => {
        setCategoryData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
        setError("Unable to load category data");
        setLoading(false);
      });
  }, [dateRange,refreshKey]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">
     <div className="mb-4 flex items-start justify-between gap-4">
  <div>
    <h3 className="text-lg font-semibold text-slate-900">
      Sales by Category
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      Distribution of sales for the selected period
    </p>
  </div>

  <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 sm:inline-block">
    Categories
  </span>
</div> 

      <div className="h-80">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Loading category data...
          </div>
        )}

        {error && !loading && (
          <div className="flex h-full items-center justify-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && categoryData.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No category data available for this period.
          </div>
        )}

        {!loading && !error && categoryData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`${value}%`, "Sales"]}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default CategoryChart;