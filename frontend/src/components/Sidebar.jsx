import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Analytics", icon: BarChart3 },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ShoppingCart },
    { name: "Customers", icon: Users },
  ];

  return (
        <aside
  className={`fixed left-0 top-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 md:block md:translate-x-0 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
    <button
  onClick={() => setSidebarOpen(false)}
  className="absolute right-4 top-4 text-slate-400 hover:text-white md:hidden"
>
  <X size={22} />
</button>
      <div className="border-b border-slate-700 px-6 py-5">
        <h1 className="text-2xl font-bold">InsightBoard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Business Analytics
        </p>
      </div>

      <nav className="px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;