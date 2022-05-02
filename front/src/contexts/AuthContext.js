//Documentation: https://www.youtube.com/watch?v=PKwu15ldZ7k (16:00)
import React, { useContext, useState, useEffect } from "react";
import jwt from "jwt-decode";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("groupomania_token");
    try {
      const user = checkAuth(token);
      setCurrentUser(user);
    } catch (error) {
      console.log("Aucun utilisateur connecté");
    }
    setIsLoading(false);
  }, []);

  function login(email, password) {
    //Or use Axios to make a request to the API: https://www.youtube.com/watch?v=X3qyxo_UTR4&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=2 22:00
    //With Axios, no need to transform the data into JSON & not need to test if the request is ok (it sends automatically an error if not)
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
        if (data.error) {
          throw new Error(data.error);
        }
        setCurrentUser(data);
        //User infos are part of "data".
        //The token is also part of this data and is just stored in the memory of the client.
        //Also we save it in the localstorage too, in order to have a persistent access for the user :
        localStorage.setItem("groupomania_token", data.token);
        console.log("Utilisateur connecté : ", data);
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
        return data;
      });
  }

  function checkAuth(token) {
    //Decode the token
    const userId = jwt(token).userId;
    const username = jwt(token).username;
    const email = jwt(token).email;
    const role = jwt(token).role;
    const user = { token, user: { userId, username, email, role } };
    return user;
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem("groupomania_token");
  }

  function deleteProfile(userId, token) {
    return fetch(APIPath + "/" + userId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      logout();
    });
  }

  function updateProfile(username, email) {
    const token = localStorage.getItem("groupomania_token");
    const userId = jwt(token).userId;
    return fetch(APIPath + "/" + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setCurrentUser(data);
        localStorage.setItem("groupomania_token", data.token);
        console.log("Profil mis à jour : ", data);
        return currentUser;
      });
  }

  function updatePassword(currentPassword, newPassword) {
    const token = localStorage.getItem("groupomania_token");
    const userId = jwt(token).userId;
    return fetch(APIPath + "/password/" + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Mot de passe mis à jour : ************");
        return data;
      });
  }

  const value = { currentUser, signup, login, checkAuth, logout, deleteProfile, updateProfile, updatePassword };

  return (
    //Run and render the children just if not loading
    <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
    //<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
