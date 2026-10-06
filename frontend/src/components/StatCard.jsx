function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 truncate text-2xl font-bold text-slate-900">
            {value}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              {change}
            </span>

            <span className="text-xs text-slate-400">
              vs previous period
            </span>
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-slate-100 p-3">
          <Icon
            size={22}
            className="text-slate-700"
          />
        </div>
      </div>
    </div>
  );
}

export default StatCard;