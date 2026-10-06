import {
  Search,
  Bell,
  CalendarDays,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

function Header({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  setRefreshKey,
}) {
  return (
    <header className="mb-8 flex items-center justify-between gap-6">
      <div className="relative max-w-md flex-1">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search orders, customers..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      </div>

      <div className="flex items-center gap-3">
  <button
    onClick={() => setRefreshKey((current) => current + 1)}
    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
    title="Refresh dashboard data"
  >
    <RefreshCw size={18} />
    <span className="hidden lg:inline">Refresh</span>
  </button>

  <div className="relative hidden md:block">
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium text-slate-600 outline-none transition hover:bg-slate-50 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <button className="relative rounded-lg border border-slate-200 bg-white p-3 text-slate-600 transition hover:bg-slate-50">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            BB
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900">
              Business Admin
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;