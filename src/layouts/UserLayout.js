
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Folder,
  Ticket,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const menuItems = [
    { to: "/user/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/user/products", label: "Products", icon: <Package size={18} /> },
    { to: "/user/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { to: "/user/customers", label: "Customers", icon: <Users size={18} /> },
    { to: "/user/categories", label: "Categories", icon: <Folder size={18} /> },
    { to: "/user/coupons", label: "Coupons", icon: <Ticket size={18} /> },
    { to: "/user/reviews", label: "Reviews", icon: <MessageSquare size={18} /> },
    { to: "/user/analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
    { to: "/user/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>A-</span>Admin
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

export default UserLayout;