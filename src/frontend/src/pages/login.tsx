// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useContext } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./appContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext not found");
  const { loginUser } = ctx;

  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users: { username: string; password: string }[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      loginUser(username);
      navigate("/");
    } else {
      setMessage("Invalid username or password!");
    }
  };

  return (
    <div className="register-login-card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="register-login-button">Login</button>
      </form>
      <div className="error-message">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Login;
