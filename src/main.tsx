import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { HumanVerification } from "./components/HumanVerification";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HumanVerification><App /></HumanVerification>
  </StrictMode>
);
