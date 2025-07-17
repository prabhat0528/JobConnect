import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "https://jobconnect-backend.onrender.com/api/user",
    withCredentials: true,
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        try {
            const request = await client.post("/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (request.status === httpStatus.CREATED) {
                setUserData(request.data.user);
                navigate("/");
                return request.data.message;
            } else {
                throw new Error("Unexpected status code: " + request.status);
            }
        } catch (err) {
            console.error("Register error:", JSON.stringify(err, null, 2));
            throw err;
        }
    };

    const handleLogin = async (email, password) => {
        try {
            const request = await client.post("/login", {
                email,
                password,
            });

            if (request.status === httpStatus.OK) {
                setUserData(request.data.user);
                navigate("/");
            } else {
                throw new Error("Unexpected status code: " + request.status);
            }
        } catch (err) {
            console.error("Login error:", JSON.stringify(err, null, 2));
            throw err;
        }
    };

    const logout = async () => {
        try {
            await client.post("/logout");
            setUserData(null);
            navigate("/");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

//     const logout = () => {
//     localStorage.removeItem('user');
//     setUserData(null);
//   };

   
    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await client.get("/session");  
                if (response.status === 200 && response.data.user) {
                    setUserData(response.data.user);
                }
            } catch (error) {
                console.error("Session fetch error:", error);
            }
        };

        fetchUserSession();
    }, []);

    return (
        <AuthContext.Provider value={{ userData, setUserData, handleRegister, handleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
