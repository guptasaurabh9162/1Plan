// src/Context/LogInContext/Login.jsx
import { createContext, useState, useEffect } from "react";
import { GoogleOAuthProvider, googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export const LogInContext = createContext(null);

export const LogInContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                setUser(res.data);
                setIsAuthenticated(true);
                localStorage.setItem("User", JSON.stringify(res.data));
            } catch (error) {
                console.error("Google Login Failed", error);
            }
        },
        onError: () => console.error("Google Login Error"),
    });

    const logout = () => {
        googleLogout();
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("User");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("User");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <LogInContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </LogInContext.Provider>
    );
};
