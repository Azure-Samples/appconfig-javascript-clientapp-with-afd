// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ContextProvider } from "./pages/appContext";
import Layout from "./layout";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";


function App() {
  return (
    <ContextProvider>
      <Router>
      <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </Router>
    </ContextProvider>
  );
}

export default App;