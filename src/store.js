import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";   // FIXED
import Reducer from "./redux/index";

const store = createStore(Reducer, applyMiddleware(thunk));

export default store;
