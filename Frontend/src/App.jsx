import React, { useState, createContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./pages/Header";
import { ACCESS_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

const socket = io(API_URL);
export const AppContext = createContext({});

function App() {
  const [newDocumentToggle, setNewDocumentToggle] = useState(false);

  function getUserID() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      return decodedToken.sub;
    }
    return null;
  }

  const toggleDocument = () =>
    setNewDocumentToggle(newDocumentToggle ? false : true);

  return (
    <AppContext.Provider
      value={{
        newDocumentToggle,
        setNewDocumentToggle,
        getUserID,
        toggleDocument,
        socket,
      }}
    >
      <>
        <div className="app">
          <Header />
          <Outlet></Outlet>
        </div>
      </>
    </AppContext.Provider>
  );
}

export default App;
