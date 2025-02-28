import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedElement({ children, isProtected }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch((err) => {
      setIsAuthorized(false);
    });
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await api.post("/users/refresh", {
        refresh: refreshToken,
      });
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.token);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    console.log(now < tokenExpiration);

    if (tokenExpiration < now) {
      console.log('trying to refresh...')
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isProtected) {
    console.log(isAuthorized)
    return isAuthorized ? children : '';
  }
  return isAuthorized ? '' : children;
}

export default ProtectedElement;
