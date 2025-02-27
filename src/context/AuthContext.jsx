import React, { createContext, useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    LOGINMUTATION,
    QUERYUSERDATA
} from "../services/Graphql";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginMutation, { loading: loginLoading, error: loginError }] = useMutation(LOGINMUTATION);
    const [fetchUserData, { loading: fetchUserLoading, error: fetchUserError }] = useLazyQuery(QUERYUSERDATA);

    useEffect(() => {
        const loadUser = async () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data: userData } = await fetchUserData({
                    context: {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                });
                
                if (userData?.me) {
                    setUser(userData.me);
                }
            } catch (error) {
                console.error("Error loading user:", error);
                sessionStorage.removeItem("token"); // Clear invalid token
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [fetchUserData]); // Removed user from dependency array

    const login = async (username, password) => {
        try {
            const { data: jwtData } = await loginMutation({
                variables: {
                    input: {
                        identifier: username,
                        password: password
                    }
                }
            });

            const jwt = jwtData?.login?.jwt;
            if (!jwt) {
                throw new Error("No JWT token received");
            }

            sessionStorage.setItem("token", jwt);
            
            const { data: userData } = await fetchUserData({
                context: {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            });

            if (!userData?.me) {
                throw new Error("Could not fetch user data");
            }

            setUser(userData.me);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error };
        }
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            loginLoading,
            loginError,
            fetchUserError,
            fetchUserLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);