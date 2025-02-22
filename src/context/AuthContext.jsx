import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { LOGINMUTATION, QUERYUSERDATA } from "../services/Graphql";
import { useMutation, useQuery } from "@apollo/client";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  loginLoading: false,
  loginError: null,
  fetchUserError: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Fetch user data when token is available
  const { data, loading: fetchUserLoading, error: fetchUserError, refetch } = useQuery(QUERYUSERDATA, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    fetchPolicy: "network-only", // Always fetch fresh data
    skip: !token, // Skip query if no token
    onCompleted: (data) => {
      setUser(data?.me || null);
    },
  });

  useEffect(() => {
    if (!token) {
      setUser(null); // Reset user if token is removed
    }
  }, [token]);

  const [loginMutation, { loading: loginLoading, error: loginError }] = useMutation(LOGINMUTATION);

  const login = async (username, password) => {
    try {
      const { data: jwtData } = await loginMutation({
        variables: {
          input: {
            identifier: username,
            password: password,
          },
        },
      });

      const jwt = jwtData?.login?.jwt;
      if (!jwt) throw new Error("Login failed: No token received");

      localStorage.setItem("token", jwt);
      setToken(jwt);

      // Refetch user data
      await refetch();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading: fetchUserLoading,
    login,
    logout,
    loginLoading,
    loginError,
    fetchUserError,
  }), [user, fetchUserLoading, loginLoading, loginError, fetchUserError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
