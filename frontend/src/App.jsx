import RevenueChart from "./components/RevenueChart";
import CategoryChart from "./components/CategoryChart";
import OrdersTable from "./components/OrdersTable";
import Header from "./components/Header";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  Menu,
} from "lucide-react";
import {useEffect, useState } from "react";
import { fetchStats } from "./api/dashboardApi";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [stats, setStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
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

  setStatsLoading(true);
  setStatsError("");

  fetchStats(startDate, endDate)
    .then((data) => {
      setStats(data);
      setStatsLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching dashboard stats:", error);
      setStatsError("Unable to load dashboard statistics");
      setStatsLoading(false);
    });
}, [dateRange,refreshKey]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar 
        sidebarOpen={sidebarOpen}
       setSidebarOpen={setSidebarOpen}
      />

      <main className="p-4 md:ml-64 md:p-8">
        <button
        onClick={() => setSidebarOpen(true)}
          className="mb-4 rounded-lg border border-slate-200 bg-white p-3 text-slate-700 md:hidden"
        >
        <Menu size={22} />
        </button>
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
          setDateRange={setDateRange}
          setRefreshKey={setRefreshKey}
        />
        <div>
  <h2 className="text-3xl font-bold text-slate-900">
    Dashboard Overview
  </h2>

  <p className="mt-2 text-slate-500">
    Monitor your business performance and key metrics.
  </p>

  <div className="mt-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
    {dateRange === "7" && "Last 7 Days"}
    {dateRange === "30" && "Last 30 Days"}
    {dateRange === "90" && "Last 90 Days"}
    {dateRange === "year" && "This Year"}
  </div>
</div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
  {statsLoading && (
    <div className="sm:col-span-2 xl:col-span-4 rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
      Loading dashboard statistics...
    </div>
  )}

  {statsError && !statsLoading && (
    <div className="sm:col-span-2 xl:col-span-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-500">
      {statsError}
    </div>
  )}

  {!statsLoading && !statsError && stats && (
    <>
      <StatCard
        title="Total Revenue"
        value={`₹${stats.revenue.toLocaleString("en-IN")}`}
        change="+12.5% from last month"
        icon={IndianRupee}
      />

      <StatCard
        title="Total Orders"
        value={stats.orders.toLocaleString("en-IN")}
        change="+8.2% from last month"
        icon={ShoppingCart}
      />

      <StatCard
        title="Total Customers"
        value={stats.customers.toLocaleString("en-IN")}
        change="+5.7% from last month"
        icon={Users}
      />

      <StatCard
        title="Average Order Value"
        value={`₹${stats.averageOrderValue.toLocaleString("en-IN")}`}
        change="+3.4% from last month"
        icon={TrendingUp}
      />
    </>
  )}
</div>
       <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
         <div className="xl:col-span-2">
          <RevenueChart dateRange={dateRange} refreshKey={refreshKey}/>
        </div>

  <CategoryChart dateRange={dateRange} refreshKey={refreshKey} />
</div>
<div className="mt-6">
  <OrdersTable searchQuery={searchQuery}  dateRange={dateRange} refreshKey={refreshKey} />
</div>
      </main>
    </div>
  );
}

export default App;