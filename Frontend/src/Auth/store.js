import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./Reducers/rootReducer.js";

const store = configureStore({
  reducer: rootReducer,
});

export default store;