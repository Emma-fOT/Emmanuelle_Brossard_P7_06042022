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
  const APIPath = "http://localhost:3000/api/auth";

  function login(email, password) {
    return fetch(APIPath + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          throw new Error(data.error);
        }
        setCurrentUser(data.user);
        return currentUser;
      });
  }

  function signup(username, email, password) {
    return fetch(APIPath + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setCurrentUser(data.user);
        return data.user;
      });
  }

  const value = { currentUser, signup, login };

  return (
    //Run and render the children just if not loading
    //<AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
