// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'

window.addEventListener("beforeunload", () => {
  // clear the localStorage when the user leaves the page
  localStorage.clear()
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
