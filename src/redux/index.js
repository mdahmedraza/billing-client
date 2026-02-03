import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";

export default combineReducers({
   AuthSlice:authReducer,
})