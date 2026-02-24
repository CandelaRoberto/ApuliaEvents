import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
const token = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,
    token: token,
    isAuthenticated: !!token,
  },
  reducers: {
    registrazioneUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    loginUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { registrazioneUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;