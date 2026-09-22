"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ChartPieIcon,
  ClipboardListIcon,
  ShoppingBagIcon,
  BarChart,
  Grid2X2,
  UserIcon,
  LogOut,
  RefreshCw,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type AdminOrder = {
  id: number;
  owner: string;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
};

type AdminData = {
  stats: { orders: number; revenue: number; users: number };
  revenueByDay: { date: string; total: number }[];
  orders: AdminOrder[];
};

const TABS = [
  { name: "dashboard", icon: <Grid2X2 className="w-5 h-5 inline mr-2" /> },
  { name: "orders", icon: <ClipboardListIcon className="w-5 h-5 inline mr-2" /> },
  { name: "revenue", icon: <BarChart className="w-5 h-5 inline mr-2" /> },
  { name: "customers", icon: <UserIcon className="w-5 h-5 inline mr-2" /> },
] as const;

type Tab = (typeof TABS)[number]["name"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Session check on mount
  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((d) => {
        setIsAuthenticated(Boolean(d.ok));
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  const load = () => {
    setLoadingData(true);
    fetch("/api/admin/orders")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("load failed"))))
      .then((d: AdminData) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoadingData(false));
  };

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Login failed — please try again");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setIsAuthenticated(false);
    setUsername("");
  };

  if (!authChecked) {
    return <div className="min-h-screen bg-gray-950" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-800">
          <h2 className="text-3xl font-bold mb-2 text-center text-white">Admin Login</h2>
          <p className="text-gray-500 text-sm text-center mb-6">SHOP.CO control panel</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-200 transition font-semibold"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const stats = data?.stats ?? { orders: 0, revenue: 0, users: 0 };
  const orders = data?.orders ?? [];

  const revenueData = {
    labels: (data?.revenueByDay ?? []).map((d) => d.date.slice(5)),
    datasets: [
      {
        label: "Revenue (USD)",
        data: (data?.revenueByDay ?? []).map((d) => d.total),
        borderColor: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="md:w-64 w-full md:min-h-screen bg-gray-900 p-6 border-b md:border-b-0 md:border-r border-gray-800">
        <h1 className="text-2xl font-bold mb-8 md:text-left text-center">Admin</h1>
        <nav>
          <ul className="flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:space-x-0">
            {TABS.map(({ name, icon }) => (
              <li key={name}>
                <button
                  onClick={() => setActiveTab(name)}
                  className={`w-full text-left p-3 rounded-xl capitalize whitespace-nowrap transition-colors ${
                    activeTab === name
                      ? "bg-white text-black font-semibold"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  {icon} {name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-center border-b border-gray-800 pb-4 gap-3">
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              aria-label="Refresh data"
              className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  title: "Total Orders",
                  value: stats.orders,
                  icon: <ClipboardListIcon className="w-6 h-6" />,
                },
                {
                  title: "Total Revenue",
                  value: `$${stats.revenue.toFixed(2)}`,
                  icon: <ChartPieIcon className="w-6 h-6" />,
                },
                {
                  title: "Registered Users",
                  value: stats.users,
                  icon: <UserIcon className="w-6 h-6" />,
                },
              ].map((stat) => (
                <div
                  key={stat.title}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 overflow-x-auto">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm">No orders yet — they will appear here after the first checkout.</p>
              ) : (
                <OrdersTable orders={orders.slice(0, 8)} />
              )}
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Order History</h3>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders yet.</p>
            ) : (
              <OrdersTable orders={orders} />
            )}
          </div>
        )}

        {/* Revenue */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Total Revenue", value: `$${stats.revenue.toFixed(2)}` },
                {
                  title: "Avg Order Value",
                  value:
                    stats.orders > 0 ? `$${(stats.revenue / stats.orders).toFixed(2)}` : "$0.00",
                },
                { title: "Orders", value: stats.orders },
                { title: "Registered Users", value: stats.users },
              ].map((stat) => (
                <div key={stat.title} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                  <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
              <div className="w-full h-72">
                {revenueData.labels.length > 0 ? (
                  <Line data={revenueData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <p className="text-gray-500 text-sm">No revenue data yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Customers */}
        {activeTab === "customers" && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Customers</h3>
            <p className="text-gray-400 text-sm">
              {stats.users} registered account(s). Customer profiles are managed in Clerk —
              addresses and order history live in the store database and are tied to each
              customer&apos;s orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-800/60">
        <tr>
          <th className="p-3 text-left rounded-tl-xl">Order</th>
          <th className="p-3 text-left">Date</th>
          <th className="p-3 text-left">Items</th>
          <th className="p-3 text-left">Total</th>
          <th className="p-3 text-left rounded-tr-xl">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-gray-800/60">
            <td className="p-3 font-medium">#{order.id}</td>
            <td className="p-3 text-gray-400">
              {new Date(order.createdAt).toLocaleDateString()}{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
            <td className="p-3 text-gray-300 max-w-[280px]">
              {order.items
                ?.map((i) => `${i.quantity} × ${i.name}`)
                .join(", ") || "—"}
            </td>
            <td className="p-3 font-semibold">${Number(order.total).toFixed(2)}</td>
            <td className="p-3">
              <span className="px-2.5 py-1 rounded-full text-xs bg-white/10 border border-white/10">
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
