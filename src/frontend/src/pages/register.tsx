// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useContext } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./appContext";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext not found");
  const { loginUser } = ctx;

  const navigate = useNavigate();

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users: { username: string; password: string }[] = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.some((u) => u.username === username);
    if (existingUser) {
      setMessage("User already exists!");
    } else {
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      loginUser(username);
      navigate("/");
    }
  };

  return (
    <div className="register-login-card">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit" className="register-login-button">Register</button>
      </form>
      <div className="error-message">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Register;
