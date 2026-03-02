import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,
    isAuthenticated: !!user,
  },
  reducers: {
    registrazioneUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    loginUser: (state, action) => {
      state.user= action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { registrazioneUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;