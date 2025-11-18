// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

import { server } from "./server.js";

async function startServer() 
{
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer()
  .catch((err) => {
    console.error("Failed to start server:", err);
});