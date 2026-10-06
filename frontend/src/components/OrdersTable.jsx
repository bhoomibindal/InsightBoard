import { useEffect, useState } from "react";
import { fetchOrders } from "../api/dashboardApi";

function OrdersTable({ searchQuery, dateRange,refreshKey}) {
  const [orders, setOrders] = useState([]);
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

    fetchOrders(startDate, endDate)
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Unable to load orders");
        setLoading(false);
      });
  }, [dateRange,refreshKey]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.product.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  });

  return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Recent Orders
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {searchQuery
            ? `Showing ${filteredOrders.length} matching orders`
            : "Orders for the selected period"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Order ID
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Customer
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Product
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Amount
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  Loading orders...
                </td>
              </tr>
            )}

            {error && !loading && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-sm text-red-500"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {order.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {order.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {order.product}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}

            {!loading &&
              !error &&
              filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;