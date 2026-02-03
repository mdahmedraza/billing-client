
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import {
  Home,
  Package,
  ShoppingCart,
  // Users,
  // Folder,
  // Ticket,
  // MessageSquare,
  // BarChart2,
  // Settings,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/admin/products", label: "Products", icon: <Package size={18} /> },
    { to: "/admin/users", label: "Users", icon: <Package size={18} /> },
    { to: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    // { to: "/admin/customers", label: "Customers", icon: <Users size={18} /> },
    // { to: "/admin/categories", label: "Categories", icon: <Folder size={18} /> },
    // { to: "/admin/coupons", label: "Coupons", icon: <Ticket size={18} /> },
    // { to: "/admin/reviews", label: "Reviews", icon: <MessageSquare size={18} /> },
    // { to: "/admin/analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
    // { to: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>AA-</span>Admin
        </div>
        <nav className={styles.nav}>
          {menuItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} style={{ marginRight: "6px" }} />
          Logout
        </button>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;