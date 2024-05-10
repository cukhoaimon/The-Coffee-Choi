import { createContext, useEffect, useState } from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { API_SERVER } from "../config";

import { LOCAL_STORAGE_TOKEN_NAME } from "../config";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check token is exist
  const loadUser = async () => {
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME])
      setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);

    try {
      const response = await axios.get(`${API_SERVER}/users`, {
        withCredentials: true,
        authorization: `Bearer ${localStorage[LOCAL_STORAGE_TOKEN_NAME]}`,
      });
      if (response.data.status === "success") {
        setIsAuth(true);

        setCurrentUser({
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          phone: response.data.data.user.phone,
          address: response.data.data.user.address,
          balance: response.data.data.balance,
        });
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthToken(null);
      setIsAuth(false);
      setCurrentUser(null);
    }

    setIsLoading(false);
  };

  // Each time reload -> check user
  useEffect(() => {
    loadUser();
  }, []);

  // Login user
  const loginUser = async (loginForm) => {
    try {
      const response = await axios.post(`${API_SERVER}/users/login`, loginForm);
      if (response.data.status === "success") {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.token);
        await loadUser();
      }

      return response.data;
    } catch (err) {
      // error we can handle
      if (err.response.data) return err.response.data;
      // new error
      else return { status: "failed", message: err.message };
    }
  };

  // Third party login
  const thirdPartyLogin = async (token) => {
    try {
      if (token) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, token);
        await loadUser();

        return { status: "success" };
      }
      return { status: "failed", message: "Token is invalid" };
    } catch (error) {
      if (error.response.data) return error.response.data;
      else return { status: "failed", message: error.message };
    }
  };

  // register user
  const registerUser = async (registerForm) => {
    try {
      const response = await axios.post(
        `${API_SERVER}/users/signup`,
        registerForm
      );

      if (response.data.status === "success") {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.token);
        await loadUser();
      }

      return response.data;
    } catch (err) {
      return { status: "failed", message: err.message };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    setAuthToken(null);
    setIsAuth(false);
  };

  //Context data
  const authContextData = {
    isAuth,
    isLoading,
    loadUser,
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
    thirdPartyLogin,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};
