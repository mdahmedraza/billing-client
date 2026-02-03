import axios from "axios";
import { BASEURL } from "../apiConfig";

const apiCall = async (method, url, data = {}, baseUrl = BASEURL) => {
  const token = localStorage.getItem("authToken");

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const config = {
    method: method.toUpperCase(),
    url: `${baseUrl}${url}`,
    headers,
  };

  // IMPORTANT: no request body for GET; use params instead
  if (config.method === "GET") {
    config.params = data;
  } else {
    config.data = data;
  }

  const response = await axios(config);
  return response.data; // parsed JSON body
};

export default apiCall;




// import axios from "axios";
// import { BASEURL } from "../apiConfig";

// const apiCall = async (method, url, data = {}, baseUrl = BASEURL) => {
//   const token = localStorage.getItem("authToken");
//   const headers = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   const response = await axios({
//     method,
//     url: `${baseUrl}${url}`,
//     data,
//     headers,
//   });
//   return response.data;
// };

// export default apiCall;
