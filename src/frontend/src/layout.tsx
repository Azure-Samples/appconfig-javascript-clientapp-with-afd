// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useContext } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "./pages/appContext";

interface LayoutProps { children: ReactNode }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const ctx = useContext(AppContext);
  const { currentUser, logoutUser } = ctx!;
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo">App Configuration Chat Bot</Link>
        </div>
        <div className="navbar-right">
          {currentUser ? (
            <>
              <span>Hello, {currentUser}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
};

export default Layout;
