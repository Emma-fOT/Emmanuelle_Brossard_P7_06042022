//Documentation: https://www.youtube.com/watch?v=PKwu15ldZ7k (16:00)
import React, { useContext, useState } from "react";

// CONTEXT makes the props available to all components that use AuthContext,
// like a global state for all the children of the provider.
// Important: wrap the content of the app.js thanks to <AuthProvider></AuthProvider>
const AuthContext = React.createContext();

// Hook to have an easy access to the values of the context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  function login(username, email, password) {}

  function signup(username, email, password) {
    return fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().error;
      }
    });
  }

  const value = { currentUser, signup, login };

  return (
    //Run and render the children just if not loading
    //<AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
