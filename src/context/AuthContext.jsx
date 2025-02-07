import React, { createContext, useState, useEffect, useContext, Children } from "react";
const AuthContext = createContext()
import { LOGINMUTATION } from "../services/Graphql";
import { useLazyQuery, useMutation } from "@apollo/client";
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {

    })
    const [loginMutation,{loading:loginLoading,error:loginError}] = useMutation(LOGINMUTATION)
    const login = async (username, password) => {
        try {
            const { data:jwt } = await loginMutation({
                variables: {
                    input: {
                        identifier: username,
                        password: password
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}