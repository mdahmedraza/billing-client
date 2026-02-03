

import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiCall from "../../utils/apiCall";

// initialState
const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: {
      signup: { data: null, message: null, error: null, isLoading: false },
      rotp: { data: null, message: null, error: null, isLoading: false },
      rpassword: { data: null, message: null, error: null, isLoading: false },
      rlogin: { data: null, message: null, error: null, isLoading: false },
      rdetail: { data: null, message: null, error: null, isLoading: false },
      rproductcreate: { data: null, message: null, error: null, isLoading: false },
      rproductupdate: { data: null, message: null, error: null, isLoading: false },
      rproductget: { data: null, message: null, error: null, isLoading: false },
      rproductPublic: { data: null, message: null, error: null, isLoading: false },
      ruserget: { data: null, message: null, error: null, isLoading: false },
      rusergetById: { data: null, message: null, error: null, isLoading: false },
      ruserdelete: { data: null, message: null, error: null, isLoading: false },
      ruserupdaterole: { data: null, message: null, error: null, isLoading: false },
    },
    token: localStorage.getItem("authToken") || null,
    isLoggedIn: !!localStorage.getItem("authToken"),
    role: localStorage.getItem("userRole") || null,
  },
  reducers: {
    start: (state, action) => {
      const { apiName } = action.payload;
      if (!state.data[apiName]) {
        state.data[apiName] = { data: null, message: null, error: null, isLoading: false };
      }
      state.data[apiName].isLoading = true;
      state.data[apiName].data = null;
      state.data[apiName].message = null;
      state.data[apiName].error = null;
    },

    success: (state, action) => {
      const { apiName, responseData, toastOptions } = action.payload;

      if (!state.data[apiName]) {
        state.data[apiName] = { data: null, message: null, error: null, isLoading: false };
      }

      state.data[apiName].isLoading = false;

      // responseData is the parsed body (apiCall returns response.data)
      const body = responseData ?? {};

      // normalized assignment: prefer body.data, then body.user, then whole body
      state.data[apiName].data = body.data ?? body.user ?? body ?? null;
      state.data[apiName].message = body.message ?? null;
      state.data[apiName].error = body.error ?? null;

      if (apiName === "profile") {
        localStorage.setItem("kycStatus", body?.data?.kycStatus ?? "");
      }

      if (apiName === "tradeOderList") {
        state.data[apiName].data = body?.data?.docs ?? [];
      }

      if (toastOptions?.successToast) {
        toast.success(body?.message || `${apiName} operation successful!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }

      // --- Login / token handling ---
      const loginApiNames = ["rlogin", "login", "resetPassword"]; // adjust if you use different names

      if (loginApiNames.includes(apiName)) {
        // token may be top-level or inside data
        const token = body?.token ?? body?.data?.token ?? null;

        // role may be body.user.role or nested inside data
        const roleFromResponse =
          body?.user?.role ?? body?.data?.user?.role ?? body?.data?.role ?? null;

        if (token) {
          state.token = token;
          state.isLoggedIn = true;
          localStorage.setItem("authToken", token);
        }

        if (roleFromResponse) {
          state.role = roleFromResponse;
          localStorage.setItem("userRole", roleFromResponse);
        }
      }
    },

    failure: (state, action) => {
      const { apiName, toastOptions, error } = action.payload;

      if (!state.data[apiName]) {
        state.data[apiName] = { data: null, message: null, error: null, isLoading: false };
      }

      if (apiName === "profile") {
        localStorage.removeItem("kycStatus");
      }

      state.data[apiName].isLoading = false;
      state.data[apiName].data = null;
      state.data[apiName].message = error || "Something went wrong";
      state.data[apiName].error = "true";

      if (toastOptions?.errorToast) {
        toast.error(error || "Something went wrong", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    },
  },
});

export const { start, success, failure } = authSlice.actions;

// Generic API action for all APIs
export const callApi =
  (apiName, toastOptions, method, url, data = {}, id) =>
  async (dispatch) => {
    dispatch(start({ apiName }));
    try {
      // apiCall returns parsed response.data (the JSON body)
      const response = await apiCall(method, url, data, id);
      dispatch(success({ apiName, toastOptions, responseData: response }));
      return response;
    } catch (error) {
      console.log("responseresponseresponseresponse", error?.response);
      dispatch(
        failure({
          apiName,
          toastOptions,
          error: error.response?.data?.message || error.message,
        })
      );
      return error.response?.data;
    }
  };

// helper thunks
export const signup = (data) =>
  callApi("signup", { successToast: true, errorToast: true }, "POST", "/auth/signup/request-otp", data);

export const rotp = (data) =>
  callApi("rotp", { successToast: true, errorToast: true }, "POST", "/auth/signup/verify-otp", data);

export const rpassword = (data) =>
  callApi("rpassword", { successToast: true, errorToast: true }, "POST", "/auth/signup/set-password", data);

export const rlogin = (data) =>
  callApi("rlogin", { successToast: true, errorToast: true }, "POST", "/auth/login", data);

export const rdetail = (data) =>
  callApi("rdetail", { successToast: true, errorToast: true }, "GET", "/auth/me", data);

export const rproductcreate = (data) =>
  callApi("rproductcreate", { successToast: true, errorToast: true }, "POST", "/product/create", data);
// export const rproductupdate = (data) =>
//   callApi("rproductupdate", { successToast: true, errorToast: true }, "PUT", "/product/update", data);
export const rproductupdate = (data) => 
  callApi("rproductupdate", { successToast: true, errorToast: true }, "PATCH", `/product/update/${data.id}`, data);


export const rproductget = (data) =>
  callApi("rproductget", { successToast: true, errorToast: true }, "GET", "/product", data);

// id = productId from useParams

export const rproductPublic = (id) =>
  callApi(
    "rproductPublic", { successToast: false, errorToast: true }, "GET", `/product/all/${id}`, null);


// add these exports alongside your rproduct* functions so they use the same callApi helper
export const ruserget = (data) =>
  callApi("ruserget", { successToast: false, errorToast: true }, "GET", "/auth/user", data);

export const rusergetById = (id) =>
  callApi("rusergetById", { successToast: false, errorToast: true }, "GET", `/auth/user/${id}`, null);

export const ruserdelete = (id) =>
  callApi("ruserdelete", { successToast: true, errorToast: true }, "DELETE", `/auth/user/${id}`, null);

export const ruserupdaterole = (id, data) =>
  callApi("ruserupdaterole", { successToast: true, errorToast: true }, "PUT", `/auth/user/${id}/role`, data);



export default authSlice.reducer;