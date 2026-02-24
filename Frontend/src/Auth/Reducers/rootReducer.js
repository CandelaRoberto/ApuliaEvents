import { combineReducers } from "redux";
import authReducer from "../Slice/authSlice.js"; 

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;