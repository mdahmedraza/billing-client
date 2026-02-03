import React from "react";
import { Link } from "react-router-dom";

/**
 * AccessDenied
 * - Simple page shown when an authenticated user doesn't have the right role.
 */
const AccessDenied = () => {
  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <div style={{
        maxWidth: 720, textAlign: "center", border: "1px solid #eee",
        padding: 36, borderRadius: 8, boxShadow: "0 6px 24px rgba(0,0,0,0.06)"
      }}>
        <h1>Access Denied</h1>
        <p>You are signed in but you do not have permission to view that page.</p>
        <p>If you think this is a mistake, please contact an administrator.</p>

        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 12 }}>
          <Link to="/" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}>
            Go to Home / Login
          </Link>
          <Link to="/product-public" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}>
            View Public Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
