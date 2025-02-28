import React from "react";
import { Link } from "react-router-dom";
import ProtectedElement from "../components/ProtectedApiRoutes.jsx/ProtectedElement";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import InviteNotification from "../components/InviteNotification";

const Header = () => {
  const handleLogout = (e) => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    window.location.reload();
  };

  return (
    <nav className="header">
      <Link className="header__btn" to={"/"}>
        <span className="header__btn-text">Home</span>
      </Link>
      <Link className="header__btn" to={"/about"}>
        <span className="header__btn-text">About</span>
      </Link>
      <ProtectedElement isProtected={true}>
        <Link className="header__btn" to={"/documents"}>
          <span className="header__btn-text">See Documents</span>
        </Link>
        <Link className="header__btn" to={"/documents/createDocument"}>
          <span className="header__btn-text">Create new Document</span>
        </Link>
      </ProtectedElement>
      <div className="header__login-cont">
        <ProtectedElement isProtected={false}>
          <Link className="header__btn" to={"/login"}>
            <span className="header__btn-text">Log in</span>
          </Link>
          <Link className="header__btn" to={"/register"}>
            <span className="header__btn-text">Sign up</span>
          </Link>
        </ProtectedElement>
        <ProtectedElement isProtected={true}>
          <InviteNotification />
          <button type="submit" className="header__btn" onClick={handleLogout}>
            <span className="header__btn-text">Log out</span>
          </button>
        </ProtectedElement>
      </div>
    </nav>
  );
};

export default Header;
