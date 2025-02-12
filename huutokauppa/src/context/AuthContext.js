"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Helper functions to manage cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value}; path=/`;

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in cookies on the client side when the app loads
    const storedToken = getCookie("auth_token"); // Get the stored token from cookies
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      verifyToken()
    }
  }, []);

  const login = (newToken, name) => {
    // Set token in cookies and update state
    setToken(newToken);
    setIsLoggedIn(true);
    setUser(name)
    setCookie("auth_token", newToken, {
      maxAge: 30 * 24 * 60 * 60, // Cookie expires in 30 days
    });
  };

  const logout = () => {
    // Remove token from state and cookies
    setToken(null);
    setIsLoggedIn(false);
    deleteCookie("auth_token"); // Remove the auth_token cookie
  };

  const verifyToken = async () => {
    const token = getCookie("auth_token");
    try {
      const response = await fetch(process.env.REST_API_URL + "/api/auth/verify", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log("AUTHORIZATION TOKEN VERIFICATION SUCCESFULL")
        setUser(result.name);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("ERROR DURING TOKEN VERIFICATION", error);
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn, 
        setIsLoggedIn,
        login,
        logout,
        verifyToken,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
