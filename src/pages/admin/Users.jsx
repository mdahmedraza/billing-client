
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ruserget,
  rusergetById,
  ruserdelete,
  ruserupdaterole,
} from "../../redux/slices/authSlice"; // adjust path if needed
import { toast } from "react-hot-toast";
import LoadingScreen from "../../components/LoadingScreen";
import styles from "./Users.module.css";

/**
 * Helper: safely extract data from dispatched action response
 * callApi returns different shapes in different setups, so normalize
 */
const extractResponse = (resp) => {
  // resp could be: {payload: {...}}, or directly {...}, or {success: true, data: {...}}
  const r = resp?.payload ?? resp;
  // try a few known shapes
  return r?.data ?? r;
};

/**
 * Helper: robust getter for id field
 */
const getId = (u) => u?._id ?? u?.id ?? u?.userId ?? null;

const Users = () => {
  const dispatch = useDispatch();

  // global users list state from slice
  const getData = useSelector((state) => state.AuthSlice.data.ruserget);
  const users = getData?.data?.users ?? getData?.users ?? [];

  // local loading states for actions we dispatch on-demand
  const [loadingList, setLoadingList] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdateRole, setLoadingUpdateRole] = useState(false);

  // modal + selected user
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleForm, setRoleForm] = useState({ role: "" });

  // --- fetch list
  const fetchUsers = async () => {
    try {
      setLoadingList(true);
      const resp = await dispatch(ruserget());
      const data = extractResponse(resp);
      // If needed, you can inspect the raw response shape during dev:
      // console.log("ruserget response:", resp);
      setLoadingList(false);
      return data;
    } catch (err) {
      setLoadingList(false);
      console.error("fetchUsers error:", err);
      toast.error("Could not fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- view single user
  const handleView = async (id) => {
    try {
      if (!id) {
        toast.error("Invalid user id.");
        return;
      }
      setLoadingView(true);
      const resp = await dispatch(rusergetById(id));
      // console.log("rusergetById raw:", resp);
      const data = extractResponse(resp); // data might be { user: {...} } or {...}
      // try to extract user object from common places
      const user =
        data?.user ??
        data?.data?.user ??
        data?.userDetails ??
        data; // fallback to whole data

      if (!user) {
        toast.error("No user data returned.");
        console.warn("Unexpected user response shape:", resp);
        setLoadingView(false);
        return;
      }

      setSelectedUser(user);
      setRoleForm({ role: user?.role ?? "" });
      setOpenModal(true);
      setLoadingView(false);
    } catch (err) {
      setLoadingView(false);
      console.error("handleView error:", err);
      toast.error("Could not fetch user details.");
    }
  };

  // --- delete user
  const handleDelete = async (id) => {
    try {
      if (!id) {
        toast.error("Invalid user id.");
        return;
      }
      const ok = window.confirm("Are you sure you want to delete this user?");
      if (!ok) return;

      setLoadingDelete(true);
      const resp = await dispatch(ruserdelete(id));
      // console.log("ruserdelete raw:", resp);
      const data = extractResponse(resp);

      // many APIs return { success: true } or { success: true, message: '' }
      const success = data?.success ?? resp?.success ?? resp?.payload?.success ?? false;

      if (success) {
        toast.success("User deleted.");
        await fetchUsers(); // refresh list
      } else {
        // Some backends return { deletedCount: 1 } etc.
        const deletedCount = data?.deletedCount ?? data?.n ?? 0;
        if (deletedCount > 0) {
          toast.success("User deleted.");
          await fetchUsers();
        } else {
          toast.error(data?.message ?? "Could not delete user.");
          console.warn("delete not successful shape:", resp);
        }
      }
      setLoadingDelete(false);
    } catch (err) {
      setLoadingDelete(false);
      console.error("handleDelete error:", err);
      toast.error("Something went wrong while deleting.");
    }
  };

  // --- update role
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      const id = getId(selectedUser);
      if (!id) {
        toast.error("No user selected.");
        return;
      }
      if (!roleForm.role) {
        toast.error("Please choose a role.");
        return;
      }

      setLoadingUpdateRole(true);
      const resp = await dispatch(ruserupdaterole(id, { role: roleForm.role }));
      // console.log("ruserupdaterole raw:", resp);
      const data = extractResponse(resp);

      const success = data?.success ?? resp?.success ?? resp?.payload?.success ?? false;
      if (success) {
        toast.success("Role updated.");
        setOpenModal(false);
        setSelectedUser(null);
        setRoleForm({ role: "" });
        await fetchUsers();
      } else {
        toast.error(data?.message ?? "Could not update role.");
        console.warn("update role not successful shape:", resp);
      }

      setLoadingUpdateRole(false);
    } catch (err) {
      setLoadingUpdateRole(false);
      console.error("handleUpdateRole error:", err);
      toast.error("Something went wrong while updating role.");
    }
  };

  const handleRoleChange = (e) => {
    setRoleForm({ ...roleForm, [e.target.name]: e.target.value });
  };

  // render
  if (loadingList) return <LoadingScreen />;

  return (
    <div className={styles.container || ""}>
      <div className={styles.header || ""}>
        <h2>Users</h2>
        <div>
          <button onClick={() => fetchUsers()} className={styles.refreshBtn || ""}>
            Refresh
          </button>
        </div>
      </div>

      <div className={styles.tableWrap || ""}>
        <table className={styles.table || ""}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan="6">No users found.</td>
              </tr>
            )}

            {users.map((u, idx) => {
              const uid = getId(u) ?? idx;
              return (
                <tr key={uid}>
                  <td>{idx + 1}</td>
                  <td>{u.name ?? u.fullName ?? "-"}</td>
                  <td>{u.email ?? "-"}</td>
                  <td>{u.role ?? "USER"}</td>
                  <td>
                    {new Date(u.createdAt ?? u.created_at ?? Date.now()).toLocaleString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleView(uid)}
                      className={styles.btnPrimary}
                      disabled={loadingView}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(uid)}
                      className={styles.btnDanger}
                      disabled={loadingDelete}
                    >
                      {loadingDelete ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div className={styles.modalOverlay || ""}>
          <div className={styles.modal || ""}>
            <header className={styles.modalHeader || ""}>
              <h3>User Details</h3>
              <button onClick={() => { setOpenModal(false); setSelectedUser(null); }}>
                Close
              </button>
            </header>

            <div className={styles.modalBody || ""}>
              {loadingView ? (
                <LoadingScreen />
              ) : (
                <>
                  <div>
                    <strong>Name:</strong> {selectedUser?.name ?? "-"}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedUser?.email ?? "-"}
                  </div>
                  <div>
                    <strong>Contact:</strong> {selectedUser?.contactNumber ?? selectedUser?.phone ?? "-"}
                  </div>
                  <div>
                    <strong>Role:</strong> {selectedUser?.role ?? "-"}
                  </div>

                  <form onSubmit={handleUpdateRole} className={styles.roleForm || ""}>
                    <label>
                      Change Role
                      <select name="role" value={roleForm.role} onChange={handleRoleChange}>
                        <option value="">-- Select Role --</option>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="OWNER">OWNER</option>
                      </select>
                    </label>

                    <div className={styles.formActions || ""}>
                      <button type="submit" disabled={loadingUpdateRole}>
                        {loadingUpdateRole ? "Updating..." : "Update Role"}
                      </button>
                      <button type="button" onClick={() => setOpenModal(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

