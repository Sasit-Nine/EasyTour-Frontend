import React, { createContext, useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
    REGISTERMUTATION,
    LOGINMUTATION,
    QUERYUSERDATA
} from "../services/Graphql";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registerMutation, { loading: registerLoading, error: registerError }] = useMutation(REGISTERMUTATION);
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
                                Authorization: `Bearer ${token}`
                            }
                        }
                    });
                    setUser(userData?.me);
                } catch (error) {
                    console.log(error);
                }
            }
            setLoading(false);
        };
        loaderUser();
    }, [fetchUserData]);

    const register = async (username, email, password, remember) => {
        try {
            console.log(username, email, password);
            const { data: jwtdata } = await registerMutation({
                variables: {
                    input: {
                        username: username,
                        email: email,
                        password: password
                    }
                }
            });
            const jwt = jwtdata?.register?.jwt;
            if (remember) localStorage.setItem("token", jwt);
            sessionStorage.setItem("token", jwt);
            const { data: userData } = await fetchUserData({
                context: {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            });
            console.log(userData.me);
            setUser(userData?.me);
        } catch (error) {
            console.error("Registration error:", error.message);
            if (error.graphQLErrors) console.error("GraphQL errors:", error.graphQLErrors);
            if (error.networkError) console.error("Network error:", error.networkError);
            throw error;
        }
    };

    const login = async (username, password, remember) => {
        try {
            const { data: jwtdata } = await loginMutation({
                variables: {
                    input: {
                        identifier: username,
                        password: password
                    }
                }
            });
            const jwt = jwtdata?.login?.jwt;
            if (remember) localStorage.setItem("token", jwt);
            sessionStorage.setItem("token", jwt);
            const { data: userData } = await fetchUserData({
                context: {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            });
            console.log(userData.me);
            setUser(userData?.me);
        } catch (error) {
            console.log(error);
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
            register,
            login,
            logout,
            registerLoading,
            registerError,
            loginLoading,
            loginError,
            fetchUserError,
            fetchUserLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};