
import React, { createContext, useState, useEffect, useContext } from "react";
import { LOGINMUTATION, QUERYUSERDATA } from "../services/Graphql";
import { useLazyQuery, useMutation } from "@apollo/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginMutation, { loading: loginLoading, error: loginError }] = useMutation(LOGINMUTATION);
  const [fetchUserData, { loading: fetchUserLoading, error: fetchUserError }] = useLazyQuery(QUERYUSERDATA);

  useEffect(() => {
    const loaderUser = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const { data: userData } = await fetchUserData({
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          setUser(userData?.me);
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };
    loaderUser();
  }, [fetchUserData]); 

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
      sessionStorage.setItem("token", jwt);

      const { data: userData } = await fetchUserData({
        context: {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      });
      setUser(userData?.me);
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        loginLoading,
        loginError,
        fetchUserError,
        fetchUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
